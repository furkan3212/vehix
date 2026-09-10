import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/*
 * =========================================================
 * VEHIX → EXOTEL PRIVATE CALL API
 * =========================================================
 *
 * Flow:
 *
 * Public QR visitor
 *        ↓
 * /api/vehicle-call
 *        ↓
 * Validate QR + vehicle + Contact Owner setting
 *        ↓
 * Exotel calls visitor first
 *        ↓
 * Visitor answers
 *        ↓
 * Exotel opens Vehix flow
 *        ↓
 * Connect applet calls /api/exotel/connect
 *        ↓
 * QR resolves to owner number server-side
 *        ↓
 * Visitor ↔ Owner are connected
 *
 * IMPORTANT:
 * - Exotel credentials remain server-side.
 * - Owner phone is never returned to the browser.
 * - The browser only supplies the visitor's phone number.
 * =========================================================
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const exotelApiKey = process.env.EXOTEL_API_KEY;
const exotelApiToken = process.env.EXOTEL_API_TOKEN;
const exotelAccountSid = process.env.EXOTEL_ACCOUNT_SID;
const exotelFlowUrl =
  process.env.EXOTEL_FLOW_URL ||
  "https://my.exotel.com/flow-control/flow/1338353";

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
}

if (!exotelApiKey) {
  throw new Error("Missing EXOTEL_API_KEY.");
}

if (!exotelApiToken) {
  throw new Error("Missing EXOTEL_API_TOKEN.");
}

if (!exotelAccountSid) {
  throw new Error("Missing EXOTEL_ACCOUNT_SID.");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/*
 * Vehix ExoPhone used as the caller ID.
 * Keep this server-side.
 */
const VEHIX_EXOTEL_NUMBER = "09513886363";

/*
 * Singapore Exotel cluster.
 * If your Exotel account is on the Mumbai cluster,
 * change this to https://api.in.exotel.com.
 */
const EXOTEL_BASE_URL = "https://api.exotel.com";

function normalizeExotelPhone(
  phone: string | null | undefined
): string {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, "");

  if (!digits) return "";

  // +91XXXXXXXXXX / 91XXXXXXXXXX → 0XXXXXXXXXX
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = `0${digits.slice(2)}`;
  }

  // Already in Exotel's Indian mobile format.
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits;
  }

  // Plain Indian 10-digit mobile number.
  if (digits.length === 10) {
    return `0${digits}`;
  }

  return digits;
}

async function parseExotelResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    try {
      return {
        type: "json",
        data: JSON.parse(text),
        raw: text,
      };
    } catch {
      return {
        type: "text",
        data: null,
        raw: text,
      };
    }
  }

  return {
    type: "text",
    data: null,
    raw: text,
  };
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const requestBody = body as Record<string, unknown>;
    const rawQrCode = requestBody.qr_code;
    const rawCallerPhone = requestBody.caller_phone;

    if (
      typeof rawQrCode !== "string" ||
      !rawQrCode.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehix QR code is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof rawCallerPhone !== "string" ||
      !rawCallerPhone.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Your phone number is required to start the call.",
        },
        { status: 400 }
      );
    }

    const qrCode = rawQrCode.trim().toUpperCase();
    const callerPhone = normalizeExotelPhone(rawCallerPhone);

    if (!callerPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid phone number.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
     * 1. VERIFY QR
     * ----------------------------------------------------- */

    const { data: qr, error: qrError } = await supabaseAdmin
      .from("qr_inventory")
      .select("id, qr_code, status, vehicle_id")
      .eq("qr_code", qrCode)
      .maybeSingle();

    if (qrError) {
      console.error("Vehix call QR lookup error:", qrError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify this Vehix QR.",
        },
        { status: 500 }
      );
    }

    if (!qr) {
      return NextResponse.json(
        {
          success: false,
          error: "This Vehix QR code could not be found.",
        },
        { status: 404 }
      );
    }

    if (String(qr.status).toLowerCase() !== "activated") {
      return NextResponse.json(
        {
          success: false,
          error: "This Vehix QR is not activated.",
        },
        { status: 400 }
      );
    }

    if (!qr.vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error: "This Vehix QR is not linked to a vehicle.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
     * 2. VERIFY VEHICLE
     * ----------------------------------------------------- */

    const { data: vehicle, error: vehicleError } =
      await supabaseAdmin
        .from("vehicles")
        .select("id, user_id, vehicle_number, brand, model")
        .eq("id", qr.vehicle_id)
        .maybeSingle();

    if (vehicleError) {
      console.error(
        "Vehix call vehicle lookup error:",
        vehicleError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify the vehicle.",
        },
        { status: 500 }
      );
    }

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error: "The vehicle linked to this QR could not be found.",
        },
        { status: 404 }
      );
    }

    if (!vehicle.user_id) {
      return NextResponse.json(
        {
          success: false,
          error: "This vehicle does not have a registered owner.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
     * 3. CONTACT OWNER MUST BE ENABLED
     * ----------------------------------------------------- */

    const { data: featureSettings, error: featureError } =
      await supabaseAdmin
        .from("vehicle_feature_settings")
        .select("contact_owner")
        .eq("vehicle_id", vehicle.id)
        .maybeSingle();

    if (featureError) {
      console.error(
        "Vehix call feature settings error:",
        featureError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify private call settings.",
        },
        { status: 500 }
      );
    }

    if (
      !featureSettings ||
      featureSettings.contact_owner !== true
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "The vehicle owner has disabled private calls.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------------------
     * 4. START EXOTEL CALL
     * -----------------------------------------------------
     *
     * Exotel's official Calls/connect API first calls the
     * number supplied in From. Once that party answers,
     * Exotel executes the configured flow.
     *
     * The QR code is carried in CustomField so the flow's
     * Connect applet can call /api/exotel/connect and resolve
     * the owner's number server-side.
     * ----------------------------------------------------- */

    const exotelUrl =
      `${EXOTEL_BASE_URL}/v1/Accounts/` +
      `${encodeURIComponent(String(exotelAccountSid))}/Calls/connect`;

    const params = new URLSearchParams();

    params.set("From", callerPhone);
    params.set("CallerId", VEHIX_EXOTEL_NUMBER);
    params.set("CallType", "trans");
    params.set("Url", exotelFlowUrl);
    params.set("CustomField", qrCode);
    params.set("TimeOut", "45");
    params.set("TimeLimit", "1800");

    const basicAuth = Buffer.from(
      `${exotelApiKey}:${exotelApiToken}`
    ).toString("base64");

    const exotelResponse = await fetch(exotelUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    const exotelResult = await parseExotelResponse(exotelResponse);

    if (!exotelResponse.ok) {
      console.error("Vehix Exotel call error:", {
        status: exotelResponse.status,
        response: exotelResult.raw,
        qrCode,
        vehicleId: vehicle.id,
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Vehix could not start the call. Please try again.",
        },
        { status: 502 }
      );
    }

    console.info("Vehix Exotel call started:", {
      qrCode,
      vehicleId: vehicle.id,
      exotelNumber: VEHIX_EXOTEL_NUMBER,
      exotelStatus: exotelResponse.status,
    });

    return NextResponse.json({
      success: true,
      message:
        "Vehix is calling your number. Answer it to connect with the vehicle owner.",
      caller_id: VEHIX_EXOTEL_NUMBER,
      vehicle_id: vehicle.id,
      call_started: true,
    });
  } catch (error) {
    console.error("Vehix vehicle-call API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while starting the Vehix call.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint only accepts POST requests.",
    },
    { status: 405 }
  );
}
