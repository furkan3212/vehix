import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      console.error(
        "Missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase server configuration is missing.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    const authorization =
      req.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization
        .replace(/^Bearer\s+/i, "")
        .trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid authentication token.",
        },
        { status: 401 }
      );
    }

    /* =====================================================
       VERIFY LOGGED-IN USER
       ===================================================== */

    const supabaseAuth =
      createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabaseAuth.auth.getUser(
        accessToken
      );

    if (
      authError ||
      !user
    ) {
      console.error(
        "Admin authentication failed:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Your login session has expired.",
        },
        { status: 401 }
      );
    }

    /* =====================================================
       VERIFY ADMIN
       ===================================================== */

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const {
      data: isAdmin,
      error: adminError,
    } =
      await supabaseAdmin.rpc(
        "is_admin",
        {
          user_id: user.id,
        }
      );

    /*
     * Some Supabase functions are defined
     * without parameters. If the RPC above
     * fails because of its signature, fall
     * back to the existing no-argument version.
     */
    let adminConfirmed =
      isAdmin === true;

    if (
      adminError
    ) {
      const {
        data: fallbackAdmin,
        error:
          fallbackError,
      } =
        await supabaseAdmin.rpc(
          "is_admin"
        );

      if (
        fallbackError
      ) {
        console.error(
          "Admin verification failed:",
          fallbackError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to verify admin access.",
          },
          { status: 500 }
        );
      }

      adminConfirmed =
        fallbackAdmin === true;
    }

    if (!adminConfirmed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    /* =====================================================
       LOAD ORDERS
       ===================================================== */

    const {
      data: orders,
      error: ordersError,
    } =
      await supabaseAdmin
        .from("orders")
        .select(
          `
          id,
          order_number,
          product,
          quantity,
          unit_price,
          total_amount,

          full_name,
          email,
          phone,

          address,
          city,
          state,
          pincode,

          shape,
          color,
          finish,

          payment_status,
          order_status,

          payment_id,
          razorpay_order_id,

          qr_inventory_id,
          user_id,
          vehicle_id,

          created_at
          `
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (
      ordersError
    ) {
      console.error(
        "Admin orders query failed:",
        ordersError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            ordersError.message ||
            "Unable to load orders.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       SUCCESS
       ===================================================== */

    return NextResponse.json({
      success: true,
      orders:
        orders ?? [],
    });
  } catch (error) {
    console.error(
      "Admin orders API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load admin orders.",
      },
      { status: 500 }
    );
  }
}