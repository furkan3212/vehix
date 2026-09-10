"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const highlights = [
  {
    icon: QrCode,
    title: "One QR. One identity.",
    description:
      "Give your vehicle a simple digital identity that stays connected to it.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by design.",
    description:
      "You decide what information is available through your vehicle's public experience.",
  },
  {
    icon: Car,
    title: "Built around your vehicle.",
    description:
      "From vehicle details to documents, parking and contacts, Vehix brings useful tools together.",
  },
];

const experiences = [
  {
    number: "01",
    title: "For Vehicle Owners",
    description:
      "Manage the important parts of your vehicle from one place while keeping control of your information.",
    items: [
      "Digital vehicle identity",
      "Vehicle management",
      "Parking location",
      "Vehicle documents",
    ],
  },
  {
    number: "02",
    title: "For People Who Scan",
    description:
      "A simple QR scan can open the appropriate public vehicle experience without exposing unnecessary information.",
    items: [
      "Vehicle information",
      "Owner contact when permitted",
      "Useful vehicle actions",
      "No account required to scan",
    ],
  },
];

export default function Testimonials() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#030712] py-24 text-white sm:py-28 lg:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/[0.045] blur-[160px]" />

        <div className="absolute right-[-180px] bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.045] blur-[160px]" />

        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-400/[0.025] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            The Vehix Experience
          </div>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            More than a QR.
            <span className="block bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent">
              It becomes your vehicle's identity.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Vehix is designed to make the connection between a physical
            vehicle and its digital identity simple, useful and controlled by
            the owner.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/15 hover:bg-white/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.1]">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Owner / Public Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-16 overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.02]"
        >
          <div className="grid lg:grid-cols-2">
            {experiences.map((experience, index) => (
              <div
                key={experience.number}
                className={`p-7 sm:p-9 lg:p-10 ${
                  index === 0
                    ? "border-b border-white/[0.07] lg:border-b-0 lg:border-r"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-600">
                      {experience.number}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      {experience.title}
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                    {index === 0 ? (
                      <UserRound
                        className="h-5 w-5 text-blue-300"
                        strokeWidth={1.7}
                      />
                    ) : (
                      <QrCode
                        className="h-5 w-5 text-cyan-300"
                        strokeWidth={1.7}
                      />
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {experience.description}
                </p>

                <div className="mt-7 space-y-3">
                  {experience.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />

                      <span className="text-sm text-slate-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative mt-16 overflow-hidden rounded-[32px] border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.06] via-white/[0.025] to-blue-500/[0.04] px-7 py-12 text-center sm:px-12 sm:py-14"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 rounded-full bg-cyan-400/[0.05] blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
              <QrCode className="h-6 w-6" strokeWidth={1.6} />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              The idea behind Vehix
            </p>

            <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your vehicle should be
              <span className="block text-slate-400">
                more than a registration number.
              </span>
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Vehix brings identity, useful vehicle information and smart
              interactions together through one simple QR.
            </p>

            <Link
              href="/qr-store"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              Get Your Vehix QR

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-700">
            Vehix™ · Smart Vehicle Identity
          </p>
        </motion.div>
      </div>
    </section>
  );
}