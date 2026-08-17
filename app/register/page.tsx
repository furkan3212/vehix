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
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
        setError(
          result.error || "Registration failed."
        );
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

            {/* REGISTER FORM */}
            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* FULL NAME */}
              <div>

                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-zinc-200"
                >
                  Full name
                </label>

                <div className="group relative">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-blue-400"
                  />

                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    className="h-13 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

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
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="h-13 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-4 focus:ring-blue-500/10"
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

                  {password && (
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength.score === 1
                          ? "text-red-400"
                          : passwordStrength.score === 2
                            ? "text-yellow-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  )}

                </div>

                <div className="group relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-blue-400"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="h-13 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-12 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-4 focus:ring-blue-500/10"
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

                {/* PASSWORD STRENGTH */}
                {password && (
                  <div className="mt-3">

                    <div className="flex gap-1.5">

                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength.score >= level
                              ? passwordStrength.score === 1
                                ? "bg-red-500"
                                : passwordStrength.score === 2
                                  ? "bg-yellow-500"
                                  : "bg-emerald-500"
                              : "bg-white/10"
                          }`}
                        />
                      ))}

                    </div>

                    <p className="mt-2 text-[11px] text-zinc-600">
                      Use 6+ characters. A longer password
                      with numbers and symbols is stronger.
                    </p>

                  </div>
                )}

              </div>

              {/* CONFIRM PASSWORD */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-zinc-200"
                >
                  Confirm password
                </label>

                <div className="group relative">

                  <LockKeyhole
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${
                      confirmPassword &&
                      password === confirmPassword
                        ? "text-emerald-400"
                        : "text-zinc-600"
                    }`}
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className={`h-13 w-full rounded-2xl border bg-black/30 pl-12 pr-12 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-700 focus:ring-4 ${
                      confirmPassword &&
                      password === confirmPassword
                        ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/10"
                        : "border-white/10 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-blue-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                {/* MATCH INDICATOR */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs">

                    {password === confirmPassword ? (
                      <>
                        <CheckCircle2
                          size={13}
                          className="text-emerald-400"
                        />

                        <span className="text-emerald-400">
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <span className="text-red-400">
                        Passwords do not match
                      </span>
                    )}

                  </div>
                )}

              </div>

              {/* SECURITY INFO */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.035] px-4 py-3">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <p className="text-[11px] leading-5 text-zinc-500">
                  Your account is protected with secure
                  authentication. Keep your password private
                  and never share it with anyone.
                </p>

              </div>

              {/* ERROR */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 text-sm text-red-400">

                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <p>{error}</p>

                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5 text-sm text-emerald-400">

                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{success}</p>

                </div>
              )}

              {/* CREATE ACCOUNT */}
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

                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account

                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

              {/* LOGIN */}
              <div className="border-t border-white/10 pt-5 text-center">

                <p className="text-sm text-zinc-500">
                  Already have a VEHIX account?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition hover:text-cyan-400"
                >
                  Sign in to VEHIX
                  <ArrowRight size={16} />
                </Link>

              </div>

            </form>

            {/* FOOTER NOTE */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-zinc-600">

              <ShieldCheck size={14} />

              Secure VEHIX account registration

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}