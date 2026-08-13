export type CreateOrderInput = {
  product: "basic" | "premium" | "metal";
  shape: string;
  color: string;
  finish: string;
  quantity: number;

  full_name: string;
  email: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  order_number: string;

  product: string;
  shape: string;
  color: string;
  finish: string;
  quantity: number;

  unit_price: number;
  total_amount: number;

  full_name: string;
  email: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  payment_status: string;
  order_status: string;

  payment_id: string | null;
  qr_inventory_id: string | null;

  created_at: string;
  updated_at: string;
};

export type CreateOrderResponse = {
  success: boolean;
  order: Order | null;
  error: string | null;
};

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResponse> {
  try {
    const response = await fetch(
      "/api/orders/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }
    );

    const result =
      (await response.json()) as CreateOrderResponse;

    if (!response.ok || !result.success) {
      return {
        success: false,
        order: null,
        error:
          result.error ||
          "Unable to create order.",
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      order: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to create order.",
    };
  }
}