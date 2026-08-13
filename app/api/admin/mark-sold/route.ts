import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    /*
     * ------------------------------------------------
     * GET AUTHORIZATION TOKEN
     * ------------------------------------------------
     */

    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization.replace("Bearer ", "").trim();

    /*
     * ------------------------------------------------
     * VERIFY USER
     * ------------------------------------------------
     */

    const authClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    /*
     * ------------------------------------------------
     * CHECK ADMIN
     *
     * We use the same is_admin() function that your
     * existing admin page already uses.
     * ------------------------------------------------
     */

    const adminClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    /*
     * Check the user's admin status directly.
     *
     * This assumes your profiles table has an
     * is_admin column.
     */

    const {
      data: profile,
      error: profileError,
    } = await adminClient
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Admin profile check failed:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify admin access.",
        },
        { status: 500 }
      );
    }

    if (!profile?.is_admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required.",
        },
        { status: 403 }
      );
    }

    /*
     * ------------------------------------------------
     * READ REQUEST
     * ------------------------------------------------
     */

    const body = await request.json();

    const qrId =
      typeof body.qr_id === "string"
        ? body.qr_id.trim()
        : "";

    if (!qrId) {
      return NextResponse.json(
        {
          success: false,
          error: "QR ID is required.",
        },
        { status: 400 }
      );
    }

    /*
     * ------------------------------------------------
     * CHECK QR
     * ------------------------------------------------
     */

    const {
      data: qr,
      error: qrError,
    } = await adminClient
      .from("qr_inventory")
      .select("id, qr_code, status")
      .eq("id", qrId)
      .maybeSingle();

    if (qrError) {
      console.error(
        "QR lookup failed:",
        qrError
      );

      return NextResponse.json(
        {
          success: false,
          error: qrError.message,
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

    if (qr.status !== "available") {
      return NextResponse.json(
        {
          success: false,
          error: `QR is already "${qr.status}".`,
        },
        { status: 400 }
      );
    }

    /*
     * ------------------------------------------------
     * MARK SOLD
     * ------------------------------------------------
     */

    const {
      data: updatedQr,
      error: updateError,
    } = await adminClient
      .from("qr_inventory")
      .update({
        status: "sold",
      })
      .eq("id", qr.id)
      .eq("status", "available")
      .select(
        "id, qr_code, status"
      )
      .single();

    if (updateError) {
      console.error(
        "QR status update failed:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "QR marked as sold.",
        qr: updatedQr,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Mark sold API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}