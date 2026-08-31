import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/*
 * =========================================================
 * SUPABASE ADMIN CLIENT
 * =========================================================
 *
 * This API is called by someone who scans a Vehix QR.
 * The scanner does NOT need to be logged in.
 *
 * Therefore we use the Supabase service-role client on
 * the server to safely read the QR/vehicle and create
 * the alert.
 *
 * IMPORTANT:
 * SUPABASE_SERVICE_ROLE_KEY must NEVER be exposed
 * to the browser/client.
 * =========================================================
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY environment variable."
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ActionType =
  | "emergency"
  | "lights_on"
  | "door_open"
  | "blocking"
  | "found_vehicle";

type AlertConfig = {
  alertType: string;
  message: string;
  responseMessage: string;
};

/*
 * =========================================================
 * ACTION CONFIGURATION
 * =========================================================
 *
 * These are the public actions available from the
 * Vehix QR page.
 *
 * The public action names are translated into the
 * alert_type values used by the Vehix dashboard.
 * =========================================================
 */

const ACTIONS: Record<ActionType, AlertConfig> = {
  lights_on: {
    alertType: "lights",
    message:
      "Someone reported that your vehicle lights may be on.",
    responseMessage:
      "The vehicle owner has been notified that the lights may be on.",
  },

  door_open: {
    alertType: "doors",
    message:
      "Someone reported that a vehicle door may be open.",
    responseMessage:
      "The vehicle owner has been notified that a door may be open.",
  },

  blocking: {
    alertType: "parking",
    message:
      "Someone reported that your vehicle may be blocking another vehicle.",
    responseMessage:
      "The vehicle owner has been notified about the parking issue.",
  },

  emergency: {
    alertType: "emergency",
    message:
      "Someone reported an emergency involving your vehicle.",
    responseMessage:
      "The vehicle owner has been notified about the emergency.",
  },

  /*
   * The current dashboard supports emergency as the
   * notification category, so "found_vehicle" is stored
   * as an emergency-type alert while preserving the
   * actual event in the message.
   */
  found_vehicle: {
    alertType: "emergency",
    message:
      "Someone reported that your vehicle has been found.",
    responseMessage:
      "The vehicle owner has been notified that their vehicle was found.",
  },
};

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function json(
  data: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(data, { status });
}

/*
 * =========================================================
 * POST
 * =========================================================
 *
 * Expected body:
 *
 * {
 *   qr_code: "VEHIX-XXXX",
 *   action: "lights_on"
 * }
 *
 * =========================================================
 */

