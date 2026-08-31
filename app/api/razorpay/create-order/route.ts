import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/*
|--------------------------------------------------------------------------
| SERVER-ONLY SUPABASE CLIENT
|--------------------------------------------------------------------------
*/

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

function getSupabaseAdmin() {
  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing from the server environment."
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing from the server environment."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/*
|--------------------------------------------------------------------------
| VEHIX PRODUCT PRICES
|--------------------------------------------------------------------------
|
| Standard QR = ₹499
|
*/

const PRODUCT_PRICES: Record<string, number> = {
  basic: 499,
  standard: 499,
};

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      vehicle_id,
      product,

      customer,
      delivery,

      full_name,
      email,
      phone,

      address,
      city,
      state,
      pincode,

      quantity,
    } = body;

    console.log("======================================");
    console.log("VEHIX CREATE RAZORPAY ORDER");
    console.log("user_id:", user_id || "MISSING");
    console.log("vehicle_id:", vehicle_id || "MISSING");
    console.log("product:", product || "MISSING");
    console.log("======================================");

    /*
    |--------------------------------------------------------------------------
    | 1. VALIDATE USER
    |--------------------------------------------------------------------------
    */

    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          error: "User is not logged in.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. VALIDATE VEHICLE
    |--------------------------------------------------------------------------
    */

    if (!vehicle_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehicle was not selected.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 3. VALIDATE PRODUCT
    |--------------------------------------------------------------------------
    */

    const selectedProduct =
      typeof product === "string"
        ? product.toLowerCase()
        : "basic";

    if (
      !Object.prototype.hasOwnProperty.call(
        PRODUCT_PRICES,
        selectedProduct
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Vehix QR product.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 4. CREATE SERVER SUPABASE CLIENT
    |--------------------------------------------------------------------------
    */

    let supabaseAdmin;

    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch (error) {
      console.error(
        "Supabase configuration error:",
        error instanceof Error
          ? error.message
          : error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase server configuration is missing or invalid.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 5. VERIFY VEHICLE
    |--------------------------------------------------------------------------
    */

    const {
      data: vehicle,
      error: vehicleError,
    } = await supabaseAdmin
      .from("vehicles")
      .select("id, user_id")
      .eq("id", vehicle_id)
      .maybeSingle();

    if (vehicleError) {
      console.error(
        "======================================"
      );
      console.error(
        "SUPABASE VEHICLE LOOKUP FAILED"
      );
      console.error(
        "message:",
        vehicleError.message
      );
      console.error(
        "details:",
        vehicleError.details
      );
      console.error(
        "hint:",
        vehicleError.hint
      );
      console.error(
        "code:",
        vehicleError.code
      );
      console.error(
        "======================================"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify vehicle. Please check the Supabase server key.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 6. VEHICLE NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!vehicle) {
      console.error(
        "Vehicle not found:",
        vehicle_id
      );

      return NextResponse.json(
        {
          success: false,
          error: "Vehicle not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 7. VERIFY VEHICLE OWNERSHIP
    |--------------------------------------------------------------------------
    */

     if (
  vehicle.user_id &&
  vehicle.user_id !== user_id
) {
      console.error(
        "Vehicle ownership mismatch:",
        {
          vehicleOwner: vehicle.user_id,
          requestedUser: user_id,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "This vehicle does not belong to the logged-in user.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 8. PRICE
    |--------------------------------------------------------------------------
    */

    const unitPrice =
      PRODUCT_PRICES[selectedProduct];

    /*
    |--------------------------------------------------------------------------
    | 9. QUANTITY
    |--------------------------------------------------------------------------
    */

    const requestedQuantity =
      Number(quantity);

    const finalQuantity =
      Number.isFinite(requestedQuantity) &&
      requestedQuantity >= 1
        ? Math.floor(requestedQuantity)
        : 1;

    if (finalQuantity > 20) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Maximum quantity allowed is 20.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 10. TOTAL
    |--------------------------------------------------------------------------
    */

    const totalAmount =
      unitPrice * finalQuantity;

    /*
    |--------------------------------------------------------------------------
    | 11. RAZORPAY CONFIGURATION
    |--------------------------------------------------------------------------
    */

    const razorpayKeyId =
      process.env.RAZORPAY_KEY_ID?.trim();

    const razorpayKeySecret =
      process.env.RAZORPAY_KEY_SECRET?.trim();

    if (
      !razorpayKeyId ||
      !razorpayKeySecret
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

    /*
    |--------------------------------------------------------------------------
    | 12. UNIQUE RECEIPT
    |--------------------------------------------------------------------------
    */

    const receipt =
      `vehix_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    /*
    |--------------------------------------------------------------------------
    | 13. CONVERT TO PAISE
    |--------------------------------------------------------------------------
    */

    const amountInPaise =
      Math.round(totalAmount * 100);

    /*
    |--------------------------------------------------------------------------
    | 14. RAZORPAY AUTH
    |--------------------------------------------------------------------------
    */

    const auth = Buffer.from(
      `${razorpayKeyId}:${razorpayKeySecret}`
    ).toString("base64");

    /*
    |--------------------------------------------------------------------------
    | 15. CREATE RAZORPAY ORDER
    |--------------------------------------------------------------------------
    */

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
                user_id,

              vehicle_id:
                vehicle_id,

              product:
                "Standard QR",

              quantity:
                String(finalQuantity),
            },

            partial_payment: false,
          }),
        }
      );

    /*
    |--------------------------------------------------------------------------
    | 16. READ RAZORPAY RESPONSE
    |--------------------------------------------------------------------------
    */

    const razorpayData =
      await razorpayResponse.json();

    /*
    |--------------------------------------------------------------------------
    | 17. HANDLE RAZORPAY ERROR
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | 18. SUCCESS
    |--------------------------------------------------------------------------
    */

    console.log(
      "Razorpay order created successfully:",
      razorpayData.id
    );

    return NextResponse.json({
      success: true,

      razorpay_order_id:
        razorpayData.id,

      amount:
        razorpayData.amount,

      currency:
        razorpayData.currency,

      key:
        razorpayKeyId,

      receipt,

      user_id,

      vehicle_id,

      product:
        "Standard QR",

      quantity:
        finalQuantity,

      unit_price:
        unitPrice,

      total_amount:
        totalAmount,

      customer:
        customer || {
          full_name:
            full_name || "",
          email:
            email || "",
          phone:
            phone || "",
        },

      delivery:
        delivery || {
          address:
            address || "",
          city:
            city || "",
          state:
            state || "",
          pincode:
            pincode || "",
        },

      razorpay_order:
        razorpayData,
    });
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "CREATE RAZORPAY ORDER ERROR"
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
            : "Something went wrong while creating payment.",
      },
      { status: 500 }
    );
  }
}