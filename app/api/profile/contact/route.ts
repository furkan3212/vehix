import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },

        async setAll(cookiesToSet) {
          const cookieStore = await cookies();

          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              }
            );
          } catch {
            // Server component restrictions can prevent
            // cookie writes. Safe to ignore here.
          }
        },
      },
    }
  );
}

/*
 * GET
 *
 * Returns the logged-in owner's contact settings.
 */

export async function GET() {
  try {
    const supabase = getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        phone,
        whatsapp,
        emergency_name,
        emergency_phone
        `
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Profile contact GET error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Contact GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load contact settings.",
      },
      { status: 500 }
    );
  }
}

/*
 * PATCH
 *
 * Updates the logged-in owner's contact information.
 */

export async function PATCH(
  request: NextRequest
) {
  try {
    const supabase = getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const fullName =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : null;

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : null;

    const whatsapp =
      typeof body.whatsapp === "string"
        ? body.whatsapp.trim()
        : null;

    const emergencyName =
      typeof body.emergency_name === "string"
        ? body.emergency_name.trim()
        : null;

    const emergencyPhone =
      typeof body.emergency_phone === "string"
        ? body.emergency_phone.trim()
        : null;

    /*
     * -----------------------------------------
     * VALIDATION
     * -----------------------------------------
     */

    if (fullName && fullName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name is too long.",
        },
        { status: 400 }
      );
    }

    if (phone && phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is too long.",
        },
        { status: 400 }
      );
    }

    if (whatsapp && whatsapp.length > 30) {
      return NextResponse.json(
        {
          success: false,
          error: "WhatsApp number is too long.",
        },
        { status: 400 }
      );
    }

    if (
      emergencyName &&
      emergencyName.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Emergency contact name is too long.",
        },
        { status: 400 }
      );
    }

    if (
      emergencyPhone &&
      emergencyPhone.length > 30
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Emergency phone number is too long.",
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * UPDATE OWN PROFILE ONLY
     * -----------------------------------------
     */

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        emergency_name:
          emergencyName || null,
        emergency_phone:
          emergencyPhone || null,
      })
      .eq("id", user.id)
      .select(
        `
        id,
        full_name,
        phone,
        whatsapp,
        emergency_name,
        emergency_phone
        `
      )
      .single();

    if (error) {
      console.error(
        "Profile contact update error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message ||
            "Unable to update contact information.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Contact information updated successfully.",
        profile: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Contact PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while updating contact information.",
      },
      { status: 500 }
    );
  }
}