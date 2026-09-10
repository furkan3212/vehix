import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;
const EXOTEL_CONNECT_WEBHOOK_SECRET =
  process.env.EXOTEL_CONNECT_WEBHOOK_SECRET;

function getSupabaseAdmin() {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
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

function normalizeQrCode(value: string | null) {
  return (value || "").trim().toUpperCase();
}

function normalizePhone(
  phone: string | null | undefined
) {
  if (!phone) {
    return "";
  }

  let digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  // Indian 10-digit number
  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  // Indian number with leading 0
  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    digits = `91${digits.slice(1)}`;
  }

  // E.164 maximum is 15 digits
  if (
    digits.length < 10 ||
    digits.length > 15
  ) {
    return "";
  }

  return `+${digits}`;
}

function emptyResponse() {
  return new NextResponse("", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(
  request: NextRequest
) {
  /*
   * =======================================================
   * 1. VERIFY OUR WEBHOOK SECRET
   * =======================================================
   */

  if (!EXOTEL_CONNECT_WEBHOOK_SECRET) {
    console.error(
      "EXOTEL_CONNECT_WEBHOOK_SECRET is not configured."
    );

    return new NextResponse("", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const suppliedKey =
    request.nextUrl.searchParams
      .get("key")
      ?.trim() || "";

  if (
    !suppliedKey ||
    suppliedKey !== EXOTEL_CONNECT_WEBHOOK_SECRET
  ) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
      },
    });
  }

  /*
   * =======================================================
   * 2. READ EXOTEL PARAMETERS
   * =======================================================
   *
   * CustomField is where our Vehix QR code will arrive.
   */

  const params =
    request.nextUrl.searchParams;

  const callSid =
    params.get("CallSid");

  const customField =
    params.get("CustomField");

  console.info(
    "Vehix Exotel Connect request",
    {
      callSid: callSid || null,
      hasCustomField: Boolean(customField),
    }
  );

  /*
   * =======================================================
   * 3. QR CODE
   * =======================================================
   */

  const qrCode =
    normalizeQrCode(customField);

  if (!qrCode) {
    console.warn(
      "Exotel request has no Vehix QR in CustomField."
    );

    return emptyResponse();
  }

  try {
    const supabaseAdmin =
      getSupabaseAdmin();

    /*
     * =====================================================
     * 4. FIND QR
     * =====================================================
     */

    const {
      data: qrData,
      error: qrError,
    } = await supabaseAdmin
      .from("qr_inventory")
      .select(
        "id, qr_code, status, vehicle_id, assigned_user_id"
      )
      .eq("qr_code", qrCode)
      .maybeSingle();

    if (qrError) {
      console.error(
        "Exotel QR lookup error:",
        qrError
      );

      return emptyResponse();
    }

    if (!qrData) {
      console.warn(
        "Vehix QR not found:",
        qrCode
      );

      return emptyResponse();
    }

    /*
     * =====================================================
     * 5. QR MUST BE ACTIVATED
     * =====================================================
     */

    if (qrData.status !== "activated") {
      console.warn(
        "QR is not activated:",
        {
          qrCode,
          status: qrData.status,
        }
      );

      return emptyResponse();
    }

    if (!qrData.vehicle_id) {
      console.warn(
        "Activated QR has no vehicle:",
        qrCode
      );

      return emptyResponse();
    }

    /*
     * =====================================================
     * 6. CONTACT OWNER FEATURE MUST BE ENABLED
     * =====================================================
     */

    const {
      data: featureSettings,
      error: featureError,
    } = await supabaseAdmin
      .from("vehicle_feature_settings")
      .select("contact_owner")
      .eq(
        "vehicle_id",
        qrData.vehicle_id
      )
      .maybeSingle();

    if (featureError) {
      console.error(
        "Vehicle feature settings error:",
        featureError
      );

      return emptyResponse();
    }

    /*
     * Fail closed.
     */

    if (
      !featureSettings ||
      featureSettings.contact_owner !== true
    ) {
      console.warn(
        "Contact Owner is disabled:",
        qrData.vehicle_id
      );

      return emptyResponse();
    }

    /*
     * =====================================================
     * 7. GET PUBLICLY PERMITTED CONTACT
     * =====================================================
     *
     * We reuse the existing secure Vehix RPC instead of
     * reading profiles directly.
     */

    const {
      data: contactData,
      error: contactError,
    } = await supabaseAdmin.rpc(
      "get_public_vehicle_contact",
      {
        p_qr_code: qrData.qr_code,
      }
    );

    if (contactError) {
      console.error(
        "Public contact RPC error:",
        contactError
      );

      return emptyResponse();
    }

    /*
     * =====================================================
     * 8. RESOLVE OWNER PHONE
     * =====================================================
     */

    const ownerPhone =
      normalizePhone(
        contactData?.phone
      );

    if (!ownerPhone) {
      console.warn(
        "Owner phone is unavailable:",
        {
          qrCode,
          vehicleId: qrData.vehicle_id,
        }
      );

      return emptyResponse();
    }

    /*
     * =====================================================
     * 9. RETURN ONLY THE NUMBER
     * =====================================================
     *
     * Exotel's normal Connect "Dial Whom" URL expects:
     *
     * Content-Type: text/plain
     *
     * Body:
     *
     * +919876543210
     */

    console.info(
      "Vehix Exotel destination resolved",
      {
        qrCode,
        vehicleId: qrData.vehicle_id,
        callSid: callSid || null,
      }
    );

    return new NextResponse(
      ownerPhone,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Vehix Exotel Connect error:",
      error
    );

    return emptyResponse();
  }
}