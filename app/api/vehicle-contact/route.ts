import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type VehicleActionRequest = {
  qr_code?: string;
  action?: string;
};

const allowedActions = [
  "lights_on",
  "door_open",
  "blocking",
  "found_vehicle",
  "accident",
  "emergency",
];

const actionMessages: Record<string, string> = {
  lights_on:
    "Vehicle lights have been left on. Please check your vehicle.",

  door_open:
    "A vehicle door appears to be open. Please check your vehicle.",

  blocking:
    "Your vehicle is blocking another vehicle or access point. Please move it when possible.",

  found_vehicle:
    "Someone has found your vehicle and is trying to notify you.",

  accident:
    "Someone has reported a possible accident involving your vehicle.",

  emergency:
    "An emergency situation has been reported regarding your vehicle.",
};

export async function POST(request: NextRequest) {
  try {
    const body =
      (await request.json()) as VehicleActionRequest;

    const qrCode = body.qr_code
      ?.trim()
      .toUpperCase();

    const action = body.action
      ?.trim()
      .toLowerCase();

    /*
     * -----------------------------------------
     * BASIC VALIDATION
     * -----------------------------------------
     */

    if (!qrCode) {
      return NextResponse.json(
        {
          success: false,
          error: "QR code is required.",
        },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehicle action is required.",
        },
        { status: 400 }
      );
    }

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid vehicle action.",
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * GET PREDEFINED MESSAGE
     * -----------------------------------------
     */

    const message =
      actionMessages[action] ??
      "A notification has been sent regarding your vehicle.";

    /*
     * -----------------------------------------
     * SEND THROUGH SECURE SUPABASE FUNCTION
     * -----------------------------------------
     *
     * The RPC is responsible for:
     *
     * QR -> vehicle -> owner
     *
     * The browser never supplies the owner's
     * user ID or private contact information.
     */

    const { data, error } = await supabase.rpc(
      "send_vehicle_contact_message",
      {
        p_qr_code: qrCode,
        p_reason: action,
        p_message: message,
        p_sender_name: null,
        p_sender_contact: null,
      }
    );

    if (error) {
      console.error(
        "Vehicle action RPC error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message ||
            "Unable to send vehicle notification.",
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * SUCCESS
     * -----------------------------------------
     */

    return NextResponse.json(
      {
        success: true,
        message:
          "Vehicle owner has been notified successfully.",
        message_id: data ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Vehicle action API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while processing the vehicle action.",
      },
      { status: 500 }
    );
  }
}