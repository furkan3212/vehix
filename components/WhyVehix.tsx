"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Car,
  LockKeyhole,
  Smartphone,
  Sparkles,
} from "lucide-react";

const ordinaryQrPoints = [
  "Simply opens a link",
  "No dedicated vehicle identity",
  "No vehicle management",
  "No private document space",
  "Limited owner interaction",
];

const vehixPoints = [
  "A digital identity built around your vehicle",
  "Connected vehicle management",
  "Controlled owner contact",
  "Private document storage",
  "Smart parking and vehicle tools",
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Built Around Your Vehicle",
    description:
      "Vehix is designed around the vehicle itself — not just the QR code attached to it.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy Comes First",
    description:
      "Useful information can be shared without unnecessarily exposing private owner details.",
  },
  {
    icon: Smartphone,
    title: "Simple From Every Side",
    description:
      "Owners get a connected dashboard while people scanning the QR get a simple experience.",
  },
];

export default function WhyVehix() {
  return (
    <section
      id="why-vehix"
      className="relative overflow-hidden bg-[#020817] py-24 text-white sm:py-28 lg:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[160px]" />
        <div className="absolute right-[-180px] bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[170px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Why Vehix
          </div>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A QR sticker is
            <span className="block bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent">
              just the beginning.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Vehix turns a simple QR code into a connected digital identity
            designed around your vehicle and the people who interact with it.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="mt-16 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Ordinary QR */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-9"
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/[0.025] blur-3xl" />

            <div className="relative">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    The usual way
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-slate-300 sm:text-3xl">
                    Ordinary QR
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <X className="h-5 w-5 text-slate-500" />
                </div>
              </div>

              <div className="space-y-4">
                {ordinaryQrPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3.5"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />

                    <span className="text-sm leading-6 text-slate-500">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-white/[0.06] pt-6">
                <p className="text-sm leading-6 text-slate-600">
                  A QR code can open a page. But a vehicle deserves more than
                  a page.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vehix */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.07] via-white/[0.025] to-blue-500/[0.05] p-7 shadow-2xl shadow-cyan-950/20 sm:p-9"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-400/[0.07] blur-[80px]" />

            <div className="relative">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
                    The Vehix way
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    Vehix Identity
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08]">
                  <Check className="h-5 w-5 text-cyan-300" />
                </div>
              </div>

              <div className="space-y-4">
                {vehixPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-xl border border-cyan-400/[0.08] bg-black/20 px-4 py-3.5"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-300/15">
                      <Check className="h-3 w-3 text-cyan-300" />
                    </div>

                    <span className="text-sm leading-6 text-slate-300">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-cyan-400/[0.08] pt-6">
                <p className="text-sm leading-6 text-slate-400">
                  One identity connects your vehicle, your account and the
                  people who need to interact with it.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Three pillars */}
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/15 hover:bg-white/[0.035]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300 transition-colors group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.08]">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Main statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-blue-500/[0.06] via-cyan-400/[0.04] to-transparent px-7 py-10 sm:px-10 lg:px-14 lg:py-12"
        >
          <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-400/[0.05] blur-[100px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Car className="h-4 w-4" />
                More than a sticker
              </div>

              <h3 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Turn your vehicle into a{" "}
                <span className="text-cyan-300">connected identity.</span>
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Start with one Vehix QR and unlock an experience designed to
                grow with your vehicle.
              </p>
            </div>

            <Link
              href="/qr-store"
              className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              Get Your Vehix QR
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}