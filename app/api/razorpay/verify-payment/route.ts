import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    const razorpayKey =
      process.env.RAZORPAY_KEY_ID?.trim();

    const razorpaySecret =
      process.env.RAZORPAY_KEY_SECRET?.trim();

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    const resendApiKey =
  process.env.RESEND_API_KEY?.trim();

const adminEmail =
  process.env.VEHIX_ADMIN_EMAIL?.trim();  

    if (
      !razorpayKey ||
      !razorpaySecret
    ) {
      console.error(
        "Razorpay environment variables are missing."
      );

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
      console.error(
        "Supabase environment variables are missing."
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
      ).trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your login session is invalid.",
        },
        { status: 401 }
      );
    }

    /*
     * Client using the public/anon key only
     * for validating the customer's access token.
     */

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
        "Customer authentication failed:",
        authError
      );

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
       ADMIN SUPABASE CLIENT
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

      product = "basic",
      amount,
    } = body;

    console.log(
      "======================================"
    );

    console.log(
      "VEHIX VERIFY RAZORPAY PAYMENT"
    );

    console.log(
      "user_id:",
      user.id
    );

    console.log(
      "vehicle_id:",
      vehicle_id
    );

    console.log(
      "razorpay_order_id:",
      razorpay_order_id
    );

    console.log(
      "razorpay_payment_id:",
      razorpay_payment_id
    );

    console.log(
      "product:",
      product
    );

    console.log(
      "======================================"
    );

    /* =====================================================
       REQUIRED RAZORPAY DATA
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

    /* =====================================================
       REQUIRED VEHICLE
       ===================================================== */

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

    if (vehicleError) {
      console.error(
        "Vehicle verification error:",
        vehicleError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify the selected vehicle.",
        },
        { status: 500 }
      );
    }

    if (!vehicle) {
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
      console.error(
        "Razorpay signature verification failed."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment signature verification failed.",
        },
        { status: 400 }
      );
    }

    console.log(
      "Razorpay signature verified successfully."
    );

    /* =====================================================
       PREVENT DUPLICATE PAYMENT PROCESSING
       ===================================================== */

    const {
      data: existingOrder,
      error:
        existingOrderError,
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
      console.log(
        "Payment was already processed:",
        existingOrder.id
      );

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

        payment_id:
          razorpay_payment_id,
      });
    }

    /* =====================================================
       VERIFY PRODUCT PRICE
       ===================================================== */

    /*
     * Standard QR is ₹499.
     *
     * The old ₹339 calculation is intentionally removed.
     */

    const basePrices: Record<
      string,
      number
    > = {
      basic: 499,
      standard: 499,
    };

    const selectedProduct =
      typeof product === "string"
        ? product.toLowerCase()
        : "basic";

    const basePrice =
      basePrices[selectedProduct];

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

    const expectedAmount =
      basePrice * 100;

    /* =====================================================
       RAZORPAY AUTH
       ===================================================== */

    const auth =
      Buffer.from(
        `${razorpayKey}:${razorpaySecret}`
      ).toString(
        "base64"
      );

    /* =====================================================
       VERIFY RAZORPAY ORDER
       ===================================================== */

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

    /* =====================================================
       VERIFY ORDER AMOUNT
       ===================================================== */

    if (
      Number(
        razorpayOrder.amount
      ) !== expectedAmount
    ) {
      console.error(
        "Razorpay amount mismatch:",
        {
          expected:
            expectedAmount,

          received:
            razorpayOrder.amount,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment amount does not match the Vehix product price.",
        },
        { status: 400 }
      );
    }

    console.log(
      "Razorpay order amount verified: ₹",
      basePrice
    );

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
      console.error(
        "Razorpay payment lookup error:",
        payment
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify payment with Razorpay.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       VERIFY PAYMENT ORDER
       ===================================================== */

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

    /* =====================================================
       VERIFY PAYMENT AMOUNT
       ===================================================== */

    if (
      Number(
        payment.amount
      ) !== expectedAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment amount mismatch.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VERIFY PAYMENT STATUS
       ===================================================== */

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

    console.log(
      "Razorpay payment captured successfully."
    );

    /* =====================================================
       COMPLETE ORDER
       ===================================================== */

    console.log(
      "Calling complete_qr_order..."
    );

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
            selectedProduct ===
            "basic"
              ? "Standard QR"
              : selectedProduct,

          /*
           * RPC expects rupees.
           */
          p_unit_price:
            basePrice,

          p_payment_id:
            razorpay_payment_id,

          p_razorpay_order_id:
            razorpay_order_id,
        }
      );

    /* =====================================================
       RPC ERROR
       ===================================================== */

    if (rpcError) {
      console.error(
        "======================================"
      );

      console.error(
        "complete_qr_order RPC ERROR"
      );

      console.error(
        "message:",
        rpcError.message
      );

      console.error(
        "details:",
        rpcError.details
      );

      console.error(
        "hint:",
        rpcError.hint
      );

      console.error(
        "code:",
        rpcError.code
      );

      console.error(
        "======================================"
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
       READ RESULT
       ===================================================== */

    console.log(
      "complete_qr_order result:",
      result
    );

    const orderId =
      result?.order_id;

    const orderNumber =
      result?.order_number;

    const qrCode =
      result?.qr_code;

    const qrInventoryId =
      result?.qr_inventory_id;
    /* =====================================================
   SEND ADMIN NEW ORDER EMAIL
   ===================================================== */

if (
  resendApiKey &&
  adminEmail
) {
  try {
    const resend =
      new Resend(
        resendApiKey
      );

    const customerName =
      String(
        full_name || "Customer"
      ).trim();

    const customerEmail =
      String(
        email ||
          user.email ||
          "Not provided"
      ).trim();

    const customerPhone =
      String(
        phone ||
          "Not provided"
      ).trim();

    const vehicleNumber =
      vehicle.vehicle_number ||
      "Not provided";

    const vehicleName =
      [
        vehicle.brand,
        vehicle.model,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Vehicle";

    const formattedAmount =
      Number(
        amount
      ) || basePrice;

    await resend.emails.send({
      from:
        "Vehix <onboarding@resend.dev>",

      to:
        adminEmail,

      subject:
        `🚨 New Vehix Order — ${orderNumber}`,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;background:#ffffff;color:#111827;padding:32px;border-radius:16px;">

          <h1 style="margin:0 0 8px;font-size:28px;">
            🚨 New Vehix Order
          </h1>

          <p style="color:#6b7280;margin-top:0;">
            A new Vehix QR order has been successfully paid and confirmed.
          </p>

          <div style="margin-top:24px;padding:20px;background:#f3f4f6;border-radius:12px;">
            <p style="margin:0 0 8px;">
              <strong>Order Number:</strong>
              ${orderNumber || "Not available"}
            </p>

            <p style="margin:0 0 8px;">
              <strong>Product:</strong>
              ${product === "basic" ? "Standard QR" : product}
            </p>

            <p style="margin:0;">
              <strong>Amount Paid:</strong>
              ₹${formattedAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <h2 style="margin-top:28px;">
            Customer
          </h2>

          <p>
            <strong>Name:</strong>
            ${customerName}
          </p>

          <p>
            <strong>Email:</strong>
            ${customerEmail}
          </p>

          <p>
            <strong>Phone:</strong>
            ${customerPhone}
          </p>

          <h2 style="margin-top:28px;">
            Vehicle
          </h2>

          <p>
            <strong>Vehicle:</strong>
            ${vehicleName}
          </p>

          <p>
            <strong>Registration:</strong>
            ${vehicleNumber}
          </p>

          <h2 style="margin-top:28px;">
            QR Assignment
          </h2>

          <p>
            <strong>QR Code:</strong>
            ${qrCode || "Not available"}
          </p>

          <p>
            <strong>QR Inventory ID:</strong>
            ${qrInventoryId || "Not available"}
          </p>

          <p>
            <strong>Payment ID:</strong>
            ${razorpay_payment_id}
          </p>

          <p>
            <strong>Razorpay Order ID:</strong>
            ${razorpay_order_id}
          </p>

          <div style="margin-top:32px;padding:16px;background:#ecfdf5;border-radius:12px;color:#065f46;">
            <strong>Payment Status: PAID</strong>
            <br />
            <span>Order Status: CONFIRMED</span>
          </div>

          <p style="margin-top:32px;color:#9ca3af;font-size:12px;">
            This is an automated notification from Vehix.
          </p>

        </div>
      `,
    });

    console.log(
      "Admin order email sent successfully."
    );
  } catch (emailError) {
    /*
     * VERY IMPORTANT:
     *
     * If email fails, we DO NOT fail the customer's
     * successful payment/order.
     */
    console.error(
      "Admin order email failed:",
      emailError
    );
  }
}
    /* =====================================================
       CHECK ORDER RESULT
       ===================================================== */

    if (!orderId) {
      console.error(
        "complete_qr_order did not return an order ID."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment was verified, but the Vehix order could not be created.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       SUCCESS
       ===================================================== */

    console.log(
      "======================================"
    );

    console.log(
      "VEHIX ORDER COMPLETED SUCCESSFULLY"
    );

    console.log(
      "order_id:",
      orderId
    );

    console.log(
      "order_number:",
      orderNumber
    );

    console.log(
      "qr_inventory_id:",
      qrInventoryId
    );

    console.log(
      "qr_code:",
      qrCode
    );

    console.log(
      "payment_id:",
      razorpay_payment_id
    );

    console.log(
      "======================================"
    );

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
      "======================================"
    );

    console.error(
      "VERIFY PAYMENT UNEXPECTED ERROR"
    );

    console.error(
      error
    );

    console.error(
      "======================================"
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to complete payment verification.",
      },
      { status: 500 }
    );
  }
}