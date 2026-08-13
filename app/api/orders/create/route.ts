import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PRODUCTS = {
  basic: 299,
  premium: 499,
  metal: 899,
} as const;

const SHAPE_EXTRA: Record<string, number> = {
  Round: 0,
  Square: 0,
  Hexagon: 30,
  Shield: 40,
};

const FINISH_EXTRA: Record<string, number> = {
  Matte: 0,
  Gloss: 30,
  Reflective: 50,
  Carbon: 80,
};

const VALID_COLORS = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Gold",
];

function getAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function cleanString(
  value: unknown,
  maxLength: number
) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const product =
      typeof body.product === "string"
        ? body.product
        : "";

    const shape =
      typeof body.shape === "string"
        ? body.shape
        : "";

    const color =
      typeof body.color === "string"
        ? body.color
        : "";

    const finish =
      typeof body.finish === "string"
        ? body.finish
        : "";

    const quantity = Number(body.quantity);

    const fullName = cleanString(
      body.full_name,
      100
    );

    const email = cleanString(
      body.email,
      150
    ).toLowerCase();

    const phone = cleanString(
      body.phone,
      30
    );

    const address = cleanString(
      body.address,
      300
    );

    const city = cleanString(
      body.city,
      100
    );

    const state = cleanString(
      body.state,
      100
    );

    const pincode = cleanString(
      body.pincode,
      10
    );

    /*
     * -----------------------------------------
     * VALIDATION
     * -----------------------------------------
     */

    if (
      !Object.prototype.hasOwnProperty.call(
        PRODUCTS,
        product
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product.",
        },
        { status: 400 }
      );
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        SHAPE_EXTRA,
        shape
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid QR shape.",
        },
        { status: 400 }
      );
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        FINISH_EXTRA,
        finish
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid QR finish.",
        },
        { status: 400 }
      );
    }

    if (!VALID_COLORS.includes(color)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid QR color.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be between 1 and 20.",
        },
        { status: 400 }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email.",
        },
        { status: 400 }
      );
    }

    const cleanPhone =
      phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid phone number.",
        },
        { status: 400 }
      );
    }

    const cleanPincode =
      pincode.replace(/\D/g, "");

    if (cleanPincode.length !== 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 6-digit PIN code.",
        },
        { status: 400 }
      );
    }

    if (!address || !city || !state) {
      return NextResponse.json(
        {
          success: false,
          error: "Complete delivery address is required.",
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * SERVER-SIDE PRICE CALCULATION
     * -----------------------------------------
     *
     * Never trust the price coming from the
     * browser.
     */

    const unitPrice =
      PRODUCTS[
        product as keyof typeof PRODUCTS
      ] +
      SHAPE_EXTRA[shape] +
      FINISH_EXTRA[finish];

    const totalAmount =
      unitPrice * quantity;

    /*
     * -----------------------------------------
     * CREATE PENDING ORDER
     * -----------------------------------------
     */

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        product,
        shape,
        color,
        finish,
        quantity,

        unit_price: unitPrice,
        total_amount: totalAmount,

        full_name: fullName,
        email,
        phone: cleanPhone,

        address,
        city,
        state,
        pincode: cleanPincode,

        payment_status: "pending",
        order_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Order creation error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create your order.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order: data,
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create order API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        order: null,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the order.",
      },
      { status: 500 }
    );
  }
}