import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    const razorpayKey =
      process.env.RAZORPAY_KEY_ID;

    const razorpaySecret =
      process.env.RAZORPAY_KEY_SECRET;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !razorpayKey ||
      !razorpaySecret
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Razorpay keys are not configured.",
        },
        { status: 500 }
      );
    }

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceKey
    ) {
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
       AUTHENTICATE CUSTOMER
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
      authorization.replace(
        /^Bearer\s+/i,
        ""
      );

    const supabaseAuth =
      createClient(
        supabaseUrl,
        supabaseAnonKey
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
      return NextResponse.json(
        {
          success: false,
          error:
            "Your login session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    /* =====================================================
       ADMIN CLIENT
       ===================================================== */

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseServiceKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    /* =====================================================
       REQUEST
       ===================================================== */

    const body =
      await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,

      vehicle_id,

      full_name,
      email,
      phone,

      address,
      city,
      state,
      pincode,

      product = "standard",
      amount,
    } = body;

    /* =====================================================
       REQUIRED DATA
       ===================================================== */

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Razorpay payment information.",
        },
        { status: 400 }
      );
    }

    if (!vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vehicle information is missing.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VERIFY VEHICLE OWNERSHIP
       ===================================================== */

    const {
      data: vehicle,
      error: vehicleError,
    } =
      await supabaseAdmin
        .from("vehicles")
        .select(
          `
            id,
            user_id,
            vehicle_number,
            brand,
            model,
            colour,
            vehicle_type
          `
        )
        .eq(
          "id",
          vehicle_id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (
      vehicleError ||
      !vehicle
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vehicle does not belong to your account.",
        },
        { status: 403 }
      );
    }

    /* =====================================================
       VERIFY RAZORPAY SIGNATURE
       ===================================================== */

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          razorpaySecret
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        razorpay_signature,
        "utf8"
      );

    if (
      expectedBuffer.length !==
        receivedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment signature verification failed.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       PREVENT DUPLICATE PROCESSING
       ===================================================== */

    const {
      data: existingOrder,
      error: existingOrderError,
    } =
      await supabaseAdmin
        .from("orders")
        .select(
          `
            id,
            order_number,
            payment_status,
            qr_inventory_id
          `
        )
        .eq(
          "payment_id",
          razorpay_payment_id
        )
        .maybeSingle();

    if (existingOrderError) {
      console.error(
        "Existing order lookup error:",
        existingOrderError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check existing payment.",
        },
        { status: 500 }
      );
    }

    if (existingOrder) {
      return NextResponse.json({
        success: true,

        alreadyProcessed:
          true,

        order_id:
          existingOrder.id,

        order_number:
          existingOrder.order_number,

        qr_inventory_id:
          existingOrder.qr_inventory_id,
      });
    }

    /* =====================================================
       VERIFY RAZORPAY ORDER AMOUNT
       ===================================================== */

    const basePrices: Record<
      string,
      number
    > = {
      basic: 499,
      standard: 499,
      design: 599,
      custom: 699,
    };

    const normalizedProduct =
      product === "basic" ? "standard" : product;

    const basePrice =
      basePrices[normalizedProduct];

    if (!basePrice) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid product.",
        },
        { status: 400 }
      );
    }

    /*
     * The first version of the store is Standard QR.
     * We calculate the expected amount server-side.
     */

    const expectedAmount =
      basePrice * 100;

    const auth =
      Buffer.from(
        `${razorpayKey}:${razorpaySecret}`
      ).toString(
        "base64"
      );

    const razorpayOrderResponse =
      await fetch(
        `https://api.razorpay.com/v1/orders/${encodeURIComponent(
          razorpay_order_id
        )}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Basic ${auth}`,
          },
        }
      );

    const razorpayOrder =
      await razorpayOrderResponse.json();

    if (
      !razorpayOrderResponse.ok
    ) {
      console.error(
        "Razorpay order lookup error:",
        razorpayOrder
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify Razorpay order.",
        },
        { status: 500 }
      );
    }

    if (
      Number(
        razorpayOrder.amount
      ) !== expectedAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment amount does not match the Vehix product price.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VERIFY PAYMENT WITH RAZORPAY
       ===================================================== */

    const paymentResponse =
      await fetch(
        `https://api.razorpay.com/v1/payments/${encodeURIComponent(
          razorpay_payment_id
        )}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Basic ${auth}`,
          },
        }
      );

    const payment =
      await paymentResponse.json();

    if (
      !paymentResponse.ok
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify payment with Razorpay.",
        },
        { status: 500 }
      );
    }

    if (
      payment.order_id !==
      razorpay_order_id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment order mismatch.",
        },
        { status: 400 }
      );
    }

    if (Number(payment.amount) !== expectedAmount) {
      return NextResponse.json({ success: false, error: "Captured payment amount does not match the Vehix product price." }, { status: 400 });
    }

    if (
      payment.status !==
      "captured"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Payment is not captured. Current status: ${payment.status}`,
        },
        { status: 400 }
      );
    }

    /* =====================================================
       COMPLETE ORDER
       ===================================================== */

    const {
      data: result,
      error: rpcError,
    } =
      await supabaseAdmin.rpc(
        "complete_qr_order",
        {
          p_user_id:
            user.id,

          p_vehicle_id:
            vehicle.id,

          p_full_name:
            String(
              full_name || ""
            ).trim(),

          p_email:
            String(
              email ||
                user.email ||
                ""
            ).trim(),

          p_phone:
            String(
              phone || ""
            ).trim(),

          p_address:
            String(
              address || ""
            ).trim(),

          p_city:
            String(
              city || ""
            ).trim(),

          p_state:
            String(
              state || ""
            ).trim(),

          p_pincode:
            String(
              pincode || ""
            ).trim(),

          p_product:
            normalizedProduct === "standard"
              ? "Standard QR"
              : normalizedProduct === "design"
                ? "Design QR"
                : "Custom Design",

          /*
           * The RPC expects rupees.
           */
          p_unit_price:
            expectedAmount / 100,

          p_payment_id:
            razorpay_payment_id,

          p_razorpay_order_id:
            razorpay_order_id,
        }
      );

    if (rpcError) {
      console.error(
        "complete_qr_order RPC error:",
        rpcError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            rpcError.message ||
            "Payment was verified but order creation failed.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       SUCCESS
       ===================================================== */

    const orderId =
      result?.order_id;

    const orderNumber =
      result?.order_number;

    const qrCode =
      result?.qr_code;

    const qrInventoryId =
      result?.qr_inventory_id;

    return NextResponse.json({
      success: true,

      message:
        "Payment verified and QR assigned successfully.",

      order_id:
        orderId,

      order_number:
        orderNumber,

      payment_id:
        razorpay_payment_id,

      razorpay_order_id:
        razorpay_order_id,

      qr: {
        id:
          qrInventoryId,

        code:
          qrCode,

        status:
          "sold",
      },

      vehicle: {
        id:
          vehicle.id,

        number:
          vehicle.vehicle_number,

        name:
          [
            vehicle.brand,
            vehicle.model,
          ]
            .filter(Boolean)
            .join(" "),
      },
    });
  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to complete payment verification.",
      },
      { status: 500 }
    );
  }
}