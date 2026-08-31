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

function normalizePhone(
  phone: string | null | undefined
): string {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, "");

  if (!digits) return "";

  // Indian international format:
  // 919876543210 -> +919876543210
  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return `+${digits}`;
  }

  // Indian 10 digit number:
  // 9876543210 -> +919876543210
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  // Indian number beginning with 0:
  // 09876543210 -> +919876543210
  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    return `+91${digits.slice(1)}`;
  }

  // Already international.
  return `+${digits}`;
}

export async function GET(
  request: Request
) {
  try {
    const url = new URL(request.url);

    /*
     * Exotel sends the number that called
     * the Vehix ExoPhone.
     */
    const callFrom =
      url.searchParams.get("CallFrom") ||
      url.searchParams.get("From") ||
      "";

    /*
     * This should be your Vehix ExoPhone.
     */
    const callTo =
      url.searchParams.get("CallTo") ||
      url.searchParams.get("To") ||
      "";

    console.log(
      "Vehix Exotel routing request:",
      {
        callFrom,
        callTo,
      }
    );

    /*
     * -----------------------------------------------------
     * SECURITY / BASIC VALIDATION
     * -----------------------------------------------------
     */

    if (!callFrom) {
      console.error(
        "Vehix Exotel routing: missing CallFrom."
      );

      return NextResponse.json(
        {
          error:
            "Unable to identify the caller.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * FIND OWNER
     * -----------------------------------------------------
     *
     * IMPORTANT:
     *
     * This version assumes the Vehix ExoPhone is used
     * as the permanent public Vehix number and that
     * the caller/vehicle routing information is available
     * through the current call context.
     *
     * We do NOT expose the owner's phone number to
     * the browser.
     */

    /*
     * For the first production test, we'll use the
     * caller number only as the lookup key if it matches
     * a configured owner.
     *
     * This section can be replaced with QR/session
     * routing once the Exotel flow is connected.
     */

    const normalizedCaller =
      normalizePhone(callFrom);

    /*
     * Search profiles for the caller number.
     *
     * This is intentionally server-side.
     */

    const possibleNumbers = [
      normalizedCaller,
      normalizedCaller.replace(
        /^\+91/,
        "0"
      ),
      normalizedCaller.replace(
        /^\+91/,
        ""
      ),
    ];

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("id, phone")
      .in("phone", possibleNumbers)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Vehix Exotel profile lookup error:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Unable to route the Vehix call.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * If we cannot find a routing target, don't
     * accidentally dial somebody.
     */

    if (!profile?.phone) {
      console.error(
        "Vehix Exotel routing: no matching owner.",
        {
          callFrom,
          callTo,
        }
      );

      return NextResponse.json(
        {
          error:
            "No vehicle owner could be identified.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * -----------------------------------------------------
     * DESTINATION
     * -----------------------------------------------------
     */

    const destination =
      normalizePhone(profile.phone);

    if (!destination) {
      return NextResponse.json(
        {
          error:
            "The vehicle owner's phone number is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Vehix Exotel routing destination:",
      {
        destination,
      }
    );

    /*
     * -----------------------------------------------------
     * EXOTEL CONNECT DYNAMIC RESPONSE
     * -----------------------------------------------------
     *
     * Exotel expects JSON containing destination.numbers.
     */

    return NextResponse.json({
      fetch_after_attempt: false,

      destination: {
        numbers: [destination],
      },

      /*
       * Keep the same Vehix ExoPhone as the outgoing
       * caller ID.
       */
      outgoing_phone_number:
        "+9509513886363",

      record: false,

      max_ringing_duration: 30,

      max_conversation_duration: 1800,
    });
  } catch (error) {
    console.error(
      "Vehix Exotel dial-whom error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process the Vehix call.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type":
        "application/json",
    },
  });
}