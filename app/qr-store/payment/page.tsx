"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
  Loader2,
  AlertCircle,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

/* =========================================================
   RAZORPAY TYPES
   ========================================================= */

declare global {
  interface Window {
    Razorpay: new (
      options: RazorpayOptions
    ) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;

  theme?: {
    color?: string;
  };

  modal?: {
    ondismiss?: () => void;
  };

  handler: (response: RazorpayResponse) => void;
};

type RazorpayInstance = {
  open: () => void;
  close: () => void;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

/* =========================================================
   PRODUCT
   ========================================================= */

const PRODUCT_PRICE = 499;

const productInfo = {
  name: "Standard QR",
  description: "Vehix Smart Vehicle Identity QR sticker.",
};

/* =========================================================
   RAZORPAY SCRIPT
   ========================================================= */

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(true);
      });

      existingScript.addEventListener("error", () => {
        resolve(false);
      });

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/* =========================================================
   PAGE
   ========================================================= */

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =======================================================
     URL DATA
     ======================================================= */

  const productId =
    searchParams.get("product") || "basic";

  const vehicleId =
    searchParams.get("vehicle");

  /*
   * Standard Vehix QR is always ₹499.
   */
  const total = PRODUCT_PRICE;

  const quantity = 1;

  /* =======================================================
     CUSTOMER DETAILS
     ======================================================= */

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  /* =======================================================
     DELIVERY DETAILS
     ======================================================= */

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("Mumbai");

  const [state, setState] =
    useState("Maharashtra");

  const [pincode, setPincode] =
    useState("400001");

  /* =======================================================
     AUTH
     ======================================================= */

  const [userLoading, setUserLoading] =
    useState(true);

  const [userId, setUserId] =
    useState<string | null>(null);

  /* =======================================================
     PAYMENT STATE
     ======================================================= */

  const [loading, setLoading] =
    useState(false);

  const [paymentProcessing, setPaymentProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =======================================================
     PRODUCT DISPLAY
     ======================================================= */

  const displayProduct = useMemo(() => {
    return {
      id: productId,
      name: productInfo.name,
      price: PRODUCT_PRICE,
    };
  }, [productId]);

  /* =======================================================
     LOAD USER
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        setUserLoading(true);
        setError("");

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (authError) {
          console.error(
            "Supabase auth error:",
            authError
          );

          setUserId(null);
          return;
        }

        if (!user) {
          setUserId(null);
          return;
        }

        setUserId(user.id);

        /* EMAIL */

        if (user.email) {
          setEmail((current) => {
            if (current.trim()) {
              return current;
            }

            return user.email || "";
          });
        }

        /* NAME */

        const metadata =
          user.user_metadata || {};

        const metadataName =
          metadata.full_name ||
          metadata.name ||
          "";

        if (metadataName) {
          setFullName((current) => {
            if (current.trim()) {
              return current;
            }

            return String(metadataName);
          });
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );

        if (mounted) {
          setUserId(null);
        }
      } finally {
        if (mounted) {
          setUserLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOAD RAZORPAY
     ======================================================= */

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  /* =======================================================
     VALIDATE FORM
     ======================================================= */

  function validateForm(): boolean {
    setError("");

    if (userLoading) {
      setError(
        "Please wait while we verify your account."
      );

      return false;
    }

    if (!userId) {
      const currentPath =
        window.location.pathname +
        window.location.search;

      router.replace(
        `/login?redirect=${encodeURIComponent(
          currentPath
        )}`
      );

      return false;
    }

    if (!vehicleId) {
      setError(
        "No vehicle was selected for this QR order."
      );

      return false;
    }

    if (!fullName.trim()) {
      setError(
        "Please enter your full name."
      );

      return false;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );

      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return false;
    }

    const cleanPhone =
      phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return false;
    }

    if (!address.trim()) {
      setError(
        "Please enter your delivery address."
      );

      return false;
    }

    if (!city.trim()) {
      setError(
        "Please enter your city."
      );

      return false;
    }

    if (!state.trim()) {
      setError(
        "Please enter your state."
      );

      return false;
    }

    const cleanPincode =
      pincode.replace(/\D/g, "");

    if (cleanPincode.length !== 6) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );

      return false;
    }

    return true;
  }

  /* =======================================================
     START PAYMENT
     ======================================================= */

  async function handlePayment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      /* -----------------------------------------------
         VERIFY USER AGAIN
         ----------------------------------------------- */

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "Authentication error:",
          authError
        );

        throw new Error(
          "Unable to verify your login session."
        );
      }

      if (!user) {
        const currentPath =
          window.location.pathname +
          window.location.search;

        router.replace(
          `/login?redirect=${encodeURIComponent(
            currentPath
          )}`
        );

        return;
      }

      setUserId(user.id);

      /* -----------------------------------------------
         VERIFY VEHICLE
         ----------------------------------------------- */

      if (!vehicleId) {
        throw new Error(
          "No vehicle was selected."
        );
      }

      /* -----------------------------------------------
         LOAD RAZORPAY
         ----------------------------------------------- */

      const razorpayLoaded =
        await loadRazorpayScript();

      if (
        !razorpayLoaded ||
        !window.Razorpay
      ) {
        throw new Error(
          "Unable to load the secure payment system. Please check your internet connection and try again."
        );
      }

      /* -----------------------------------------------
         CREATE RAZORPAY ORDER
         ----------------------------------------------- */

      /*
       * IMPORTANT:
       *
       * The previous version only sent:
       *
       * amount
       * receipt
       *
       * Your API also requires:
       *
       * user_id
       * vehicle_id
       * product
       *
       * We now send the complete order information.
       */

      const createOrderResponse =
        await fetch(
          "/api/razorpay/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              /*
               * Authenticated Vehix user
               */
              user_id: user.id,

              /*
               * Selected vehicle
               */
              vehicle_id: vehicleId,

              /*
               * Current QR product.
               *
               * The QR Store uses "basic" as
               * the Standard QR product identifier.
               */
              product: productId,

              /*
               * Standard QR configuration
               */
              shape: "Shield",
              color: "Black",
              finish: "Matte",

              /*
               * Quantity
               */
              quantity,

              /*
               * Customer
               */
              customer: {
                full_name:
                  fullName.trim(),

                email:
                  email.trim(),

                phone:
                  phone
                    .replace(/\D/g, "")
                    .trim(),
              },

              /*
               * Delivery
               */
              delivery: {
                address:
                  address.trim(),

                city:
                  city.trim(),

                state:
                  state.trim(),

                pincode:
                  pincode
                    .replace(/\D/g, "")
                    .trim(),
              },

              /*
               * Standard QR price.
               *
               * The backend remains responsible
               * for validating the actual amount.
               */
              amount: total,

              receipt:
                `vehix_${Date.now()}`,
            }),
          }
        );

      let createOrderData: any;

      try {
        createOrderData =
          await createOrderResponse.json();
      } catch {
        throw new Error(
          "Invalid response received while creating payment order."
        );
      }

      if (
        !createOrderResponse.ok ||
        !createOrderData?.success
      ) {
        throw new Error(
          createOrderData?.error ||
            "Unable to create payment order."
        );
      }

      /* -----------------------------------------------
         READ RAZORPAY ORDER
         ----------------------------------------------- */

     const razorpayOrderId =
  createOrderData.razorpay_order_id;

