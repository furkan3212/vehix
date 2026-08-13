"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();

  const orderId =
    typeof params.id === "string"
      ? params.id
      : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
      <div className="w-full max-w-2xl">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2
              size={42}
              className="text-green-400"
            />
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            Vehix Order
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Order Created
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-zinc-500">
            Your Vehix order has been created
            successfully. Payment has not been
            processed yet.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
              <Package size={17} />

              Order ID
            </div>

            <p className="mt-3 break-all font-mono text-sm text-white">
              {orderId}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-left">
            <p className="font-bold text-amber-300">
              Payment is the next step
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              We're currently connecting the
              payment gateway. Your QR inventory
              has NOT been marked as sold.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/#qr-store"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold transition hover:bg-white/[0.08]"
            >
              Back to Store
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 font-bold"
            >
              Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-700">
            <ShieldCheck size={14} />
            Vehix secure order system
          </div>
        </div>
      </div>
    </main>
  );
}