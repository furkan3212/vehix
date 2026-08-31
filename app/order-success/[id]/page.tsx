import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Package,
} from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderSuccessPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#030712] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">

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
            <ShieldCheck size={15} />
            Secure Order
          </div>

        </div>
      </header>

      {/* SUCCESS CONTENT */}

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center justify-center px-6 py-16">

        <div className="w-full text-center">

          {/* SUCCESS ICON */}

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle2
              size={54}
              className="text-emerald-400"
            />
          </div>

          {/* TITLE */}

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
            Payment Successful
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            Order Confirmed
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 md:text-lg">
            Your Vehix QR order has been successfully
            placed. We&apos;ll prepare your QR identity
            product and deliver it to your selected address.
          </p>

          {/* ORDER CARD */}

          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/[0.035] p-7 text-left">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Package size={22} />
              </div>

              <div className="min-w-0">

                <p className="text-sm text-zinc-500">
                  Vehix Order ID
                </p>

                <p className="mt-1 break-all font-bold text-white">
                  {id}
                </p>

              </div>

            </div>

            <div className="mt-6 border-t border-white/10 pt-6">

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  Product
                </span>

                <span className="font-semibold">
                  Standard QR
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  Amount Paid
                </span>

                <span className="text-xl font-black text-blue-400">
                  ₹499
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  Delivery
                </span>

                <span className="font-semibold text-emerald-400">
                  FREE
                </span>
              </div>

            </div>

          </div>

          {/* STATUS */}

          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] px-5 py-4 text-left">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <p className="text-sm font-bold">
                  Your order is connected to your Vehix account
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Your QR will remain associated with the
                  vehicle selected during checkout.
                </p>
              </div>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-black shadow-xl shadow-blue-600/20 transition hover:scale-[1.02]"
            >
              Back to Vehix
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/#qr-store"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-4 font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              Visit QR Store
            </Link>

          </div>

          {/* FOOTER */}

          <div className="mt-12 flex items-center justify-center gap-2 text-xs text-zinc-700">
            <ShieldCheck size={13} />

            <span>
              Vehix Smart Vehicle Identity
            </span>
          </div>

        </div>

      </div>

    </main>
  );
}