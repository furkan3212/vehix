"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Car,
  QrCode,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  UserRound,
  Smartphone,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Get Your Vehix QR",
    description:
      "Choose the Vehix QR that fits your style and order it from the QR Store.",
    icon: ShoppingBag,
    label: "Choose your QR",
  },
  {
    number: "02",
    title: "Connect Your Vehicle",
    description:
      "Create your account, add your vehicle and connect your QR to its digital identity.",
    icon: Car,
    label: "Create & connect",
  },
  {
    number: "03",
    title: "Scan. Connect. Manage.",
    description:
      "Place the QR on your vehicle. People can scan it while you manage your vehicle privately.",
    icon: ScanLine,
    label: "Your vehicle goes digital",
  },
];

const ownerFeatures = [
  "Manage your vehicle",
  "Save parking location",
  "Store vehicle documents",
  "Manage contact preferences",
];

const publicFeatures = [
  "View the public vehicle experience",
  "Contact the owner when permitted",
  "Access available vehicle information",
  "Use the QR without needing an account",
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#030712] py-24 text-white sm:py-28 lg:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.05] blur-[170px]" />
        <div className="absolute right-[-180px] bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[170px]" />
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
            <QrCode className="h-3.5 w-3.5" />
            How It Works
          </div>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            From QR sticker
            <span className="block bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent">
              to vehicle identity.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Getting started with Vehix is simple. Connect your vehicle once
            and let your QR become the gateway to its digital identity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Desktop connection line */}
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[46px] hidden h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent lg:block" />

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.04]">
                    {/* Step number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[0.2em] text-slate-600">
                        STEP {step.number}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.1]">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      {step.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs font-medium text-cyan-300/80">
                      <CheckCircle2 className="h-4 w-4" />
                      {step.label}
                    </div>

                    <div className="mt-7 h-px w-0 bg-gradient-to-r from-cyan-400 to-transparent transition-all duration-500 group-hover:w-full" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Owner / Scanner split */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]"
        >
          <div className="grid lg:grid-cols-2">
            {/* Owner side */}
            <div className="border-b border-white/[0.07] p-7 sm:p-9 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.06] text-blue-300">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
                    For the owner
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-white">
                    Your private Vehix experience
                  </h3>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {ownerFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-300" />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public side */}
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                  <ScanLine className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    For the scanner
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-white">
                    A simple public experience
                  </h3>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {publicFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual flow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-cyan-400/[0.025] px-6 py-10 sm:px-10 lg:px-14 lg:py-12"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/[0.05] blur-[100px]" />

          <div className="relative flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-5">
            {/* QR */}
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05]">
                <QrCode className="h-11 w-11 text-cyan-300" strokeWidth={1.5} />
              </div>

              <span className="mt-4 text-sm font-medium text-slate-300">
                Vehix QR
              </span>
            </div>

            {/* Arrow */}
            <ArrowRight className="hidden h-5 w-5 text-cyan-400/50 sm:block" />
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent sm:hidden" />

            {/* Vehicle */}
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.05]">
                <Car className="h-11 w-11 text-blue-300" strokeWidth={1.5} />
              </div>

              <span className="mt-4 text-sm font-medium text-slate-300">
                Your Vehicle
              </span>
            </div>

            {/* Arrow */}
            <ArrowRight className="hidden h-5 w-5 text-cyan-400/50 sm:block" />
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent sm:hidden" />

            {/* Identity */}
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/[0.05]">
                <Smartphone
                  className="h-11 w-11 text-purple-300"
                  strokeWidth={1.5}
                />
              </div>

              <span className="mt-4 text-sm font-medium text-slate-300">
                Digital Identity
              </span>
            </div>
          </div>

          <p className="relative mx-auto mt-8 max-w-xl text-center text-sm leading-6 text-slate-500">
            One simple connection between your physical vehicle and its
            digital identity.
          </p>
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
            Get Your Vehix QR
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}