import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/*
|--------------------------------------------------------------------------
| Environment
|--------------------------------------------------------------------------
*/

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const EXOTEL_API_KEY =
  process.env.EXOTEL_API_KEY;

const EXOTEL_API_TOKEN =
  process.env.EXOTEL_API_TOKEN;

const EXOTEL_ACCOUNT_SID =
  process.env.EXOTEL_ACCOUNT_SID;

const EXOTEL_CALLER_ID =
  process.env.EXOTEL_CALLER_ID;

const EXOTEL_BASE_URL =
  process.env.EXOTEL_BASE_URL ||
  "https://api.exotel.com";

/*
|--------------------------------------------------------------------------
| Supabase Admin Client
|--------------------------------------------------------------------------
*/

function getSupabaseAdmin() {
  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/*
|--------------------------------------------------------------------------
| Normalize Indian Phone Number
|--------------------------------------------------------------------------
|
| Accepted:
|
| 9876543210
| 09876543210
| 919876543210
| +919876543210
|
| Returned:
|
| 09876543210
|
| This is the format Exotel documents for Indian
| mobile numbers in the Connect API.
|--------------------------------------------------------------------------
*/

function normalizeIndianPhone(
  phone: unknown
): string {
  if (
    typeof phone !== "string"
  ) {
    return "";
  }

  let digits =
    phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  /*
  |--------------------------------------------------------------------------
  | +91XXXXXXXXXX / 91XXXXXXXXXX
  |--------------------------------------------------------------------------
  */

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    digits =
      `0${digits.slice(2)}`;
  }

  /*
  |--------------------------------------------------------------------------
  | XXXXXXXXXX
  |--------------------------------------------------------------------------
  */

  if (
    digits.length === 10
  ) {
    digits =
      `0${digits}`;
  }

  /*
  |--------------------------------------------------------------------------
  | Final validation
  |--------------------------------------------------------------------------
  */

  if (
    digits.length !== 11 ||
    !digits.startsWith("0")
  ) {
    return "";
  }

  return digits;
}

/*
|--------------------------------------------------------------------------
| POST /api/vehicle-call
|--------------------------------------------------------------------------
|
| Visitor:
|
| {
|   qr_code: "VH-XXXXXXXXXXXX",
|   caller_phone: "9876543210"
| }
|
| Flow:
|
| Visitor
|    ↓
| Vehix Server
|    ↓
| Exotel
|    ↓
| Visitor answers
|    ↓
| Exotel calls owner
|    ↓
| Private conversation
|
| Owner's number NEVER goes to browser.
|--------------------------------------------------------------------------
*/

