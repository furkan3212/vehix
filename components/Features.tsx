"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Car,
  MapPin,
  Phone,
  BellRing,
  FileText,
  ShieldCheck,
  LockKeyhole,
  Globe2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Car,
    title: "Digital Vehicle Identity",
    description:
      "Give your vehicle a connected digital identity that stays linked to its profile.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Smart Parking",
    description:
      "Save where you parked and quickly find your vehicle when you need it.",
  },
  {
    number: "03",
    icon: Phone,
    title: "Contact Owner",
    description:
      "Let someone reach the vehicle owner through a controlled contact experience.",
  },
  {
    number: "04",
    icon: BellRing,
    title: "Smart Alerts",
    description:
      "Keep important vehicle-related reminders and alerts organized in one place.",
  },
  {
    number: "05",
    icon: FileText,
    title: "Vehicle Documents",
    description:
      "Keep your important vehicle documents organized and accessible from your account.",
  },
  {
    number: "06",
    icon: ShieldCheck,
    title: "Emergency Ready",
    description:
      "Keep essential vehicle and emergency information available when it matters.",
  },
  {
    number: "07",
    icon: LockKeyhole,
    title: "Privacy First",
    description:
      "Share useful information without unnecessarily exposing your personal details.",
  },
  {
    number: "08",
    icon: Globe2,
    title: "Works Anywhere",
    description:
      "Your Vehix identity travels with your vehicle wherever it goes.",
  },
];

const futureFeatures = [
  "Service & maintenance history",
  "Theft assistance",
  "Vehicle ownership transfer",
  "QR scan activity",
  "Vehicle notifications",
  "Vehix Vehicle Passport",
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#030712] py-24 sm:py-28 lg:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Vehix Features
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            One QR.
            <span className="block bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent">
              More than just a scan.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Vehix connects your vehicle to a smarter digital experience —
            helping you identify, manage, locate and protect what matters.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.06,
                }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.045]">
                  {/* Number */}
                  <div className="absolute right-5 top-5 text-[11px] font-semibold tracking-[0.2em] text-slate-700 transition-colors duration-300 group-hover:text-cyan-400/40">
                    {feature.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.1]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-7 h-px w-0 bg-gradient-to-r from-cyan-400 to-transparent transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] via-white/[0.02] to-cyan-400/[0.025]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.08),transparent_35%)]" />

          <div className="relative grid items-center gap-12 px-7 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-14">
            {/* Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Built around your vehicle
              </div>

              <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A small QR.
                <span className="block text-slate-400">
                  A much bigger experience.
                </span>
              </h3>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Your Vehix QR is the starting point. Behind it is a digital
                vehicle profile designed to make everyday vehicle ownership
                simpler, smarter and more connected.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "Digital identity",
                  "Controlled contact",
                  "Smart vehicle management",
                  "Privacy focused",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative mx-auto flex h-48 w-48 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-400/10" />
              <div className="absolute inset-5 rounded-full border border-cyan-400/10" />
              <div className="absolute inset-10 rounded-2xl border border-cyan-400/20 bg-[#07111f] shadow-2xl shadow-cyan-500/10">
                <div className="grid h-full grid-cols-5 gap-1 p-5">
                  {Array.from({ length: 25 }).map((_, index) => {
                    const active =
                      [
                        0, 1, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 21,
                        22, 23,
                      ].includes(index);

                    return (
                      <span
                        key={index}
                        className={`rounded-[2px] ${
                          active ? "bg-cyan-300/80" : "bg-white/[0.06]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="absolute -right-2 top-6 rounded-lg border border-white/10 bg-[#0b1220]/90 px-3 py-2 text-[10px] font-medium text-slate-400 backdrop-blur-xl">
                VEHIX ID
              </div>

              <div className="absolute -bottom-1 -left-3 rounded-lg border border-white/10 bg-[#0b1220]/90 px-3 py-2 text-[10px] font-medium text-cyan-300 backdrop-blur-xl">
                CONNECTED
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coming soon teaser */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-4xl text-center"
        >
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            And we're just getting started
          </div>

          <h3 className="text-2xl font-semibold text-white sm:text-3xl">
            More intelligence is coming to Vehix.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            We're building more ways to help you manage the complete lifecycle
            of your vehicle.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {futureFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs text-slate-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <Link
            href="/qr-store"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-50 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            Explore Vehix QR
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}