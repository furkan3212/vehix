import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/*
 * =========================================================
 * VEHIX → EXOTEL CALL API
 * =========================================================
 *
 * Flow:
 *
 * Public QR visitor
 *        ↓
 * /api/vehicle-call
 *        ↓
 * Find QR
 *        ↓
 * Find vehicle
 *        ↓
 * Find owner phone
 *        ↓
 * Exotel
 *        ↓
 * Vehix ExoPhone
 *        ↓
 * Owner
 *
 * IMPORTANT:
 * Exotel credentials remain server-side.
 * Never expose them to the browser.
 * =========================================================
 */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const exotelApiKey =
  process.env.EXOTEL_API_KEY;

const exotelApiToken =
  process.env.EXOTEL_API_TOKEN;

const exotelAccountSid =
  process.env.EXOTEL_ACCOUNT_SID;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY."
  );
}

if (!exotelApiKey) {
  throw new Error(
    "Missing EXOTEL_API_KEY."
  );
}

if (!exotelApiToken) {
  throw new Error(
    "Missing EXOTEL_API_TOKEN."
  );
}

if (!exotelAccountSid) {
  throw new Error(
    "Missing EXOTEL_ACCOUNT_SID."
  );
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
 * Your fixed Vehix ExoPhone.
 *
 * This is the number Zack should see as the
 * caller ID for Vehix calls.
 *
 * IMPORTANT:
 * Keep this value server-side.
 */

const VEHIX_EXOTEL_NUMBER =
  "09513886363";

/*
 * Singapore Exotel cluster.
 */

const EXOTEL_BASE_URL =
  "https://api.exotel.com";

/*
 * Normalize phone number.
 *
 * Exotel's documentation uses a leading 0 for
 * mobile numbers.
 *
 * Example:
 *
 * 9876543210
 *        ↓
 * 09876543210
 *
 * If the number is already formatted, we clean it.
 */

function normalizeExotelPhone(
  phone: string | null | undefined
): string {
  if (!phone) {
    return "";
  }

  let digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  /*
   * Indian international format:
   *
   * 919876543210
   *       ↓
   * 09876543210
   */

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    digits = `0${digits.slice(2)}`;
  }

  /*
   * Indian number with leading zero.
   */

  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    return digits;
  }

  /*
   * Indian 10-digit mobile.
   */

  if (digits.length === 10) {
    return `0${digits}`;
  }

  /*
   * For other supported international numbers,
   * leave the cleaned number as-is.
   */

  return digits;
}

/*
 * Parse Exotel response safely.
 *
 * Exotel can return XML or JSON depending on
 * endpoint/request format.
 */

