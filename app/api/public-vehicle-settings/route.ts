import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const DEFAULT_FEATURES = {
  digital_identity: true,
  public_vehicle_page: true,
  vehicle_information: true,
  share_vehicle: true,
  contact_owner: true,
  smart_parking: true,
  emergency_mode: true,
  theft_assist: true,
  document_verification: true,
  vehicle_passport: true,
  smart_maintenance: true,
  scan_activity: true,
  notifications: true,
};

const FEATURE_COLUMNS = Object.keys(DEFAULT_FEATURES).join(", ");

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase server configuration is missing.",
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);

    const qrCode = (
      url.searchParams.get("qr_code") || ""
    )
      .trim()
      .toUpperCase();

    if (!qrCode) {
      return NextResponse.json(
        {
          success: false,
          error: "QR code is required.",
        },
        { status: 400 }
      );
    }

    /*
     * 1. Verify QR
     */
    const { data: qr, error: qrError } =
      await supabaseAdmin
        .from("qr_inventory")
        .select("qr_code, status, vehicle_id")
        .eq("qr_code", qrCode)
        .maybeSingle();

    if (qrError) {
      console.error(
        "Public feature QR lookup error:",
        qrError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify the QR code.",
        },
        { status: 500 }
      );
    }

    if (!qr) {
      return NextResponse.json(
        {
          success: false,
          error: "QR code not found.",
        },
        { status: 404 }
      );
    }

    /*
     * 2. QR must be activated and linked
     */
    if (
      qr.status !== "activated" ||
      !qr.vehicle_id
    ) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_FEATURES,
      });
    }

    /*
     * 3. Load vehicle feature settings
     *
     * Only feature switches are returned.
     * No owner/profile/contact information is exposed.
     */
    const {
      data: settings,
      error: settingsError,
    } = await supabaseAdmin
      .from("vehicle_feature_settings")
      .select(FEATURE_COLUMNS)
      .eq("vehicle_id", qr.vehicle_id)
      .maybeSingle();

    if (settingsError) {
      console.error(
        "Public feature settings lookup error:",
        settingsError
      );

      /*
       * If the optional settings record cannot be loaded,
       * keep the public QR page functional using safe defaults.
       */
      return NextResponse.json({
        success: true,
        settings: DEFAULT_FEATURES,
      });
    }

    /*
     * Supabase may infer the returned row as an unknown
     * object depending on the project's database typings.
     *
     * Validate that the result is actually an object before
     * merging it with the default feature configuration.
     */
    const safeSettings: Record<
      string,
      boolean | null | undefined
    > =
      settings &&
      typeof settings === "object" &&
      !Array.isArray(settings)
        ? (settings as Record<
            string,
            boolean | null | undefined
          >)
        : {};

    return NextResponse.json({
      success: true,
      settings: {
        ...DEFAULT_FEATURES,
        ...safeSettings,
      },
    });
  } catch (error) {
    console.error(
      "Public vehicle settings API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load vehicle feature settings.",
      },
      { status: 500 }
    );
  }
}