"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

type Vehicle = {
  id: string;
  vehicle_number: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  nickname: string | null;
};

type CheckoutData = {
  userId: string;
  vehicleId: string;

  fullName: string;
  email: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  product: string;
  amount: number;
  quantity: number;
};

const STANDARD_QR_PRICE = 499;

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const product = searchParams.get("product") || "basic";
  const vehicleId = searchParams.get("vehicle");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [userId, setUserId] = useState("");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * PRODUCT
   * ---------------------------------------------------------
   */

  const productInfo = useMemo(() => {
    switch (product) {
      case "basic":
      case "standard":
      default:
        return {
          name: "Standard QR",
          description: "Vehix Smart QR Identity",
          price: STANDARD_QR_PRICE,
        };
    }
  }, [product]);

  /*
   * ---------------------------------------------------------
   * LOAD USER + VEHICLE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        setLoading(true);
        setError("");

        if (!vehicleId) {
          setError("No vehicle was selected.");
          setLoading(false);
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push(
            `/login?redirect=/qr-store/checkout?product=${encodeURIComponent(
              product
            )}&vehicle=${encodeURIComponent(vehicleId)}`
          );
          return;
        }

        setUserId(user.id);

        /*
         * User information
         *
         * We first use Auth metadata and then allow the
         * customer to edit the fields on this page.
         */

        const metadata = user.user_metadata || {};

        setFullName(
          metadata.full_name ||
            metadata.name ||
            metadata.display_name ||
            ""
        );

        setEmail(user.email || "");

        setPhone(
          metadata.phone ||
            metadata.phone_number ||
            ""
        );

        /*
         * Load selected vehicle.
         */

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
                nickname
              `
            )
            .eq("id", vehicleId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (vehicleError) {
          console.error("Vehicle loading error:", vehicleError);

          setError(
            "Unable to load your selected vehicle."
          );

          setLoading(false);
          return;
        }

        if (!vehicleData) {
          setError(
            "This vehicle could not be found or does not belong to your account."
          );

          setLoading(false);
          return;
        }

        setVehicle(vehicleData);

        /*
         * Restore previously entered checkout information
         * if the customer returns to this page.
         */

        try {
          const saved = localStorage.getItem(
            "vehix_checkout_data"
          );

          if (saved) {
            const parsed = JSON.parse(saved);

            if (
              parsed.vehicleId === vehicleId &&
              parsed.userId === user.id
            ) {
              setFullName(parsed.fullName || metadata.full_name || "");
              setEmail(parsed.email || user.email || "");
              setPhone(
                parsed.phone ||
                  metadata.phone ||
                  metadata.phone_number ||
                  ""
              );

              setAddress(parsed.address || "");
              setCity(parsed.city || "");
              setState(parsed.state || "");
              setPincode(parsed.pincode || "");
            }
          }
        } catch (storageError) {
          console.error(
            "Unable to restore checkout data:",
            storageError
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Checkout loading error:", err);

        setError(
          "Something went wrong while loading checkout."
        );

        setLoading(false);
      }
    };

    loadCheckout();
  }, [router, product, vehicleId]);

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
   */

  const validateForm = () => {
    if (!vehicleId) {
      return "Please select a vehicle.";
    }

    if (!vehicle) {
      return "Selected vehicle is unavailable.";
    }

    if (!fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!email.trim()) {
      return "Please enter your email address.";
    }

    if (!phone.trim()) {
      return "Please enter your phone number.";
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return "Please enter a valid phone number.";
    }

    if (!address.trim()) {
      return "Please enter your complete delivery address.";
    }

    if (!city.trim()) {
      return "Please enter your city.";
    }

    if (!state.trim()) {
      return "Please enter your state.";
    }

    const cleanPincode = pincode.replace(/\D/g, "");

    if (cleanPincode.length !== 6) {
      return "Please enter a valid 6-digit PIN code.";
    }

    return "";
  };

  /*
   * ---------------------------------------------------------
   * CONTINUE TO PAYMENT
   * ---------------------------------------------------------
   */

  const handleContinue = () => {
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!vehicleId || !userId) {
      setError(
        "Your account or vehicle information is missing."
      );
      return;
    }

    setProcessing(true);

    const checkoutData: CheckoutData = {
      userId,
      vehicleId,

      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),

      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),

      product: productInfo.name,
      amount: STANDARD_QR_PRICE,
      quantity: 1,
    };

    try {
      localStorage.setItem(
        "vehix_checkout_data",
        JSON.stringify(checkoutData)
      );
    } catch (storageError) {
      console.error(
        "Unable to save checkout data:",
        storageError
      );

      setError(
        "Unable to save checkout information. Please try again."
      );

      setProcessing(false);
      return;
    }

    /*
     * Payment page will read the saved checkout information
     * and create the Razorpay order.
     *
     * IMPORTANT:
     * The server should independently enforce ₹499.
     */

    router.push(
      `/qr-store/payment?product=basic&vehicle=${encodeURIComponent(
        vehicleId
      )}`
    );
  };

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />

            <p className="text-sm text-slate-400">
              Preparing your secure checkout...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error && !vehicle) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-red-500/20 bg-[#080d19] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <ShieldCheck className="h-8 w-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Checkout unavailable
            </h1>

            <p className="mt-3 text-slate-400">
              {error}
            </p>

            <button
              onClick={() => router.back()}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN CHECKOUT
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to QR Store
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-10 bg-blue-500" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              Secure Checkout
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Complete your order.
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Your Vehix QR will be connected to your selected
            vehicle after successful payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* Account */}
            <section className="rounded-3xl border border-white/10 bg-[#080d19]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <User className="h-6 w-6 text-blue-400" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Account
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Your details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    These details will be attached to your order.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      placeholder="Your full name"
                      className="h-14 w-full rounded-xl border border-white/10 bg-[#030712] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="h-14 w-full rounded-xl border border-white/10 bg-[#030712] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="h-14 w-full rounded-xl border border-white/10 bg-[#030712] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Vehicle */}
            <section className="rounded-3xl border border-blue-500/30 bg-[#080d19]/90 p-6 shadow-2xl sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Car className="h-6 w-6 text-blue-400" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Selected Vehicle
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    This QR will belong to
                  </h2>
                </div>

                <div className="ml-auto">
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </div>
                </div>
              </div>

              {vehicle && (
                <div className="rounded-2xl border border-white/10 bg-[#030712] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04]">
                      <Car className="h-7 w-7 text-slate-300" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold">
                        {vehicle.nickname ||
                          `${vehicle.brand || ""} ${
                            vehicle.model || ""
                          }`.trim() ||
                          "Your Vehicle"}
                      </h3>

                      <p className="mt-1 font-mono text-sm font-semibold text-blue-400">
                        {vehicle.vehicle_number ||
                          "Vehicle number unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Brand
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-300">
                        {vehicle.brand || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Model
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-300">
                        {vehicle.model || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Year
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-300">
                        {vehicle.year || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Colour
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-300">
                        {vehicle.color || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-5 text-sm text-blue-400">
                    <Check className="h-4 w-4" />
                    <span>
                      QR will be permanently associated with this
                      vehicle after activation.
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Delivery */}
            <section className="rounded-3xl border border-white/10 bg-[#080d19]/90 p-6 shadow-2xl sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Delivery
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Delivery Address
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Where should we deliver your Vehix QR sticker?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Complete Address
                  </label>

                  <div className="relative">
                    <Home className="absolute left-4 top-5 h-4 w-4 text-slate-600" />

                    <textarea
                      value={address}
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      placeholder="Flat / House / Building / Street / Landmark"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#030712] py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* City State PIN */}
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      City
                    </label>

                    <input
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                      placeholder="Mumbai"
                      className="h-14 w-full rounded-xl border border-white/10 bg-[#030712] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      State
                    </label>

                    <input
                      value={state}
                      onChange={(e) =>
                        setState(e.target.value)
                      }
                      placeholder="Maharashtra"
                      className="h-14 w-full rounded-xl border border-white/10 bg-[#030712] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      PIN Code
                    </label>

                    <input
                      value={pincode}
                      onChange={(e) =>
                        setPincode(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="400001"
                      className="h-14 w-full rounded-xl border border-white/10 bg-[#030712] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
            </section>
          </div>

          {/* =================================================
              RIGHT — ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080d19]/95 shadow-2xl">
              {/* Product header */}
              <div className="border-b border-white/10 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
                  Order Summary
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/5">
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: 9 }).map(
                        (_, index) => (
                          <span
                            key={index}
                            className={`h-2 w-2 rounded-[2px] ${
                              index % 2 === 0
                                ? "bg-blue-400"
                                : "bg-white"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {productInfo.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {productInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              {vehicle && (
                <div className="border-b border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Car className="h-5 w-5 text-slate-400" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Vehicle
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-slate-300">
                        {vehicle.vehicle_number}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Product
                  </span>

                  <span className="font-semibold text-slate-300">
                    {productInfo.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Price
                  </span>

                  <span className="font-semibold text-slate-300">
                    ₹{STANDARD_QR_PRICE}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-bold text-emerald-400">
                    FREE
                  </span>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Total
                      </p>

                      <p className="mt-1 text-3xl font-black">
                        ₹{STANDARD_QR_PRICE}
                      </p>
                    </div>

                    <span className="pb-1 text-xs text-slate-600">
                      Final amount
                    </span>
                  </div>
                </div>

                {/* Payment CTA */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleContinue}
                  className="group mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Preparing Secure Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Continue to Secure Payment
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-600">
                  <Lock className="h-3.5 w-3.5" />
                  Secure payment powered by Razorpay
                </div>
              </div>
            </div>

            {/* Trust cards */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#080d19] p-4">
                <Truck className="h-5 w-5 text-blue-400" />

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Delivery
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Doorstep
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#080d19] p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Payment
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Secure
                </p>
              </div>
            </div>

            {/* Account protection */}
            <div className="mt-4 rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

                <div>
                  <p className="text-sm font-semibold text-slate-300">
                    Your Vehix account is protected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Your order will remain connected to your
                    verified Vehix account and selected vehicle.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#020617] text-white">
          <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
              <p className="text-sm text-slate-400">
                Preparing your secure checkout...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