async function parseExotelResponse(
  response: Response
) {
  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  if (
    contentType.includes("application/json")
  ) {
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

/*
 * =========================================================
 * POST
 * =========================================================
 *
 * Expected request:
 *
 * {
 *   "qr_code": "VH-05B103A9370B"
 * }
 *
 * We intentionally do NOT accept Zack's phone number
 * from the browser.
 *
 * The server finds the number itself.
 * =========================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * -----------------------------------------------------
     * 1. READ BODY
     * -----------------------------------------------------
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
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
        {
          status: 400,
        }
      );
    }

    const requestBody =
      body as Record<string, unknown>;

    const rawQrCode =
      requestBody.qr_code;

    /*
     * -----------------------------------------------------
     * 2. VALIDATE QR CODE
     * -----------------------------------------------------
     */

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
        {
          status: 400,
        }
      );
    }

    const qrCode =
      rawQrCode
        .trim()
        .toUpperCase();

    /*
     * -----------------------------------------------------
     * 3. FIND QR
     * -----------------------------------------------------
     */

    const {
      data: qr,
      error: qrError,
    } = await supabaseAdmin
      .from("qr_inventory")
      .select(
        "id, qr_code, status, vehicle_id"
      )
      .eq("qr_code", qrCode)
      .maybeSingle();

    if (qrError) {
      console.error(
        "Vehix call QR lookup error:",
        qrError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify this Vehix QR.",
        },
        {
          status: 500,
        }
      );
    }

    if (!qr) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Vehix QR code could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 4. QR MUST BE ACTIVATED
     * -----------------------------------------------------
     */

    if (
      String(qr.status).toLowerCase() !==
      "activated"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Vehix QR is not activated.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 5. QR MUST HAVE VEHICLE
     * -----------------------------------------------------
     */

    if (!qr.vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Vehix QR is not linked to a vehicle.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 6. FIND VEHICLE
     * -----------------------------------------------------
     */

    const {
      data: vehicle,
      error: vehicleError,
    } = await supabaseAdmin
      .from("vehicles")
      .select(
        `
          id,
          user_id,
          vehicle_number,
          brand,
          model
        `
      )
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
          error:
            "Unable to verify the vehicle.",
        },
        {
          status: 500,
        }
      );
    }

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle linked to this QR could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 7. FIND OWNER PHONE
     * -----------------------------------------------------
     *
     * We use the existing profiles table server-side.
     *
     * The owner's number NEVER goes back to the browser.
     * -----------------------------------------------------
     */

    if (!vehicle.user_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This vehicle does not have a registered owner.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("phone")
      .eq("id", vehicle.user_id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Vehix call owner lookup error:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to retrieve the vehicle owner's contact information.",
        },
        {
          status: 500,
        }
      );
    }

    if (!profile?.phone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle owner has not configured a phone number.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 8. NORMALIZE OWNER NUMBER
     * -----------------------------------------------------
     */

    const ownerPhone =
      normalizeExotelPhone(
        profile.phone
      );

    if (!ownerPhone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle owner's phone number is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 9. MAKE EXOTEL CALL
     * -----------------------------------------------------
     *
     * Exotel's Connect API:
     *
     * From      = number called first
     * To        = second number
     * CallerId  = Vehix ExoPhone
     *
     * We call the OWNER first.
     *
     * Once the owner answers, Exotel connects the
     * second leg to the caller.
     *
     * IMPORTANT:
     *
     * For the permanent Vehix-number architecture,
     * the ExoPhone is used as CallerId.
     * -----------------------------------------------------
     */

    const exotelUrl =
  `${EXOTEL_BASE_URL}/v1/Accounts/` +
  `${encodeURIComponent(
    exotelAccountSid!
  )}/Calls/connect`;

    const params =
      new URLSearchParams();

    /*
     * First leg:
     * Zack receives the call.
     */

    params.set(
      "From",
      ownerPhone
    );

    /*
     * Second leg.
     *
     * This will be replaced/confirmed by Exotel's
     * exact bridge behavior during the live test.
     */

    params.set(
      "To",
      VEHIX_EXOTEL_NUMBER
    );

    /*
     * Vehix public caller ID.
     */

    params.set(
      "CallerId",
      VEHIX_EXOTEL_NUMBER
    );

    /*
     * Transactional call.
     */

    params.set(
      "CallType",
      "trans"
    );

    /*
     * Reasonable ringing timeout.
     */

    params.set(
      "TimeOut",
      "30"
    );

    /*
     * Maximum conversation duration:
     * 30 minutes.
     */

    params.set(
      "TimeLimit",
      "1800"
    );

    const basicAuth =
      Buffer.from(
        `${exotelApiKey}:${exotelApiToken}`
      ).toString("base64");

    const exotelResponse =
      await fetch(exotelUrl, {
        method: "POST",

        headers: {
          Authorization:
            `Basic ${basicAuth}`,

          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          params.toString(),

        cache: "no-store",
      });

    /*
     * -----------------------------------------------------
     * 10. PARSE EXOTEL RESPONSE
     * -----------------------------------------------------
     */

    const exotelResult =
      await parseExotelResponse(
        exotelResponse
      );

    /*
     * -----------------------------------------------------
     * 11. HANDLE EXOTEL FAILURE
     * -----------------------------------------------------
     */

    if (!exotelResponse.ok) {
      console.error(
        "Vehix Exotel call error:",
        {
          status:
            exotelResponse.status,

          response:
            exotelResult.raw,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Vehix could not start the call. Please try again.",
        },
        {
          status: 502,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 12. SUCCESS
     * -----------------------------------------------------
     */

    console.log(
      "Vehix Exotel call started:",
      {
        qr_code: qrCode,

        vehicle_id:
          vehicle.id,

        vehicle_number:
          vehicle.vehicle_number,

        exotel_number:
          VEHIX_EXOTEL_NUMBER,

        exotel_status:
          exotelResponse.status,
      }
    );

    return NextResponse.json({
      success: true,

      message:
        "Vehix is connecting the call.",

      caller_id:
        VEHIX_EXOTEL_NUMBER,

      vehicle_id:
        vehicle.id,

      call_started: true,

      /*
       * We deliberately don't return the owner's
       * phone number.
       */

      owner_phone:
        undefined,

      exotel_response:
        exotelResult.data ?? null,
    });
  } catch (error) {
    /*
     * -----------------------------------------------------
     * GLOBAL ERROR
     * -----------------------------------------------------
     */

    console.error(
      "Vehix vehicle-call API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while starting the Vehix call.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =========================================================
 * GET
 * =========================================================
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