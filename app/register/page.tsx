"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  CarFront,
  Sparkles,
} from "lucide-react";

import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [acceptedLegal, setAcceptedLegal] = useState(false);

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedLegal) {
      setError(
        "Please accept the Terms & Conditions and Privacy Policy to create your account."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser(
        email.trim(),
        password,
        fullName.trim()
      );

      if (!result.success) {
        setError(result.error || "Registration failed.");
        return;
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  /* PASSWORD STRENGTH */
  const getPasswordStrength = () => {
    if (!password) {
      return {
        score: 0,
        label: "",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        score: 1,
        label: "Weak",
      };
    }

    if (score <= 3) {
      return {
        score: 2,
        label: "Good",
      };
    }

    return {
      score: 3,
      label: "Strong",
    };
  };

  const passwordStrength = getPasswordStrength();

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
          href="/login"
          className="hidden items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:flex"
        >
          Already have an account?
          <span className="text-blue-400">
            Sign in
          </span>
          <ArrowRight size={16} />
        </Link>

      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-7xl items-center justify-center px-6 py-10">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT PANEL */}
          <div className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-blue-600/[0.08] via-transparent to-cyan-500/[0.04] p-12 lg:flex lg:flex-col lg:justify-between">

            {/* Decorative rings */}
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-blue-500/10" />

            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-cyan-500/10" />

            <div className="relative">

              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                <Sparkles size={15} />
                Welcome to VEHIX
              </div>

              <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight xl:text-5xl">
                Give your vehicle
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  a digital identity.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
                Create your VEHIX account and bring your
                vehicle, documents, QR identity and essential
                information together in one secure place.
              </p>

            </div>

            {/* BENEFITS */}
            <div className="relative mt-12 space-y-4">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <CarFront
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Manage your vehicles
                  </p>

                  <p className="text-xs text-zinc-500">
                    Keep your vehicle information organized
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                  <ShieldCheck
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Secure digital identity
                  </p>

                  <p className="text-xs text-zinc-500">
                    Your vehicle data stays protected
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Built for your vehicle
                  </p>

                  <p className="text-xs text-zinc-500">
                    Everything connected in one place
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

          {/* RIGHT REGISTER PANEL */}
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
            <div className="mb-7">

              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <UserRound
                  size={19}
                  className="text-blue-400"
                />
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Start building your vehicle identity with VEHIX.
              </p>

            </div>
                        {/* FORM */}
            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
                >
                  Full name
                </label>

                <div className="relative">

                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading}
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:bg-blue-500/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:bg-blue-500/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:bg-blue-500/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/5 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                {/* PASSWORD STRENGTH */}
                {password && (
                  <div className="mt-3">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-[11px] text-zinc-600">
                        Password strength
                      </span>

                      <span
                        className={`text-[11px] font-semibold ${
                          passwordStrength.score === 1
                            ? "text-red-400"
                            : passwordStrength.score === 2
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>

                    </div>

                    <div className="flex gap-1.5">

                      {[1, 2, 3].map(
                        (level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              passwordStrength.score >=
                              level
                                ? level === 1
                                  ? "bg-red-500"
                                  : level === 2
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                : "bg-white/10"
                            }`}
                          />
                        )
                      )}

                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-zinc-600">
                      Use at least 6 characters.
                      A stronger password includes
                      uppercase letters, numbers and
                      symbols.
                    </p>

                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
                >
                  Confirm password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:bg-blue-500/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/5 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                {/* MATCH INDICATOR */}
                {confirmPassword && (
                  <div className="mt-2">

                    {password ===
                    confirmPassword ? (
                      <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                        <CheckCircle2 size={14} />
                        Passwords match
                      </div>
                    ) : (
                      <div className="text-[11px] text-red-400">
                        Passwords do not match
                      </div>
                    )}

                  </div>
                )}
              </div>
                            {/* LEGAL CONSENT */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={acceptedLegal}
                    onChange={(e) =>
                      setAcceptedLegal(
                        e.target.checked
                      )
                    }
                    disabled={loading}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-black/30 accent-blue-600 disabled:cursor-not-allowed"
                  />

                  <span className="text-[12px] leading-5 text-zinc-400">

                    I agree to the{" "}

                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-400 transition hover:text-cyan-400"
                    >
                      Terms & Conditions
                    </Link>

                    {" "}and acknowledge the{" "}

                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-400 transition hover:text-cyan-400"
                    >
                      Privacy Policy
                    </Link>

                    .

                  </span>

                </label>

              </div>

              {/* SECURITY INFO */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.035] px-4 py-3">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/10">

                  <ShieldCheck
                    size={16}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold text-zinc-300">
                    Your information is protected
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                    We use reasonable security measures
                    to help protect your account and
                    vehicle information.
                  </p>

                </div>

              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">

                  <p className="text-sm leading-6 text-red-400">
                    {error}
                  </p>

                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <p className="text-sm leading-6 text-emerald-400">
                      {success}
                    </p>

                  </div>

                </div>
              )}

              {/* CREATE ACCOUNT BUTTON */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !acceptedLegal
                }
                className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:scale-[1.01] hover:bg-blue-500 hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >

                {/* Button shine */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

              {/* MOBILE LOGIN */}
              <div className="pt-2 text-center sm:hidden">

                <p className="text-sm text-zinc-600">
                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-semibold text-blue-400 hover:text-cyan-400"
                  >
                    Sign in
                  </Link>
                </p>

              </div>

            </form>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="relative z-10 pb-8 text-center">

        <p className="text-[11px] text-zinc-700">
          © {new Date().getFullYear()} VEHIX. Smart Vehicle Identity.
        </p>

      </div>

    </main>
  );
}