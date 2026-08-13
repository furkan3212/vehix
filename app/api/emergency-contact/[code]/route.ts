import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { code } = await context.params;

    const qrCode = decodeURIComponent(code)
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
     * Find the QR inventory record.
     *
     * We only use the QR code supplied by the
     * public QR page. We do not trust the browser
     * with the owner's user ID.
     */

    const { data: qrData, error: qrError } =
      await supabase
        .from("qr_inventory")
        .select("qr_code, vehicle_id, status")
        .eq("qr_code", qrCode)
        .maybeSingle();

    if (qrError) {
      console.error(
        "Emergency QR lookup error:",
        qrError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify QR code.",
        },
        { status: 500 }
      );
    }

    if (!qrData) {
      return NextResponse.json(
        {
          success: false,
          error: "QR code not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Only activated QR codes can expose
     * an emergency contact.
     */

    if (qrData.status !== "activated") {
      return NextResponse.json(
        {
          success: false,
          error: "This QR code is not active.",
        },
        { status: 403 }
      );
    }

    if (!qrData.vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error: "No vehicle is linked to this QR code.",
        },
        { status: 404 }
      );
    }

    /*
     * Find the vehicle owner.
     */

    const { data: vehicleData, error: vehicleError } =
      await supabase
        .from("vehicles")
        .select("user_id")
        .eq("id", qrData.vehicle_id)
        .maybeSingle();

    if (vehicleError) {
      console.error(
        "Emergency vehicle lookup error:",
        vehicleError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to find vehicle owner.",
        },
        { status: 500 }
      );
    }

    if (!vehicleData?.user_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehicle owner not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Get ONLY the emergency contact information.
     *
     * We intentionally do NOT return:
     * - owner phone
     * - owner WhatsApp
     * - owner email
     * - owner address
     * - user ID
     */

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("emergency_name, emergency_phone")
        .eq("id", vehicleData.user_id)
        .maybeSingle();

    if (profileError) {
      console.error(
        "Emergency profile lookup error:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to retrieve emergency contact.",
        },
        { status: 500 }
      );
    }

    if (!profileData) {
      return NextResponse.json(
        {
          success: false,
          error: "Emergency contact is not configured.",
        },
        { status: 404 }
      );
    }

    const emergencyName =
      profileData.emergency_name?.trim() || "";

    const emergencyPhone =
      profileData.emergency_phone?.trim() || "";

    /*
     * Emergency contact is mandatory for Vehix.
     */

    if (!emergencyName || !emergencyPhone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Emergency contact has not been configured for this vehicle.",
        },
        { status: 404 }
      );
    }

    /*
     * Return ONLY what the QR page needs.
     */

    return NextResponse.json(
      {
        success: true,
        emergency_name: emergencyName,
        emergency_phone: emergencyPhone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Emergency contact API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while retrieving the emergency contact.",
      },
      { status: 500 }
    );
  }
}