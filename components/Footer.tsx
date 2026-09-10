import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative mt-24 overflow-hidden border-t border-white/10 bg-[#020617]"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        {/* CTA */}
        <div className="mb-16 flex flex-col gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Smart Vehicle Identity
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Give your vehicle an identity beyond its number plate.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Connect your vehicle to a smarter digital identity with Vehix™.
            </p>
          </div>

          <Link
            href="/qr-store"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Get Your Vehix QR

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Footer columns */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <span className="text-lg font-black italic text-blue-400">
                  V
                </span>
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                vehix<span className="text-blue-400">™</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A smart digital identity for your vehicle — helping owners
              connect, organize and manage what matters.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Smart Vehicle Identity
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-white">
              Explore
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href="/#features"
                  className="transition-colors hover:text-white"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="/#how-it-works"
                  className="transition-colors hover:text-white"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="/#about"
                  className="transition-colors hover:text-white"
                >
                  About Vehix
                </a>
              </li>

              <li>
                <Link
                  href="/qr-store"
                  className="transition-colors hover:text-white"
                >
                  QR Store
                </Link>
              </li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-white">
              Account
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/qr-store"
                  className="transition-colors hover:text-white"
                >
                  Get Started
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-white">
              Contact
            </h3>

            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <a
                  href="mailto:support@vehix.co.in"
                  className="group inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                    <Mail className="h-4 w-4" />
                  </span>

                  support@vehix.co.in
                </a>
              </li>
            </ul>

            {/* Social placeholders */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                in
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Vehix™. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>

            <a
              href="mailto:privacy@vehix.co.in"
              className="transition-colors hover:text-white"
            >
              Privacy / Grievance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}