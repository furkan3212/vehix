import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* =========================================================
   SUPABASE ADMIN CLIENT
   ========================================================= */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(
  supabaseUrl!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =========================================================
   PRODUCT PRICES
   IMPORTANT:
   These prices are calculated SERVER-SIDE.
   Never trust the amount coming from the browser.
   ========================================================= */

const productPrices: Record<string, number> = {
  basic: 499,
  standard: 499,
  design: 599,
  custom: 699,
};

/* =========================================================
   POST
   ========================================================= */

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization) return NextResponse.json({ success: false, error: "You must be logged in." }, { status: 401 });
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) return NextResponse.json({ success: false, error: "Invalid authentication token." }, { status: 401 });
    const supabaseAuth = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
    if (!supabaseAuth) return NextResponse.json({ success: false, error: "Supabase authentication configuration is missing." }, { status: 500 });
    const { data: { user: authenticatedUser }, error: authError } = await supabaseAuth.auth.getUser(accessToken);
    if (authError || !authenticatedUser) return NextResponse.json({ success: false, error: "Your login session has expired. Please log in again." }, { status: 401 });
    const body = await req.json();

    const {
      user_id: requestedUserId,
      vehicle_id,

      product,
      shape,
      color,
      finish,
      quantity,

      customer,
      delivery,
    } = body;

    /* =====================================================
       1. VALIDATE USER
       ===================================================== */

    if (requestedUserId && requestedUserId !== authenticatedUser.id) {
      return NextResponse.json({ success: false, error: "Authenticated user does not match the order request." }, { status: 403 });
    }

    const authenticatedUserId = authenticatedUser.id;

    /* =====================================================
       2. VALIDATE VEHICLE
       ===================================================== */

    if (!vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehicle was not selected.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       3. VALIDATE PRODUCT
       ===================================================== */

    const normalizedProduct =
      product === "basic" ? "standard" : product;

    if (
      !normalizedProduct ||
      !Object.prototype.hasOwnProperty.call(
        productPrices,
        normalizedProduct
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid QR product.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       4. VALIDATE QUANTITY
       ===================================================== */

    const parsedQuantity = Number(quantity);

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity < 1 ||
      parsedQuantity > 20
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid quantity.",
        },
        { status: 400 }
      );
    }

    const finalQuantity =
      Math.floor(parsedQuantity);

    /* =====================================================
       5. VALIDATE VEHICLE BELONGS TO USER
       ===================================================== */

    const { data: vehicle, error: vehicleError } =
      await supabaseAdmin
        .from("vehicles")
        .select("id, user_id")
        .eq("id", vehicle_id)
        .maybeSingle();

    if (vehicleError) {
      console.error(
        "Vehicle lookup error:",
        vehicleError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify vehicle.",
        },
        { status: 500 }
      );
    }

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehicle not found.",
        },
        { status: 404 }
      );
    }

    if (
      vehicle.user_id !== authenticatedUserId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This vehicle does not belong to the logged-in user.",
        },
        { status: 403 }
      );
    }

    /* =====================================================
       6. CALCULATE PRICE SERVER-SIDE
       ===================================================== */

    const basePrice =
      productPrices[normalizedProduct];

    const selectedShape =
      typeof shape === "string"
        ? shape
        : "Shield";

    const selectedFinish =
      typeof finish === "string"
        ? finish
        : "Matte";

    /*
     * Current Vehix launch product: Standard QR = ₹499.
     * Shape/finish are retained as product metadata but do not
     * change the launch price.
     */
    const unitPrice = basePrice;
    const totalAmount = unitPrice * finalQuantity;

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to calculate order amount.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       7. RAZORPAY KEYS
       ===================================================== */

    const keyId =
      process.env.RAZORPAY_KEY_ID;

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Razorpay keys are not configured.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       8. CREATE UNIQUE RECEIPT
       ===================================================== */

    const receipt =
      `vehix_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    /* =====================================================
       9. CONVERT INR → PAISE
       ===================================================== */

    const amountInPaise =
      Math.round(totalAmount * 100);

    /* =====================================================
       10. RAZORPAY BASIC AUTH
       ===================================================== */

    const auth = Buffer.from(
      `${keyId}:${keySecret}`
    ).toString("base64");

    /* =====================================================
       11. CREATE RAZORPAY ORDER
       ===================================================== */

    const razorpayResponse =
      await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Basic ${auth}`,
          },

          body: JSON.stringify({
            amount: amountInPaise,

            currency: "INR",

            receipt,

            notes: {
              source:
                "vehix_qr_store",

              user_id:
                authenticatedUserId,

              vehicle_id:
                vehicle_id,

              product:
                normalizedProduct,

              shape:
                selectedShape,

              color:
                color || "Black",

              finish:
                selectedFinish,

              quantity:
                String(finalQuantity),
            },

            partial_payment: false,
          }),
        }
      );

    const razorpayData =
      await razorpayResponse.json();

    /* =====================================================
       12. HANDLE RAZORPAY ERROR
       ===================================================== */

    if (!razorpayResponse.ok) {
      console.error(
        "Razorpay create order error:",
        razorpayData
      );

      return NextResponse.json(
        {
          success: false,

          error:
            razorpayData?.error
              ?.description ||
            "Unable to create Razorpay order.",
        },
        {
          status:
            razorpayResponse.status,
        }
      );
    }

    /* =====================================================
       13. RETURN DATA TO PAYMENT PAGE
       ===================================================== */

    return NextResponse.json({
      success: true,

      /*
       * Razorpay information
       */
      razorpay_order_id:
        razorpayData.id,

      amount:
        razorpayData.amount,

      currency:
        razorpayData.currency,

      /*
       * Public Razorpay key
       */
      key: keyId,

      /*
       * Vehix order information
       */
      receipt,

      user_id: authenticatedUserId,

      vehicle_id,

      product: normalizedProduct,

      shape: selectedShape,

      color:
        color || "Black",

      finish:
        selectedFinish,

      quantity:
        finalQuantity,

      unit_price:
        unitPrice,

      total_amount:
        totalAmount,

      customer:
        customer || null,

      delivery:
        delivery || null,

      /*
       * Keep the complete Razorpay response
       * available if we need it later.
       */
      razorpay_order:
        razorpayData,
    });
  } catch (error) {
    console.error(
      "Create Razorpay order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating payment.",
      },
      { status: 500 }
    );
  }
}