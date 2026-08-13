"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  QrCode,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type QRData = {
  id: string;
  qr_code: string;
  status: string;
  product_name: string | null;
  design_name: string | null;
  assigned_user_id: string | null;
  vehicle_id: string | null;
};

export default function ActivateQRPage() {
  const params = useParams();
  const router = useRouter();

  const code =
    typeof params.code === "string"
      ? params.code
      : Array.isArray(params.code)
        ? params.code[0]
        : "";

  const [qr, setQr] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadQR = async () => {
      if (!code) {
        setErrorMessage("Invalid QR code.");
        setLoading(false);
        return;
      }

      try {
        // Check current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        // Find QR
        const { data, error } = await supabase
          .from("qr_inventory")
          .select(
            "id, qr_code, status, product_name, design_name, assigned_user_id, vehicle_id"
          )
          .eq("qr_code", code)
          .maybeSingle();

        if (error) {
          console.error("QR lookup error:", error);
          setErrorMessage("Unable to verify this Vehix QR code.");
          setLoading(false);
          return;
        }

        if (!data) {
          setErrorMessage("This Vehix QR code does not exist.");
          setLoading(false);
          return;
        }

        setQr(data);
        setLoading(false);
      } catch (error) {
        console.error("Activation page error:", error);
        setErrorMessage("Something went wrong while checking this QR.");
        setLoading(false);
      }
    };

    loadQR();
  }, [code]);

  const handleActivation = () => {
    if (!qr) return;

    // Customer must be logged in before activation.
    if (!user) {
      router.push(`/login?redirect=/activate/${qr.qr_code}`);
      return;
    }

    // Only SOLD QR codes can be activated.
    if (qr.status !== "sold") {
      return;
    }

    router.push(`/activate/${qr.qr_code}/vehicle`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="text-center">
          <Loader2
            size={46}
            className="mx-auto mb-5 animate-spin text-blue-400"
          />

          <p className="text-sm text-zinc-400">
            Verifying your Vehix QR...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertCircle
              size={34}
              className="text-red-400"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-3xl font-black">
            QR Verification Failed
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            {errorMessage}
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-zinc-500">
              QR CODE
            </p>

            <p className="mt-1 break-all font-mono text-sm font-bold text-white">
              {code || "Unknown"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!qr) {
    return null;
  }

  /*
   * AVAILABLE
   *
   * This QR belongs to Vehix inventory but has NOT been sold.
   * Customers must never be able to activate these.
   */
  if (qr.status === "available") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <QrCode
              size={34}
              className="text-blue-400"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Official Vehix QR
          </p>

          <h1 className="mt-3 text-3xl font-black">
            QR Not Sold Yet
          </h1>

          <p className="mt-4 leading-6 text-zinc-400">
            This is an authentic Vehix QR code, but it has not
            been sold or assigned to a customer yet.
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-zinc-500">
              QR CODE
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-white">
              {qr.qr_code}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-400">
            <ShieldCheck size={17} />
            Authentic Vehix QR
          </div>
        </div>
      </main>
    );
  }

  /*
   * ACTIVATED
   *
   * This QR is already linked to a customer/vehicle.
   * It cannot be activated again.
   */
  if (qr.status === "activated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle2
              size={34}
              className="text-emerald-400"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Vehix Verified
          </p>

          <h1 className="mt-3 text-3xl font-black">
            QR Already Activated
          </h1>

          <p className="mt-4 leading-6 text-zinc-400">
            This Vehix QR code has already been activated and
            linked to a vehicle.
          </p>

          <div className="mt-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <ShieldCheck size={18} />

              <span className="font-semibold">
                Protected Vehix Identity
              </span>
            </div>
          </div>

          <p className="mt-5 text-xs text-zinc-600">
            This QR cannot be claimed by another customer.
          </p>
        </div>
      </main>
    );
  }

  /*
   * SOLD
   *
   * This is the ONLY state that allows customer activation.
   */
  if (qr.status === "sold") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-3xl border border-blue-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <ShieldCheck
              size={34}
              className="text-blue-400"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Activate Your Vehix QR
          </h1>

          <p className="mt-4 leading-6 text-zinc-400">
            Your official Vehix QR is ready. Activate it now
            and connect it to your vehicle.
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                QR Code
              </span>

              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase text-purple-400">
                Sold
              </span>
            </div>

            <p className="mt-3 font-mono text-sm font-bold text-white">
              {qr.qr_code}
            </p>
          </div>

          {qr.product_name && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs text-zinc-500">
                PRODUCT
              </p>

              <p className="mt-1 font-semibold text-white">
                {qr.product_name}
              </p>
            </div>
          )}

          <button
            onClick={handleActivation}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            {user
              ? "Continue Activation"
              : "Login & Activate QR"}

            <ArrowRight size={18} />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck size={15} />
            Official Vehix QR
          </div>
        </div>
      </main>
    );
  }

  /*
   * Unknown status protection
   */
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-yellow-500/20 bg-white/[0.04] p-8 text-center">
        <AlertCircle
          size={44}
          className="mx-auto mb-5 text-yellow-400"
        />

        <h1 className="text-2xl font-black">
          QR Temporarily Unavailable
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          This QR code has an unsupported status. Please
          contact Vehix support.
        </p>
      </div>
    </main>
  );
}