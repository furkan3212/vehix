"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock3,
  Copy,
  Package,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string | null;
  product: string | null;
  quantity: number | null;
  unit_price: number | null;
  total_amount: number | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  shape: string | null;
  color: string | null;
  finish: string | null;
  payment_status: string | null;
  order_status: string | null;
  payment_id: string | null;
  razorpay_order_id: string | null;
  qr_inventory_id: string | null;
  user_id: string | null;
  vehicle_id: string | null;
  created_at: string;
};

type QRInventory = {
  id: string;
  qr_code: string | null;
  status: string | null;
  assigned_user_id: string | null;
  vehicle_id: string | null;
};

type Vehicle = {
  id: string;
  vehicle_number: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  nickname: string | null;
  vehicle_type: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(value: number | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function normalizeStatus(value: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

function isPaymentSuccessful(value: string | null) {
  const status = normalizeStatus(value);

  return (
    status === "paid" ||
    status === "captured" ||
    status === "success" ||
    status === "successful"
  );
}

function isQrActivated(value: string | null) {
  return normalizeStatus(value).includes("activ");
}

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();

  const orderId =
    typeof params.id === "string" ? params.id : "";

  const [order, setOrder] = useState<Order | null>(null);
  const [qr, setQr] = useState<QRInventory | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function loadOrder(showRefreshState = false) {
    if (!orderId) {
      setError("Invalid order reference.");
      setLoading(false);
      return;
    }

    if (showRefreshState) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Order success auth error:", authError);
        throw new Error("Unable to verify your account.");
      }

      if (!user) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/order-success/${orderId}`
          )}`
        );
        return;
      }

      /*
       * Security:
       * Always scope the order lookup to the authenticated user.
       * A customer must not be able to view another customer's
       * order by changing the [id] URL parameter.
       */
      const { data: orderData, error: orderError } =
        await supabase
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
          .eq("id", orderId)
          .eq("user_id", user.id)
          .maybeSingle();

      if (orderError) {
        console.error("Order loading error:", orderError);
        throw new Error("Unable to load your order.");
      }

      if (!orderData) {
        setOrder(null);
        setQr(null);
        setVehicle(null);
        setError(
          "This order could not be found in your Vehix account."
        );
        return;
      }

      const loadedOrder = orderData as Order;
      setOrder(loadedOrder);

      /*
       * QR assignment is stored in qr_inventory and linked from
       * orders.qr_inventory_id after complete_qr_order succeeds.
       */
      if (loadedOrder.qr_inventory_id) {
        const { data: qrData, error: qrError } =
          await supabase
            .from("qr_inventory")
            .select(
              "id, qr_code, status, assigned_user_id, vehicle_id"
            )
            .eq("id", loadedOrder.qr_inventory_id)
            .eq("assigned_user_id", user.id)
            .maybeSingle();

        if (qrError) {
          console.warn("QR loading error:", qrError);
        }

        setQr((qrData as QRInventory | null) ?? null);
      } else {
        setQr(null);
      }

      /*
       * Vehicle is separately loaded and scoped to the same
       * authenticated owner.
       */
      if (loadedOrder.vehicle_id) {
        const { data: vehicleData, error: vehicleError } =
          await supabase
            .from("vehicles")
            .select(
              `
                id,
                vehicle_number,
                brand,
                model,
                year,
                color,
                nickname,
                vehicle_type
              `
            )
            .eq("id", loadedOrder.vehicle_id)
            .eq("user_id", user.id)
            .maybeSingle();

        if (vehicleError) {
          console.warn(
            "Vehicle loading error:",
            vehicleError
          );
        }

        setVehicle(
          (vehicleData as Vehicle | null) ?? null
        );
      } else {
        setVehicle(null);
      }
    } catch (err) {
      console.error("Order success page error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your order."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadOrder();
    // orderId and router are stable for this page lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function copyOrderNumber() {
    const value = order?.order_number || order?.id;

    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] text-white">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-6xl items-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
                <ShieldCheck size={23} />
              </div>
              <div>
                <p className="text-xl font-black tracking-wider">
                  VEHIX
                </p>
                <p className="-mt-1 text-[10px] font-semibold text-blue-400">
                  SMART VEHICLE IDENTITY
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <RefreshCw
                size={28}
                className="animate-spin text-blue-400"
              />
            </div>
            <p className="mt-5 text-sm font-semibold text-zinc-400">
              Loading your Vehix order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#030712] text-white">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
                <ShieldCheck size={23} />
              </div>
              <div className="text-left">
                <p className="text-xl font-black tracking-wider">
                  VEHIX
                </p>
                <p className="-mt-1 text-[10px] font-semibold text-blue-400">
                  SMART VEHICLE IDENTITY
                </p>
              </div>
            </button>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-6 py-16">
          <div className="w-full rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <ShieldCheck
                size={30}
                className="text-red-400"
              />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              Order unavailable
            </p>

            <h1 className="mt-3 text-3xl font-black">
              We couldn&apos;t load this order
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
              {error ||
                "The order does not exist or is not connected to your Vehix account."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void loadOrder(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 font-bold text-zinc-300 transition hover:border-white/20 hover:text-white"
              >
                Go to Dashboard
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const paymentPaid = isPaymentSuccessful(
    order.payment_status
  );
  const qrActivated = isQrActivated(qr?.status ?? null);
  const quantity = Math.max(
    1,
    Number(order.quantity ?? 1)
  );

  const vehicleName =
    [
      vehicle?.brand,
      vehicle?.model,
    ]
      .filter(Boolean)
      .join(" ") ||
    vehicle?.nickname ||
    "Your vehicle";

  const orderDisplayNumber =
    order.order_number || order.id;

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
              <ShieldCheck size={23} />
            </div>
            <div className="text-left">
              <p className="text-xl font-black tracking-wider">
                VEHIX
              </p>
              <p className="-mt-1 text-[10px] font-semibold text-blue-400">
                SMART VEHICLE IDENTITY
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
            <ShieldCheck size={15} />
            Secure Order
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle2
              size={54}
              className="text-emerald-400"
            />
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
            {paymentPaid
              ? "Payment Successful"
              : "Order Received"}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            Order Confirmed
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 md:text-lg">
            Your Vehix QR order has been successfully
            placed. We&apos;ve connected it to the vehicle
            selected during checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Package size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">
                    Vehix Order
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="break-all font-bold text-white">
                      {orderDisplayNumber}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        void copyOrderNumber()
                      }
                      className="shrink-0 rounded-lg border border-white/10 p-1.5 text-zinc-500 transition hover:border-white/20 hover:text-white"
                      aria-label="Copy order number"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  {copied && (
                    <p className="mt-1 text-[11px] font-semibold text-emerald-400">
                      Copied
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => void loadOrder(true)}
                disabled={refreshing}
                className="rounded-xl border border-white/10 p-2.5 text-zinc-500 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                aria-label="Refresh order"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs text-zinc-600">
                  Product
                </p>
                <p className="mt-1 font-bold text-white">
                  {order.product || "Vehix QR"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Quantity: {quantity}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs text-zinc-600">
                  Amount Paid
                </p>
                <p className="mt-1 text-2xl font-black text-blue-400">
                  {formatMoney(order.total_amount)}
                </p>
                <p className="mt-1 text-xs text-emerald-400">
                  {paymentPaid
                    ? "Payment captured"
                    : `Payment: ${
                        order.payment_status ||
                        "pending"
                      }`}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-600">
                    Order status
                  </p>
                  <p className="mt-1 font-bold capitalize">
                    {String(
                      order.order_status ||
                        "processing"
                    ).replace(/_/g, " ")}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                  {paymentPaid ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock3 size={14} />
                  )}
                  {paymentPaid
                    ? "Paid"
                    : "Processing"}
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-600">
                Placed {formatDate(order.created_at)}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Car size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Vehicle
                </p>
                <p className="mt-1 truncate font-bold text-white">
                  {vehicleName}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {vehicle?.vehicle_number ||
                    "Vehicle details unavailable"}
                </p>
              </div>
            </div>

            {vehicle && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[11px] text-zinc-600">
                    Type
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {vehicle.vehicle_type || "Car"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[11px] text-zinc-600">
                    Year
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {vehicle.year || "—"}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs text-zinc-600">
                Delivery
              </p>
              <p className="mt-1 font-semibold">
                {order.address || "Address on order"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {[
                  order.city,
                  order.state,
                  order.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-3xl border border-blue-500/15 bg-blue-500/[0.045] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <QrCode size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                  Vehix QR Identity
                </p>

                {qr ? (
                  <>
                    <p className="mt-2 text-lg font-black">
                      QR Assigned
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      QR code:{" "}
                      <span className="font-semibold text-zinc-300">
                        {qr.qr_code || "Assigned"}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-lg font-black">
                      QR assignment processing
                    </p>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">
                      Your payment and order are recorded.
                      The QR identity will appear here as
                      soon as the inventory assignment is
                      available.
                    </p>
                  </>
                )}
              </div>
            </div>

            {qr && (
              <div
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black ${
                  qrActivated
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                }`}
              >
                {qrActivated
                  ? "Activated"
                  : "Awaiting Activation"}
              </div>
            )}
          </div>

          {qr && !qrActivated && (
            <div className="mt-6 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
              <div className="flex items-start gap-3">
                <Clock3
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <p className="text-sm leading-6 text-zinc-400">
                  Your QR is assigned to your account but
                  is not activated yet. Complete the Vehix
                  activation process when you are ready.
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-black shadow-xl shadow-blue-600/20 transition hover:scale-[1.01]"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-4 font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Back to Vehix
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-zinc-700">
          <ShieldCheck size={13} />
          <span>Vehix Smart Vehicle Identity</span>
        </div>
      </div>
    </main>
  );
}
