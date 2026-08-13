"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

import { createOrder } from "@/services/orders";

type ProductId =
  | "basic"
  | "premium"
  | "metal";

const products = {
  basic: {
    name: "Basic QR Sticker",
    price: 299,
  },
  premium: {
    name: "Premium QR Sticker",
    price: 499,
  },
  metal: {
    name: "Metal QR Plate",
    price: 899,
  },
};

const shapeExtra: Record<string, number> = {
  Round: 0,
  Square: 0,
  Hexagon: 30,
  Shield: 40,
};

const finishExtra: Record<string, number> = {
  Matte: 0,
  Gloss: 30,
  Reflective: 50,
  Carbon: 80,
};

const validColors = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Gold",
];

function safeProduct(
  value: string | null
): ProductId {
  if (
    value === "basic" ||
    value === "premium" ||
    value === "metal"
  ) {
    return value;
  }

  return "premium";
}

function safeQuantity(
  value: string | null
): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 1;
  }

  return Math.min(
    20,
    Math.max(1, Math.floor(number))
  );
}

/**
 * Checkout content.
 *
 * This component uses useSearchParams(), so it is
 * rendered inside Suspense by the page component below.
 */
function CheckoutContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const productId = safeProduct(
    searchParams.get("product")
  );

  const shape =
    searchParams.get("shape") ||
    "Shield";

  const colorFromUrl =
    searchParams.get("color") ||
    "Black";

  const color = validColors.includes(
    colorFromUrl
  )
    ? colorFromUrl
    : "Black";

  const finish =
    searchParams.get("finish") ||
    "Matte";

  const quantity = safeQuantity(
    searchParams.get("quantity")
  );

  const product = products[productId];

  const unitPrice = useMemo(
    () =>
      product.price +
      (shapeExtra[shape] ?? 0) +
      (finishExtra[finish] ?? 0),
    [product.price, shape, finish]
  );

  const total = unitPrice * quantity;

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handlePayment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      setError(
        "Please complete all delivery details."
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (
      phone.replace(/\D/g, "").length < 10
    ) {
      setError(
        "Please enter a valid phone number."
      );

      return;
    }

    if (
      pincode.replace(/\D/g, "").length !== 6
    ) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );

      return;
    }

    try {
      setLoading(true);

      const result = await createOrder({
        product: productId,
        shape,
        color,
        finish,
        quantity,

        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),

        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      });

      if (!result.success || !result.order) {
        setError(
          result.error ||
            "Unable to create your order."
        );

        return;
      }

      /*
       * Payment will be connected after
       * order creation is verified.
       */

      router.push(
        `/order-success/${result.order.id}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
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
          </Link>

          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
            <Lock size={15} />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <Link
          href="/#qr-store"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to QR Store
        </Link>

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            Vehix Store
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Complete Your Order
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-500">
            Enter your delivery information
            and review your Vehix QR
            configuration.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px]">
          <form
            onSubmit={handlePayment}
            className="space-y-7"
          >
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Customer Details
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    We'll use these details for
                    your order.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Delivery Address
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Where should we deliver your
                    Vehix QR?
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="House / Flat / Building / Street"
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(event) =>
                        setCity(
                          event.target.value
                        )
                      }
                      placeholder="Mumbai"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      State
                    </label>

                    <input
                      type="text"
                      value={state}
                      onChange={(event) =>
                        setState(
                          event.target.value
                        )
                      }
                      placeholder="Maharashtra"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      PIN Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChange={(event) =>
                        setPincode(
                          event.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="400001"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-black shadow-xl shadow-blue-600/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard size={21} />

              {loading
                ? "Creating Order..."
                : `Continue • ₹${total}`}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-zinc-600">
              <span className="flex items-center gap-2">
                <Lock size={14} />
                Secure checkout
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck size={14} />
                Server verified pricing
              </span>

              <span className="flex items-center gap-2">
                <Check size={14} />
                No charge yet
              </span>
            </div>
          </form>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
              <div className="border-b border-white/10 p-7">
                <div className="flex items-center gap-3">
                  <Package
                    size={20}
                    className="text-blue-400"
                  />

                  <h2 className="text-xl font-black">
                    Order Summary
                  </h2>
                </div>
              </div>

              <div className="p-7">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center ${
                      color === "Black"
                        ? "bg-black"
                        : color === "White"
                        ? "bg-white"
                        : color === "Blue"
                        ? "bg-blue-600"
                        : color === "Red"
                        ? "bg-red-600"
                        : "bg-yellow-400"
                    } ${
                      shape === "Round"
                        ? "rounded-full"
                        : shape === "Square"
                        ? "rounded-2xl"
                        : shape === "Hexagon"
                        ? "rounded-[28px]"
                        : "rounded-[30px_30px_40px_40px]"
                    }`}
                  >
                    <div className="h-14 w-14 rounded-lg bg-white p-1">
                      <div className="h-full w-full bg-black" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {color} • {shape}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {finish} • Qty {quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Base product
                    </span>

                    <span>
                      ₹{product.price}
                    </span>
                  </div>

                  {(shapeExtra[shape] ?? 0) >
                    0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">
                        {shape} shape
                      </span>

                      <span>
                        +₹{shapeExtra[shape]}
                      </span>
                    </div>
                  )}

                  {(finishExtra[finish] ?? 0) >
                    0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">
                        {finish} finish
                      </span>

                      <span>
                        +₹{finishExtra[finish]}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Unit price
                    </span>

                    <span>
                      ₹{unitPrice}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Quantity
                    </span>

                    <span>
                      × {quantity}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <div className="flex items-end justify-between">
                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-3xl font-black text-blue-400">
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-green-400"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Secure Vehix Order
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        Payment will be processed
                        only after the order is
                        created successfully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/**
 * Production-safe checkout page.
 *
 * Next.js requires useSearchParams() to be
 * inside a Suspense boundary.
 */
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />

            <p className="mt-4 text-sm text-zinc-500">
              Loading checkout...
            </p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}