export async function POST(req: Request) {
  try {
    /*
     * -------------------------------------------------------
     * 1. READ REQUEST BODY
     * -------------------------------------------------------
     */

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return json(
        {
          success: false,
          error: "Invalid request body.",
        },
        400
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return json(
        {
          success: false,
          error: "Invalid request body.",
        },
        400
      );
    }

    const requestBody =
      body as Record<string, unknown>;

    const rawQrCode = requestBody.qr_code;
    const rawAction = requestBody.action;

    /*
     * -------------------------------------------------------
     * 2. VALIDATE QR CODE
     * -------------------------------------------------------
     */

    if (
      typeof rawQrCode !== "string" ||
      !rawQrCode.trim()
    ) {
      return json(
        {
          success: false,
          error: "Vehix QR code is required.",
        },
        400
      );
    }

    const qrCode = rawQrCode
      .trim()
      .toUpperCase();

    /*
     * -------------------------------------------------------
     * 3. VALIDATE ACTION
     * -------------------------------------------------------
     */

    if (
      typeof rawAction !== "string" ||
      !rawAction.trim()
    ) {
      return json(
        {
          success: false,
          error: "Vehicle action is required.",
        },
        400
      );
    }

    const action =
      rawAction.trim().toLowerCase();

    if (
      !Object.prototype.hasOwnProperty.call(
        ACTIONS,
        action
      )
    ) {
      return json(
        {
          success: false,
          error: "Invalid vehicle action.",
        },
        400
      );
    }

    const alertConfig =
      ACTIONS[action as ActionType];

    /*
     * -------------------------------------------------------
     * 4. FIND QR
     * -------------------------------------------------------
     *
     * Only an activated QR can generate an alert.
     *
     * This matches the existing Vehix QR logic where the
     * vehicle identity is only displayed after activation.
     * -------------------------------------------------------
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
        "Vehix QR lookup error:",
        qrError
      );

      return json(
        {
          success: false,
          error:
            "Unable to verify this Vehix QR code.",
        },
        500
      );
    }

    if (!qr) {
      return json(
        {
          success: false,
          error:
            "This Vehix QR code could not be found.",
        },
        404
      );
    }

    /*
     * -------------------------------------------------------
     * 5. CHECK QR STATUS
     * -------------------------------------------------------
     */

    if (String(qr.status).toLowerCase() !== "activated") {
      return json(
        {
          success: false,
          error:
            "This Vehix QR is not activated.",
        },
        400
      );
    }

    /*
     * -------------------------------------------------------
     * 6. CHECK VEHICLE LINK
     * -------------------------------------------------------
     */

    if (!qr.vehicle_id) {
      return json(
        {
          success: false,
          error:
            "This Vehix QR is not linked to a vehicle.",
        },
        400
      );
    }

    /*
     * -------------------------------------------------------
     * 7. VERIFY VEHICLE EXISTS
     * -------------------------------------------------------
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
        "Vehix vehicle lookup error:",
        vehicleError
      );

      return json(
        {
          success: false,
          error:
            "Unable to verify the vehicle linked to this QR.",
        },
        500
      );
    }

    if (!vehicle) {
      return json(
        {
          success: false,
          error:
            "The vehicle linked to this QR could not be found.",
        },
        404
      );
    }

    /*
     * -------------------------------------------------------
     * 8. VERIFY VEHICLE OWNER
     * -------------------------------------------------------
     *
     * The vehicles table in the current Vehix project
     * uses user_id.
     * -------------------------------------------------------
     */

    if (!vehicle.user_id) {
      console.error(
        "Vehicle has no user_id:",
        vehicle.id
      );

      return json(
        {
          success: false,
          error:
            "This vehicle does not have a valid owner.",
        },
        400
      );
    }

    /*
     * -------------------------------------------------------
     * 9. CREATE VEHICLE ALERT
     * -------------------------------------------------------
     *
     * IMPORTANT:
     *
     * vehicle_alerts contains:
     *
     * id
     * vehicle_id
     * alert_type
     * message
     * status
     * created_at
     *
     * There is NO "description" column.
     * -------------------------------------------------------
     */

    const {
      data: insertedAlert,
      error: alertError,
    } = await supabaseAdmin
      .from("vehicle_alerts")
      .insert({
        vehicle_id: vehicle.id,
        alert_type: alertConfig.alertType,
        message: alertConfig.message,
        status: "pending",
      })
      .select(
        "id, vehicle_id, alert_type, message, status, created_at"
      )
      .single();

    /*
     * -------------------------------------------------------
     * 10. HANDLE ALERT INSERT ERROR
     * -------------------------------------------------------
     */

    if (alertError) {
      console.error(
        "Vehix vehicle alert insert error:",
        alertError
      );

      return json(
        {
          success: false,
          error:
            "Unable to create the vehicle alert.",
        },
        500
      );
    }

    /*
     * -------------------------------------------------------
     * 11. SUCCESS
     * -------------------------------------------------------
     */

    console.log(
      "Vehix vehicle alert created:",
      {
        alert_id: insertedAlert?.id,
        qr_code: qrCode,
        vehicle_id: vehicle.id,
        vehicle_number:
          vehicle.vehicle_number,
        action,
        alert_type:
          alertConfig.alertType,
      }
    );

    return json({
      success: true,
      message: alertConfig.responseMessage,
      alert_id: insertedAlert?.id ?? null,
    });
  } catch (error) {
    /*
     * -------------------------------------------------------
     * GLOBAL ERROR HANDLER
     * -------------------------------------------------------
     */

    console.error(
      "Vehix vehicle-action API error:",
      error
    );

    return json(
      {
        success: false,
        error:
          "Something went wrong while processing the vehicle alert.",
      },
      500
    );
  }
}

/*
 * =========================================================
 * OPTIONAL METHOD HANDLERS
 * =========================================================
 */

export async function GET() {
  return json(
    {
      success: false,
      error:
        "This endpoint only accepts POST requests.",
    },
    405
  );
}