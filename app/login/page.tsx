"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Headphones,
} from "lucide-react";

import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(
        email.trim(),
        password
      );

      if (!result.success) {
        setError(result.error || "Login failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* BACKGROUND GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* TOP BRAND */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">

        <Link
          href="/"
          className="transition duration-300 hover:opacity-80"
        >
          <img
            src="/logo/vehix-logo.svg"
            alt="VEHIX - Smart Vehicle Identity"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <Link
          href="/"
          className="hidden items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:flex"
        >
          Back to VEHIX
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-7xl items-center justify-center px-6 py-10">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT PANEL */}
          <div className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-blue-600/[0.08] via-transparent to-cyan-500/[0.04] p-12 lg:flex lg:flex-col lg:justify-between">

            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-500/10" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-cyan-500/10" />

            <div className="relative">

              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                <ShieldCheck size={15} />
                Secure Vehicle Network
              </div>

              <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight xl:text-5xl">
                Your vehicle.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Your identity.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
                Sign in to manage your vehicles, QR identities,
                documents, parking locations and secure vehicle
                connections from one place.
              </p>
            </div>

            {/* FEATURE LIST */}
            <div className="relative mt-12 space-y-4">

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Secure account access
                  </p>

                  <p className="text-xs text-zinc-500">
                    Your vehicle data stays protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <ShieldCheck
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Digital vehicle identity
                  </p>

                  <p className="text-xs text-zinc-500">
                    Everything connected to your vehicle
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                  <Headphones
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    VEHIX support
                  </p>

                  <p className="text-xs text-zinc-500">
                    We're here when you need us
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-12 border-t border-white/10 pt-6">
              <p className="text-xs text-zinc-600">
                VEHIX · Smart Vehicle Identity
              </p>
            </div>
          </div>

          {/* RIGHT LOGIN PANEL */}
          <div className="p-7 sm:p-10 lg:p-12">

            {/* MOBILE LOGO */}
            <div className="mb-8 flex justify-center lg:hidden">
              <img
                src="/logo/vehix-logo.svg"
                alt="VEHIX"
                className="h-14 w-auto object-contain"
              />
            </div>

            {/* HEADING */}
            <div className="mb-8">

              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <LockKeyhole
                  size={19}
                  className="text-blue-400"
                />
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Sign in to continue to your VEHIX dashboard.
              </p>
            </div>

            {/* LOGIN FORM */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-zinc-200"
                >
                  Email address
                </label>

                <div className="group relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-blue-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-zinc-200"
                  >
                    Password
                  </label>

                  <Link
                    href="/contact"
                    className="text-xs font-medium text-blue-400 transition hover:text-cyan-400"
                  >
                    Need help?
                  </Link>
                </div>

                <div className="group relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-blue-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-12 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-white/20 bg-black/40 accent-blue-600"
                  />

                  <span className="text-xs text-zinc-500">
                    Keep me signed in
                  </span>
                </label>

                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <ShieldCheck size={14} />
                  Secure login
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 text-sm text-red-400">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>{error}</p>
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:scale-[1.01] hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              {/* DIVIDER */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-[#07101f] px-4 text-xs text-zinc-600">
                    VEHIX ACCOUNT
                  </span>
                </div>
              </div>

              {/* REGISTER */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center">

                <p className="text-sm text-zinc-500">
                  Don't have a VEHIX account?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition hover:text-cyan-400"
                >
                  Create your account
                  <ArrowRight size={16} />
                </Link>
              </div>

            </form>

            {/* SECURITY NOTE */}
            <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-zinc-600">
              <ShieldCheck size={14} />
              Your account information is protected by secure authentication.
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}