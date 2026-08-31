import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY."
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
 * =========================================================
 * VEHIX CALL SESSION
 * =========================================================
 *
 * Creates a short-lived server-side session connecting:
 *
 * QR CODE → VEHICLE → OWNER
 *
 * The owner's phone number is NEVER returned to the browser.
 * =========================================================
 */

const SESSION_MINUTES = 5;

function createSessionId(): string {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  try {
    /*
     * -----------------------------------------------------
     * 1. READ REQUEST
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
        "Vehix call session QR lookup error:",
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
        "Vehix call session vehicle lookup error:",
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
     * 7. VEHICLE MUST HAVE OWNER
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

    /*
     * -----------------------------------------------------
     * 8. FIND OWNER
     * -----------------------------------------------------
     *
     * IMPORTANT:
     *
     * This happens entirely on the server.
     *
     * The owner's phone number is never returned
     * to the public QR page.
     * -----------------------------------------------------
     */

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, phone"
      )
      .eq(
        "id",
        vehicle.user_id
      )
      .maybeSingle();

    if (profileError) {
      console.error(
        "Vehix call session owner lookup error:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to retrieve the vehicle owner.",
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
     * 9. CREATE SECURE SESSION ID
     * -----------------------------------------------------
     */

    const sessionId =
      createSessionId();

    const expiresAt =
      new Date(
        Date.now() +
          SESSION_MINUTES *
            60 *
            1000
      ).toISOString();

    /*
     * -----------------------------------------------------
     * 10. STORE SESSION
     * -----------------------------------------------------
     *
     * IMPORTANT:
     *
     * This expects a table named:
     *
     * vehicle_call_sessions
     *
     * with columns:
     *
     * id
     * session_id
     * qr_code
     * vehicle_id
     * owner_user_id
     * owner_phone
     * expires_at
     *
     * We will create this table in the next step.
     * -----------------------------------------------------
     */

    const {
      error: sessionError,
    } = await supabaseAdmin
      .from(
        "vehicle_call_sessions"
      )
      .insert({
        session_id:
          sessionId,

        qr_code:
          qrCode,

        vehicle_id:
          vehicle.id,

        owner_user_id:
          vehicle.user_id,

        owner_phone:
          profile.phone,

        expires_at:
          expiresAt,
      });

    if (sessionError) {
      console.error(
        "Vehix call session insert error:",
        sessionError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create the Vehix call session.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * 11. RETURN SAFE DATA ONLY
     * -----------------------------------------------------
     *
     * NEVER return:
     *
     * owner_phone
     * owner_user_id
     *
     * -----------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      session_id:
        sessionId,

      qr_code:
        qrCode,

      vehicle_id:
        vehicle.id,

      expires_at:
        expiresAt,

      message:
        "Vehix call session created.",
    });
  } catch (error) {
    console.error(
      "Vehix vehicle call session error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while creating the Vehix call session.",
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