export async function POST(
  request: Request
) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Validate environment
    |--------------------------------------------------------------------------
    */

    if (!SUPABASE_URL) {
      console.error(
        "Missing NEXT_PUBLIC_SUPABASE_URL."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    if (
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error(
        "Missing SUPABASE_SERVICE_ROLE_KEY."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    if (!EXOTEL_API_KEY) {
      console.error(
        "Missing EXOTEL_API_KEY."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Exotel is not configured correctly.",
        },
        { status: 500 }
      );
    }

    if (!EXOTEL_API_TOKEN) {
      console.error(
        "Missing EXOTEL_API_TOKEN."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Exotel is not configured correctly.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT:
    | Validate Account SID INSIDE POST so TypeScript knows
    | it is definitely a string afterwards.
    |--------------------------------------------------------------------------
    */

    const exotelAccountSid =
      EXOTEL_ACCOUNT_SID;

    if (!exotelAccountSid) {
      console.error(
        "Missing EXOTEL_ACCOUNT_SID."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Exotel account is not configured correctly.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Exotel Caller ID
    |--------------------------------------------------------------------------
    |
    | This must be the verified Exotel company number / ExoPhone.
    |--------------------------------------------------------------------------
    */

    const exotelCallerId =
      EXOTEL_CALLER_ID;

    if (!exotelCallerId) {
      console.error(
        "Missing EXOTEL_CALLER_ID."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Exotel caller ID is not configured.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Supabase
    |--------------------------------------------------------------------------
    */

    const supabase =
      getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database configuration error.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Parse request
    |--------------------------------------------------------------------------
    */

    const body =
      await request
        .json()
        .catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const requestBody =
      body as Record<
        string,
        unknown
      >;

    /*
    |--------------------------------------------------------------------------
    | QR Code
    |--------------------------------------------------------------------------
    */

    const rawQrCode =
      requestBody.qr_code;

    if (
      typeof rawQrCode !== "string" ||
      !rawQrCode.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vehix QR code is required.",
        },
        { status: 400 }
      );
    }

    const qrCode =
      rawQrCode
        .trim()
        .toUpperCase();

    /*
    |--------------------------------------------------------------------------
    | Visitor Phone
    |--------------------------------------------------------------------------
    */

    const rawCallerPhone =
      requestBody.caller_phone;

    if (
      typeof rawCallerPhone !== "string" ||
      !rawCallerPhone.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your phone number is required to start the call.",
        },
        { status: 400 }
      );
    }

    const callerPhone =
      normalizeIndianPhone(
        rawCallerPhone
      );

    if (!callerPhone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid Indian mobile number.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Find QR
    |--------------------------------------------------------------------------
    */

    const {
      data: qr,
      error: qrError,
    } = await supabase
      .from("qr_inventory")
      .select(
        "id, qr_code, status, vehicle_id, assigned_user_id"
      )
      .eq(
        "qr_code",
        qrCode
      )
      .maybeSingle();

    if (qrError) {
      console.error(
        "Vehix QR lookup error:",
        qrError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify the Vehix QR.",
        },
        { status: 500 }
      );
    }

    if (!qr) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Vehix QR code was not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | QR must be activated
    |--------------------------------------------------------------------------
    */

    if (
      qr.status !== "activated"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Vehix QR code is not active.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | QR must have vehicle
    |--------------------------------------------------------------------------
    */

    if (!qr.vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This QR is not linked to a vehicle.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Vehicle
    |--------------------------------------------------------------------------
    */

    const {
      data: vehicle,
      error: vehicleError,
    } = await supabase
      .from("vehicles")
      .select(
        "id, user_id"
      )
      .eq(
        "id",
        qr.vehicle_id
      )
      .maybeSingle();

    if (vehicleError) {
      console.error(
        "Vehix vehicle lookup error:",
        vehicleError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify the vehicle.",
        },
        { status: 500 }
      );
    }

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle linked to this QR could not be found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Vehicle Owner
    |--------------------------------------------------------------------------
    */

    if (!vehicle.user_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This vehicle does not have a registered owner.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Contact Owner Feature
    |--------------------------------------------------------------------------
    */

    const {
      data: featureSettings,
      error: featureError,
    } = await supabase
      .from(
        "vehicle_feature_settings"
      )
      .select(
        "contact_owner"
      )
      .eq(
        "vehicle_id",
        vehicle.id
      )
      .maybeSingle();

    if (featureError) {
      console.error(
        "Vehix feature settings error:",
        featureError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify private call settings.",
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
          error:
            "The vehicle owner has disabled private calls.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Owner Profile
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | ownerPhone stays ONLY on the server.
    | It is never returned to the visitor.
    |--------------------------------------------------------------------------
    */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("phone")
      .eq(
        "id",
        vehicle.user_id
      )
      .maybeSingle();

    if (profileError) {
      console.error(
        "Vehix owner profile lookup error:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to access the vehicle owner's call settings.",
        },
        { status: 500 }
      );
    }

    if (!profile?.phone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle owner has not configured a phone number for calls yet.",
        },
        { status: 400 }
      );
    }

    const ownerPhone =
      normalizeIndianPhone(
        profile.phone
      );

    if (!ownerPhone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle owner's phone number is invalid.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Build Exotel Connect API URL
    |--------------------------------------------------------------------------
    */

    const exotelUrl =
      `${EXOTEL_BASE_URL}/v1/Accounts/` +
      `${encodeURIComponent(exotelAccountSid)}` +
      `/Calls/connect`;

    /*
    |--------------------------------------------------------------------------
    | Exotel Parameters
    |--------------------------------------------------------------------------
    |
    | From      = Visitor
    | To        = Vehicle Owner
    | CallerId  = Vehix ExoPhone
    |
    | Exotel calls From first.
    | After From answers, Exotel connects To.
    |--------------------------------------------------------------------------
    */

    const params =
      new URLSearchParams();

    params.set(
      "From",
      callerPhone
    );

    params.set(
      "To",
      ownerPhone
    );

    params.set(
      "CallerId",
      exotelCallerId
    );

    params.set(
      "CallType",
      "trans"
    );

    params.set(
      "TimeOut",
      "45"
    );

    params.set(
      "TimeLimit",
      "1800"
    );

    params.set(
      "CustomField",
      qrCode
    );

    /*
    |--------------------------------------------------------------------------
    | Basic Authentication
    |--------------------------------------------------------------------------
    */

    const basicAuth =
      Buffer.from(
        `${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`
      ).toString(
        "base64"
      );

    /*
    |--------------------------------------------------------------------------
    | Send request to Exotel
    |--------------------------------------------------------------------------
    */

    const exotelResponse =
      await fetch(
        exotelUrl,
        {
          method: "POST",

          headers: {
            Authorization:
              `Basic ${basicAuth}`,

            "Content-Type":
              "application/x-www-form-urlencoded",

            Accept:
              "application/xml, application/json, text/plain, */*",
          },

          body:
            params.toString(),

          cache:
            "no-store",
        }
      );

    /*
    |--------------------------------------------------------------------------
    | Read Exotel response
    |--------------------------------------------------------------------------
    */

    const exotelResponseText =
      await exotelResponse.text();

    /*
    |--------------------------------------------------------------------------
    | Exotel rejected call
    |--------------------------------------------------------------------------
    */

    if (
      !exotelResponse.ok
    ) {
      console.error(
        "Vehix Exotel call failed:",
        {
          status:
            exotelResponse.status,

          response:
            exotelResponseText,

          qrCode,

          vehicleId:
            vehicle.id,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Vehix could not start the private call. Please try again.",
        },
        { status: 502 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Successful Exotel request
    |--------------------------------------------------------------------------
    */

    console.info(
      "Vehix private call started:",
      {
        qrCode,

        vehicleId:
          vehicle.id,

        exotelStatus:
          exotelResponse.status,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | NEVER return:
    |
    | ownerPhone
    | Exotel response
    | Exotel SID
    | API credentials
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: true,

        message:
          "Vehix is calling you. Answer the call to be connected to the vehicle owner.",

        call_started:
          true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Unexpected error
    |--------------------------------------------------------------------------
    */

    console.error(
      "Vehix vehicle-call API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while starting the private call.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This endpoint only accepts POST requests.",
    },
    {
      status: 405,
    }
  );
}