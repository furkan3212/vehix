"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  QrCode,
  MapPin,
  PhoneCall,
  FileText,
  CheckCircle2,
  Car,
  LockKeyhole,
  Smartphone,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#030712] pt-32 text-white"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 h-[600px] w-[600px] rounded-full bg-blue-600/[0.13] blur-[160px]" />

        <div className="absolute right-[-180px] top-[10%] h-[620px] w-[620px] rounded-full bg-cyan-500/[0.09] blur-[180px]" />

        <div className="absolute bottom-[-220px] left-[35%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.07] blur-[160px]" />
      </div>

      {/* Subtle technical grid */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Top radial highlight */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-[100px]" />

      {/* =========================================================
          MAIN HERO
      ========================================================= */}

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-16 px-6 pb-24 sm:px-8 lg:min-h-[calc(100vh-128px)] lg:flex-row lg:gap-12 lg:px-12 xl:px-16">
        {/* =======================================================
            LEFT CONTENT
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-3xl flex-1 lg:pt-6"
        >
          {/* Eyebrow */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 backdrop-blur-xl"
          >
            <span className="flex h-2 w-2">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-blue-400" />
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65 sm:text-xs">
              Smart Vehicle Identity Network
            </span>
          </motion.div>

          {/* Main Heading */}

          <h1 className="mt-8 max-w-4xl text-[3.25rem] font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl xl:text-[5.8rem]">
            Your vehicle.
            <br />

            <span className="bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-transparent">
              More than
            </span>

            <br />

            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-white bg-clip-text text-transparent">
              a number plate.
            </span>
          </h1>

          {/* Description */}

          <p className="mt-8 max-w-2xl text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
            Vehix gives your vehicle a secure digital identity — helping
            people connect with you, access essential vehicle information,
            find saved parking locations, and keep important documents
            organized in one place.
          </p>

          {/* CTA */}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/qr-store"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 text-sm font-bold text-[#030712] shadow-[0_12px_45px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_18px_55px_rgba(255,255,255,0.13)]"
            >
              Get Your Vehix QR

              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="#how-it-works"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.025] px-7 text-sm font-semibold text-white/75 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              See How It Works

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Trust Points */}

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            <TrustPoint icon={<CheckCircle2 size={15} />}>
              Easy setup
            </TrustPoint>

            <TrustPoint icon={<ShieldCheck size={15} />}>
              Privacy focused
            </TrustPoint>

            <TrustPoint icon={<LockKeyhole size={15} />}>
              Secure by design
            </TrustPoint>
          </div>

          {/* =====================================================
              MINI PRODUCT STRIP
          ===================================================== */}

          <div className="mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <MiniFeature
              icon={<PhoneCall size={17} />}
              title="Connect"
              description="Reach the owner"
            />

            <MiniFeature
              icon={<MapPin size={17} />}
              title="Locate"
              description="Save your parking"
            />

            <MiniFeature
              icon={<FileText size={17} />}
              title="Organize"
              description="Keep documents"
            />
          </div>
        </motion.div>

        {/* =======================================================
            RIGHT PRODUCT VISUAL
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, x: 45, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="relative flex w-full flex-1 items-center justify-center lg:max-w-[650px]"
        >
          {/* Product glow */}

          <div className="absolute h-[430px] w-[430px] rounded-full bg-blue-600/[0.13] blur-[120px]" />

          <div className="absolute h-[240px] w-[240px] rounded-full bg-cyan-400/[0.08] blur-[90px]" />

          {/* =====================================================
              MAIN VEHIX IDENTITY CARD
          ===================================================== */}

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full max-w-[500px]"
          >
            {/* Card outer glow */}

            <div className="absolute -inset-[1px] rounded-[38px] bg-gradient-to-br from-white/[0.18] via-white/[0.04] to-blue-500/[0.15] opacity-80" />

            {/* Main Card */}

            <div className="relative overflow-hidden rounded-[38px] border border-white/[0.1] bg-[#0a101c]/90 p-5 shadow-[0_35px_100px_rgba(0,0,0,0.55)] backdrop-blur-3xl sm:p-7">
              {/* Card light */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/[0.08] blur-[70px]" />

              {/* Header */}

              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                      <Car size={15} className="text-white/80" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      VEHIX IDENTITY
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Your Vehicle
                  </h2>
                </div>

                {/* Verified badge */}

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

              {/* QR Identity Area */}

              <div className="relative mt-7 flex items-center gap-5 rounded-[28px] border border-white/[0.07] bg-black/20 p-5 sm:gap-7 sm:p-6">
                {/* QR visual */}

                <div className="relative shrink-0 rounded-2xl bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.3)] sm:p-4">
                  <QrVisual />

                  {/* Scan pulse */}

                  <motion.div
                    animate={{ top: ["8%", "88%", "8%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-[10%] right-[10%] h-[2px] rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                  />
                </div>

                {/* Identity details */}

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                    Digital Vehicle Identity
                  </p>

                  <h3 className="mt-2 truncate text-lg font-bold text-white sm:text-xl">
                    Connected & Protected
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/40 sm:text-sm">
                    One QR. One identity. Everything connected.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-emerald-300">
                    <ShieldCheck size={14} />
                    Privacy-first connection
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}

              <div className="relative mt-4 grid grid-cols-2 gap-3">
                <IdentityTile
                  icon={<PhoneCall size={16} />}
                  label="Contact"
                  value="Available"
                />

                <IdentityTile
                  icon={<MapPin size={16} />}
                  label="Parking"
                  value="Saved"
                />

                <IdentityTile
                  icon={<FileText size={16} />}
                  label="Documents"
                  value="Organized"
                />

                <IdentityTile
                  icon={<Smartphone size={16} />}
                  label="Access"
                  value="Instant"
                />
              </div>

              {/* Bottom identity bar */}

              <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                  <span className="text-[10px] font-medium text-white/40">
                    VEHIX SMART VEHICLE ID
                  </span>
                </div>

                <span className="text-[9px] font-bold tracking-[0.15em] text-white/20">
                  VEHIX™
                </span>
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              FLOATING SECURITY CARD
          ===================================================== */}

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-3 top-10 hidden rounded-2xl border border-white/[0.09] bg-[#0a101c]/90 p-4 shadow-2xl backdrop-blur-2xl xl:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.08]">
                <ShieldCheck
                  size={20}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                  Security
                </p>

                <p className="mt-1 text-xs font-bold text-white/80">
                  Privacy First
                </p>
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              FLOATING QR CARD
          ===================================================== */}

          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-3 bottom-16 hidden rounded-2xl border border-white/[0.09] bg-[#0a101c]/90 p-4 shadow-2xl backdrop-blur-2xl xl:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/[0.08]">
                <QrCode size={20} className="text-blue-300" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                  One Scan
                </p>

                <p className="mt-1 text-xs font-bold text-white/80">
                  Instant Connection
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* =========================================================
          BOTTOM PRODUCT STATEMENT
      ========================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 sm:px-8 lg:px-12 xl:px-16"
      >
        <div className="border-t border-white/[0.07] pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-white/30 sm:text-sm">
              Built to make vehicle ownership more connected, organized,
              and easier to manage.
            </p>

            <Link
              href="#how-it-works"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white"
            >
              Explore Vehix

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 hidden justify-center pb-8 lg:flex"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
            }}
            className="h-1.5 w-1.5 rounded-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* =============================================================
   SMALL COMPONENTS
============================================================= */

function TrustPoint({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-white/40">
      <span className="text-emerald-400">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function MiniFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-white/75">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}

function IdentityTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/45">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[0.12em] text-white/25">
          {label}
        </p>

        <p className="mt-1 text-xs font-semibold text-white/70">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =============================================================
   QR VISUAL
   Decorative only — NOT intended to be scanned.
============================================================= */

function QrVisual() {
  const cells = [
    "1111111001011111111",
    "1000001010011000001",
    "1011101011111011101",
    "1011101001001011101",
    "1011101110101011101",
    "1000001001111000001",
    "1111111010101111111",
    "0000000011010000000",
    "1101011110011011011",
    "0011100101110100110",
    "1110011110101111001",
    "0101110011010010111",
    "1011001110111101000",
    "0000001011000101110",
    "1111111010111010011",
    "1000001111001011100",
    "1011101010111110011",
    "1011101101010010110",
    "1011101001111101011",
    "1000001110010011000",
    "1111111011011101011",
  ];

  return (
    <div className="grid grid-cols-[repeat(21,4px)] gap-[2px] sm:grid-cols-[repeat(21,5px)] sm:gap-[2px]">
      {cells.map((row, rowIndex) =>
        row.split("").map((cell, cellIndex) => (
          <span
            key={`${rowIndex}-${cellIndex}`}
            className={`h-1 w-1 sm:h-[5px] sm:w-[5px] ${
              cell === "1" ? "bg-black" : "bg-white"
            }`}
          />
        ))
      )}
    </div>
  );
}