"use client";

import { motion } from "framer-motion";
import {
  QrCode,
  ShieldCheck,
  MapPin,
  PhoneCall,
  FileText,
  Zap,
  LockKeyhole,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    icon: QrCode,
    title: "One QR Identity",
    description:
      "Give your vehicle a dedicated digital identity that can be accessed through its Vehix QR.",
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Easy Contact",
    description:
      "Let someone who finds your vehicle reach the right contact without exposing more information than necessary.",
  },
  {
    number: "03",
    icon: MapPin,
    title: "Smart Parking",
    description:
      "Save where you parked and quickly return to your vehicle when you need it.",
  },
  {
    number: "04",
    icon: FileText,
    title: "Vehicle Documents",
    description:
      "Keep important vehicle documents organized and accessible from your Vehix dashboard.",
  },
];

export default function Stats() {
  return (
    <section
      id="product"
      className="relative overflow-hidden bg-[#030712] py-28 text-white sm:py-36"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-[10%] h-[420px] w-[420px] rounded-full bg-blue-600/[0.07] blur-[150px]" />

        <div className="absolute right-[-160px] bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[160px]" />
      </div>

      {/* Technical grid */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* =======================================================
            INTRO
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                The Vehix Platform
              </span>
            </div>

            <h2 className="mt-7 max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Everything your
              <br />
              vehicle needs.
            </h2>
          </div>

          <div className="lg:pb-1 lg:pl-12">
            <p className="max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
              Vehix brings the most useful parts of vehicle ownership into
              one connected identity — designed to stay simple for owners
              and useful when it matters.
            </p>
          </div>
        </motion.div>

        {/* =======================================================
            MAIN CAPABILITY GRID
        ======================================================= */}

        <div className="mt-16 grid gap-px overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
          {capabilities.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="group relative min-h-[270px] overflow-hidden bg-[#070d18] p-7 transition-all duration-500 hover:bg-[#0a1220] sm:p-9 lg:p-11"
              >
                {/* Hover glow */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/[0.07] opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />

                {/* Number */}

                <div className="absolute right-8 top-8 text-[11px] font-bold tracking-[0.2em] text-white/15">
                  {item.number}
                </div>

                {/* Icon */}

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-white/60 transition-all duration-500 group-hover:border-blue-400/20 group-hover:bg-blue-400/[0.08] group-hover:text-blue-300">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                {/* Content */}

                <div className="relative mt-8 max-w-md">
                  <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/38 sm:text-[15px] sm:leading-7">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent */}

                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>

        {/* =======================================================
            SECURITY / IDENTITY STRIP
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-5 overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025]"
        >
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left */}

            <div className="relative overflow-hidden p-7 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-[100px]" />

              <div className="relative flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06]">
                  <ShieldCheck
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
                    Privacy First
                  </p>

                  <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                    Your identity stays in your control.
                  </h3>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
                    Vehix is designed around controlled vehicle-owner
                    connections. Share what is useful when someone needs
                    to reach you, without turning your QR into a public
                    display of personal information.
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}

            <div className="grid grid-cols-2 border-t border-white/[0.07] lg:border-l lg:border-t-0">
              <SecurityItem
                icon={<LockKeyhole size={18} />}
                title="Private"
                description="Controlled access"
              />

              <SecurityItem
                icon={<Zap size={18} />}
                title="Instant"
                description="QR powered"
              />

              <SecurityItem
  icon={<QrCode size={18} />}
  title="Identity"
  description="Vehicle focused"
/>

             <SecurityItem
  icon={<PhoneCall size={18} />}
  title="Connected"
  description="One platform"
/>
            </div>
          </div>
        </motion.div>

        {/* =======================================================
            BOTTOM CTA
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-sm font-medium text-white/30">
              One vehicle. One identity. One connected experience.
            </p>
          </div>

          <Link
            href="/qr-store"
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-xs font-bold text-white/65 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Explore Vehix QR

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* =============================================================
   SECURITY ITEM
============================================================= */

function SecurityItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[145px] flex-col justify-center border-b border-white/[0.06] p-6 transition-colors duration-300 hover:bg-white/[0.025] sm:p-7">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/45">
        {icon}
      </div>

      <p className="mt-4 text-sm font-bold text-white/70">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-white/30">
        {description}
      </p>
    </div>
  );
}

/* =============================================================
   SMALL ICON
============================================================= */

 