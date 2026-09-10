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

function firstFiniteNumber(
  row: Record<string, unknown>,
  keys: string[]
): number | null {
  for (const key of keys) {
    const value = row[key];
    const number =
      typeof value === "number"
        ? value
        : typeof value === "string" && value.trim()
          ? Number(value)
          : NaN;

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return null;
}

function firstString(
  row: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

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
     * Verify the QR first. Only an activated QR linked to a
     * vehicle can expose the vehicle's public parking location.
     */
    const { data: qr, error: qrError } =
      await supabaseAdmin
        .from("qr_inventory")
        .select("qr_code, status, vehicle_id")
        .eq("qr_code", qrCode)
        .maybeSingle();

    if (qrError) {
      console.error(
        "Public parking QR lookup error:",
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

    if (qr.status !== "activated" || !qr.vehicle_id) {
      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    /*
     * Enforce the owner's Smart Parking visibility setting on the
     * server as well as the client. A hidden feature must never
     * become public merely by calling this endpoint directly.
     */
    const { data: featureSettings, error: featureError } =
      await supabaseAdmin
        .from("vehicle_feature_settings")
        .select("smart_parking")
        .eq("vehicle_id", qr.vehicle_id)
        .maybeSingle();

    if (featureError) {
      console.error(
        "Public smart parking feature lookup error:",
        featureError
      );

      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    if (featureSettings && featureSettings.smart_parking === false) {
      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    /*
     * vehicle_locations is an existing Vehix data source.
     * We intentionally project only the location fields below.
     * The row may use slightly different naming depending on the
     * current database version, so the mapper supports the common
     * Vehix location column names without exposing the whole row.
     */
    const { data: rows, error: locationError } =
      await supabaseAdmin
        .from("vehicle_locations")
        .select("*")
        .eq("vehicle_id", qr.vehicle_id)
        .limit(1);

    if (locationError) {
      console.error(
        "Public parking location lookup error:",
        locationError
      );

      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    const row =
      rows && rows.length > 0
        ? (rows[0] as Record<string, unknown>)
        : null;

    if (!row) {
      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    const latitude = firstFiniteNumber(row, [
      "latitude",
      "lat",
      "location_latitude",
    ]);

    const longitude = firstFiniteNumber(row, [
      "longitude",
      "lng",
      "lon",
      "location_longitude",
    ]);

    if (latitude === null || longitude === null) {
      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json({
        success: true,
        location: null,
      });
    }

    const label = firstString(row, [
      "location_name",
      "place_name",
      "address",
      "location",
      "name",
      "parking_note",
      "notes",
    ]);

    const savedAt = firstString(row, [
      "updated_at",
      "saved_at",
      "location_saved_at",
      "created_at",
    ]);

    const directionsUrl =
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${latitude},${longitude}`
      )}`;

    return NextResponse.json({
      success: true,
      location: {
        latitude,
        longitude,
        label,
        saved_at: savedAt,
        directions_url: directionsUrl,
      },
    });
  } catch (error) {
    console.error(
      "Public vehicle location API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load the parking location.",
      },
      { status: 500 }
    );
  }
}