const razorpayAmount =
  Number(createOrderData.amount);

const razorpayCurrency =
  createOrderData.currency || "INR";

const razorpayKey =
  createOrderData.key;

if (!razorpayOrderId) {
  throw new Error(
    "Razorpay order ID was not returned by the server."
  );
}

if (!razorpayAmount) {
  throw new Error(
    "Razorpay payment amount was not returned by the server."
  );
}

if (!razorpayKey) {
  throw new Error(
    "Razorpay key was not returned by the server."
  );
}
      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay order ID was not returned."
        );
      }

      if (!razorpayAmount) {
        throw new Error(
          "Razorpay payment amount was not returned."
        );
      }

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key was not returned by the server."
        );
      }

      /* -----------------------------------------------
         AMOUNT SAFETY CHECK
         ----------------------------------------------- */

      /*
       * Standard QR must always be ₹499.
       *
       * ₹499 × 100 = 49900 paise.
       */

      if (razorpayAmount !== total * 100) {
        console.error(
          "Unexpected Razorpay amount:",
          {
            expected:
              total * 100,

            received:
              razorpayAmount,
          }
        );

        throw new Error(
          `Payment amount mismatch. Expected ₹${total}.`
        );
      }

      /* -----------------------------------------------
         RAZORPAY OPTIONS
         ----------------------------------------------- */

      const options: RazorpayOptions = {
        key: razorpayKey,

        amount:
          razorpayAmount,

        currency:
          razorpayCurrency,

        name:
          "VEHIX",

        description:
          "Vehix Standard QR",

        order_id:
          razorpayOrderId,

        prefill: {
          name:
            fullName.trim(),

          email:
            email.trim(),

          contact:
            phone
              .replace(/\D/g, "")
              .trim(),
        },

        notes: {
          source:
            "vehix_qr_store",

          user_id:
            user.id,

          vehicle_id:
            vehicleId,

          product:
            productId,
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentProcessing(false);
          },
        },

        handler:
          async (
            response: RazorpayResponse
          ) => {
            await verifyPayment(
              response,
              razorpayOrderId
            );
          },
      };

      /* -----------------------------------------------
         OPEN RAZORPAY
         ----------------------------------------------- */

      const razorpay =
        new window.Razorpay(options);

      setLoading(false);
      setPaymentProcessing(true);

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      setLoading(false);
      setPaymentProcessing(false);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );
    }
  }

  /* =======================================================
     VERIFY PAYMENT
     ======================================================= */

  async function verifyPayment(
    response: RazorpayResponse,
    razorpayOrderId: string
  ) {
    try {
      setPaymentProcessing(true);
      setError("");

      /* -----------------------------------------------
         VERIFY USER
         ----------------------------------------------- */

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "Verification auth error:",
          authError
        );

        throw new Error(
          "Unable to verify your login session."
        );
      }

      if (!user) {
        throw new Error(
          "Your login session has expired. Please log in again."
        );
      }

      if (!vehicleId) {
        throw new Error(
          "No vehicle was selected."
        );
      }

      /* -----------------------------------------------
         VERIFY PAYMENT ON BACKEND
         ----------------------------------------------- */

      /* -----------------------------------------------
         GET CURRENT SUPABASE SESSION
         ----------------------------------------------- */

      const {
        data: {
          session,
        },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !session?.access_token
      ) {
        console.error(
          "Payment verification session error:",
          sessionError
        );

        throw new Error(
          "Your login session has expired. Please log in again."
        );
      }

      /* -----------------------------------------------
         VERIFY PAYMENT ON BACKEND
         ----------------------------------------------- */

      const verifyResponse =
        await fetch(
          "/api/razorpay/verify-payment",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_order_id:
                razorpayOrderId,

              razorpay_signature:
                response.razorpay_signature,

              user_id:
                user.id,

              vehicle_id:
                vehicleId,

              full_name:
                fullName.trim(),

              email:
                email.trim(),

              phone:
                phone
                  .replace(/\D/g, "")
                  .trim(),

              address:
                address.trim(),

              city:
                city.trim(),

              state:
                state.trim(),

              pincode:
                pincode
                  .replace(/\D/g, "")
                  .trim(),

              product:
                "basic",

              amount:
                total,
            }),
          }
        );

      let verifyData: any;

      try {
        verifyData =
          await verifyResponse.json();
      } catch {
        throw new Error(
          "Invalid response received while verifying payment."
        );
      }

      /* -----------------------------------------------
         VERIFY RESPONSE
         ----------------------------------------------- */

      if (
        !verifyResponse.ok ||
        !verifyData?.success
      ) {
        throw new Error(
          verifyData?.error ||
            "Payment verification failed."
        );
      }

      /* -----------------------------------------------
         FIND VEHIX ORDER ID
         ----------------------------------------------- */

      const orderId =
        verifyData?.order_id ||
        verifyData?.order?.id ||
        verifyData?.result?.order_id ||
        verifyData?.result?.id ||
        verifyData?.result?.order?.id;

      if (!orderId) {
        console.error(
          "Payment verification response:",
          verifyData
        );

        throw new Error(
          "Payment was successful, but the Vehix order ID was not returned."
        );
      }

      /* -----------------------------------------------
         SUCCESS
         ----------------------------------------------- */

      setSuccessMessage(
        "Payment successful! Your Vehix order has been confirmed."
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      );

      router.replace(
        `/order-success/${orderId}`
      );
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setPaymentProcessing(false);

      setError(
        error instanceof Error
          ? error.message
          : "We could not verify your payment."
      );
    }
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#030712] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
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
          </Link>

          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
            <Lock size={15} />
            Secure Payment
          </div>

        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">

        {/* BACK */}

        <Link
          href="/#qr-store"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to QR Store
        </Link>

        {/* TITLE */}

        <div className="mt-8">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            Vehix Store
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Complete Your Payment
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-500">
            Enter your delivery information and securely complete your Vehix QR order.
          </p>

        </div>

        {/* MAIN GRID */}

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}

          <form
            onSubmit={handlePayment}
            className="space-y-7"
          >

            {/* CUSTOMER */}

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
                    These details will be used for your order.
                  </p>
                </div>

              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {/* NAME */}

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
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* EMAIL */}

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
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* PHONE */}

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
                          event.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* DELIVERY */}

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
                    Where should we deliver your Vehix QR?
                  </p>
                </div>

              </div>

              <div className="mt-7 space-y-5">

                {/* ADDRESS */}

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
                    placeholder="House / Flat / Building / Street / Landmark"
                    autoComplete="street-address"
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* CITY STATE PIN */}

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
                      autoComplete="address-level2"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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
                      autoComplete="address-level1"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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
                      autoComplete="postal-code"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* ERROR */}

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">

                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* SUCCESS */}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">

                <Check
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  {successMessage}
                </p>

              </div>
            )}

            {/* PAY BUTTON */}

            <button
              type="submit"
              disabled={
                loading ||
                paymentProcessing ||
                userLoading
              }
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-black shadow-xl shadow-blue-600/20 transition hover:scale-[1.01] hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >

              {loading ||
              paymentProcessing ? (
                <>
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />

                  {paymentProcessing
                    ? "Verifying Payment..."
                    : "Preparing Payment..."}
                </>
              ) : userLoading ? (
                <>
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />

                  Checking Account...
                </>
              ) : (
                <>
                  <CreditCard size={21} />

                  Pay Securely • ₹{total}
                </>
              )}

            </button>

            {/* TRUST */}

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-zinc-600">

              <span className="flex items-center gap-2">
                <Lock size={14} />
                Secure checkout
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck size={14} />
                Razorpay secured
              </span>

              <span className="flex items-center gap-2">
                <Check size={14} />
                Verified payment
              </span>

            </div>

          </form>

          {/* RIGHT — ORDER SUMMARY */}

          <aside className="lg:sticky lg:top-8 lg:self-start">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">

              {/* HEADER */}

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

                {/* PRODUCT */}

                <div className="flex items-center gap-4">

                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-black">

                    <div className="h-16 w-16 rounded-xl border-4 border-white p-1">

                      <div className="flex h-full w-full items-center justify-center bg-black">

                        <div className="grid grid-cols-4 gap-[2px]">

                          {Array.from({
                            length: 16,
                          }).map(
                            (_, index) => (
                              <div
                                key={index}
                                className={`h-2 w-2 ${
                                  index % 3 === 0 ||
                                  index % 5 === 0
                                    ? "bg-white"
                                    : "bg-transparent"
                                }`}
                              />
                            )
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold">
                      {displayProduct.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Vehix QR Identity
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Qty {quantity}
                    </p>

                  </div>

                </div>

                {/* PRICE */}

                <div className="mt-7 space-y-4 border-t border-white/10 pt-6">

                  <div className="flex justify-between text-sm">

                    <span className="text-zinc-500">
                      Product
                    </span>

                    <span>
                      ₹499
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-zinc-500">
                      Delivery
                    </span>

                    <span className="font-semibold text-emerald-400">
                      FREE
                    </span>

                  </div>

                  {/* TOTAL */}

                  <div className="border-t border-white/10 pt-5">

                    <div className="flex items-end justify-between">

                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-3xl font-black text-blue-400">
                        ₹499
                      </span>

                    </div>

                  </div>

                </div>

                {/* DELIVERY */}

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-4">

                  <div className="flex items-start gap-3">

                    <Truck
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-400"
                    />

                    <div>

                      <p className="text-sm font-bold">
                        Vehix Delivery
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        Your Vehix QR product will be prepared after successful payment and delivered to your selected address.
                      </p>

                    </div>

                  </div>

                </div>

                {/* SECURITY */}

                <div className="mt-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4">

                  <div className="flex items-start gap-3">

                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <div>

                      <p className="text-sm font-bold">
                        Secure Payment
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        Payment is processed securely through Razorpay. Your card, UPI or banking information is never stored by Vehix.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* FOOTER */}

        <div className="mt-12 flex items-center justify-center gap-2 text-center text-xs text-zinc-700">

          <Lock size={13} />

          <span>
            Secure payment powered by Razorpay • Vehix Smart Vehicle Identity
          </span>

        </div>

      </div>

    </main>
  );
}