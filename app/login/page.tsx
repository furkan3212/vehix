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
  CarFront,
  Sparkles,
  Zap,
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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(email.trim(), password);

      if (!result.success) {
        setError(result.error || "Login failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-blue-600/[0.10] blur-[160px]" />

        <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.08] blur-[160px]" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[150px]" />
      </div>

      {/* =========================================================
          TECH GRID
      ========================================================= */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* =========================================================
          TOP NAV
      ========================================================= */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">

        {/* LOGO */}
        <Link
          href="/"
          className="group transition duration-300 hover:opacity-90"
        >
          <img
            src="/logo/vehix-logo.svg"
            alt="VEHIX - Smart Vehicle Identity"
            className="h-auto w-[165px] object-contain sm:w-[180px]"
          />
        </Link>

        {/* BACK */}
        <Link
          href="/"
          className="hidden items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:flex"
        >
          Back to VEHIX
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-7xl items-center justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#050b18]/80 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">

          {/* =====================================================
              LEFT — VEHIX AUTOMOTIVE EXPERIENCE
          ===================================================== */}
          <div className="relative hidden min-h-[760px] overflow-hidden border-r border-white/10 lg:flex lg:flex-col">
            {/* =================================================
    CINEMATIC VEHIX CAR BACKGROUND
================================================= */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* CAR IMAGE */}
  <img
    src="/images/vehix-login-car.png"
    alt=""
    aria-hidden="true"
    className="absolute bottom-[-4%] right-[-42%] h-auto w-[170%] max-w-none object-contain opacity-[0.62]"
  />

  {/* DARK LEFT MASK
      Keeps the text readable while allowing
      the car to remain clearly visible. */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#050b18] via-[#050b18]/75 via-[42%] to-transparent" />

  {/* TOP FADE */}
  <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#050b18] via-[#050b18]/80 to-transparent" />

  {/* BOTTOM FADE */}
  <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#050b18] via-[#050b18]/65 to-transparent" />

  {/* RIGHT EDGE FADE */}
  <div className="absolute inset-y-0 right-0 w-[28%] bg-gradient-to-l from-[#050b18]/35 to-transparent" />

  {/* BLUE AUTOMOTIVE GLOW */}
  <div className="absolute bottom-[3%] right-[5%] h-[220px] w-[420px] rounded-full bg-blue-500/[0.10] blur-[100px]" />

  {/* FLOOR LIGHT */}
  <div className="absolute bottom-[-5%] right-[12%] h-[80px] w-[480px] rounded-[50%] bg-cyan-400/[0.07] blur-[55px]" />

</div>

            {/* =================================================
                DECORATIVE RINGS
            ================================================= */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-blue-500/[0.10]" />

            <div className="pointer-events-none absolute -right-16 -top-16 h-[360px] w-[360px] rounded-full border border-cyan-500/[0.08]" />

            <div className="pointer-events-none absolute right-[12%] top-[18%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.9)]" />

            {/* =================================================
                LEFT CONTENT
            ================================================= */}
            <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">

              <div>

                {/* BADGE */}
                <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-400 backdrop-blur-md">
                  <CarFront size={14} />
                  Welcome to Vehix
                </div>

                {/* HEADING */}
                <h1 className="max-w-xl text-5xl font-black leading-[1.03] tracking-[-0.04em] xl:text-[58px]">
                  Your vehicle.
                  <br />

                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Your identity.
                  </span>
                </h1>

                {/* DESCRIPTION */}
                <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-zinc-400">
                  Sign in to manage your vehicles, QR identities,
                  documents, parking locations and everything that
                  makes your vehicle uniquely yours.
                </p>

                {/* =================================================
                    FEATURE POINTS
                ================================================= */}
                <div className="mt-10 space-y-4">

                  {/* FEATURE 1 */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-md">
                      <ShieldCheck
                        size={19}
                        className="text-blue-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Secure & Private
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        Your vehicle data stays protected.
                      </p>
                    </div>
                  </div>

                  {/* FEATURE 2 */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-md">
                      <CarFront
                        size={19}
                        className="text-cyan-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Everything in One Place
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        Vehicles, documents, QR and more.
                      </p>
                    </div>
                  </div>

                  {/* FEATURE 3 */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 backdrop-blur-md">
                      <Zap
                        size={19}
                        className="text-violet-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Built for Real Life
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        Simple, smart and connected.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* =================================================
                  BOTTOM BRAND LINE
              ================================================= */}
              <div className="relative z-10 mt-12 border-t border-white/10 pt-6">

                <div className="flex items-center justify-between">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
                    Vehix · Smart Vehicle Identity
                  </p>

                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Connected
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT — LOGIN PANEL
          ===================================================== */}
          <div className="relative flex flex-col justify-center bg-[#060b17]/80 p-7 sm:p-10 lg:p-12">

            {/* MOBILE LOGO */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/">
                <img
                  src="/logo/vehix-logo.svg"
                  alt="VEHIX"
                  className="h-auto w-[175px] object-contain"
                />
              </Link>
            </div>

            {/* MOBILE TOP LINK */}
            <div className="mb-8 flex justify-end lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-white"
              >
                Back to VEHIX
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* =================================================
                HEADER
            ================================================= */}
            <div className="mb-8">

              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <LockKeyhole
                  size={19}
                  className="text-blue-400"
                />
              </div>

              <h2 className="text-3xl font-black tracking-[-0.025em] text-white sm:text-[34px]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Sign in to continue to your VEHIX dashboard.
              </p>
            </div>

            {/* =================================================
                LOGIN FORM
            ================================================= */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-semibold text-zinc-200"
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
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-white/15 focus:border-blue-500/60 focus:bg-blue-500/[0.035] focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div>

                <div className="mb-2.5 flex items-center justify-between">

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
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-white/15 focus:border-blue-500/60 focus:bg-blue-500/[0.035] focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
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

              {/* OPTIONS */}
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
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>{error}</p>
                </div>
              )}

              {/* =================================================
                  SIGN IN BUTTON
              ================================================= */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-bold text-white shadow-[0_12px_35px_rgba(37,99,235,0.20)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgba(37,99,235,0.30)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >

                {/* SHINE */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />

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

              {/* =================================================
                  ACCOUNT DIVIDER
              ================================================= */}
              <div className="relative py-2">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-[#060b17] px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
                    VEHIX Account
                  </span>
                </div>

              </div>

              {/* =================================================
                  REGISTER
              ================================================= */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center transition hover:border-white/15 hover:bg-white/[0.035]">

                <p className="text-sm text-zinc-500">
                  Don't have a VEHIX account?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition hover:text-cyan-400"
                >
                  Create your account

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

              </div>

            </form>

            {/* =================================================
                SECURITY
            ================================================= */}
            <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-zinc-600">
              <ShieldCheck size={14} />
              Your account information is protected by secure authentication.
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE FOOTER
      ========================================================= */}
      <div className="relative z-10 pb-6 text-center lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-700">
          Vehix · Smart Vehicle Identity
        </p>
      </div>

    </main>
  );
}