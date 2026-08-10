"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  UserPlus,
  Car,
  QrCode,
  Sticker,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in less than a minute with secure authentication and email verification.",
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  {
    number: "02",
    title: "Register Your Vehicle",
    description:
      "Add your bike, car or any vehicle and securely store its digital identity.",
    icon: Car,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
  },
  {
    number: "03",
    title: "Generate QR Identity",
    description:
      "Generate your unique Vehix QR and download it instantly for printing.",
    icon: QrCode,
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  {
    number: "04",
    title: "Apply The QR Sticker",
    description:
      "Place the QR sticker anywhere on your vehicle for quick public access.",
    icon: Sticker,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
  },
  {
    number: "05",
    title: "Stay Protected",
    description:
      "Anyone can contact you safely while your privacy and vehicle identity remain protected.",
    icon: ShieldCheck,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#030712] py-32 text-white"
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[170px]" />

        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[190px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-4xl text-center"
        >

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-blue-400">

            HOW IT WORKS

          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight md:text-7xl">

            Protect Your Vehicle

            <br />

            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

              In Five Simple Steps

            </span>

          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-400">

            Getting started with Vehix takes less than two minutes.
            Register your vehicle, generate your secure QR identity
            and stay connected whenever someone scans it.

          </p>

        </motion.div>

        {/* Timeline */}

        <div className="relative mt-24">

          {/* Desktop Line */}

          <div className="absolute left-0 right-0 top-14 hidden h-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 lg:block" />

          <div className="grid gap-10 lg:grid-cols-5">

            {steps.map((step, index) => {

              const Icon = step.icon;

              return (

                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="relative text-center"
                >

                  {/* Number Circle */}

                  <div
                    className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 ${step.bg} backdrop-blur-xl`}
                  >

                    <Icon
                      size={42}
                      className={step.color}
                    />

                  </div>

                  <div className="mt-8">

                    <span className="text-sm font-bold tracking-[0.35em] text-blue-400">

                      STEP {step.number}

                    </span>

                    <h3 className="mt-4 text-2xl font-black">

                      {step.title}

                    </h3>

                    <p className="mt-5 leading-8 text-zinc-400">

                      {step.description}

                    </p>

                  </div>

                </motion.div>

              );

            })}

          </div>
                  </div>

        {/* Bottom CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mt-28 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 p-10 backdrop-blur-3xl"
        >

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-blue-400">

                READY TO BEGIN?

              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">

                Your Vehicle

                <br />

                Is Just One Scan

                <br />

                Away From

                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

                  {" "}Smart Protection

                </span>

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">

                Create your account today, register your vehicle,
                generate your QR identity and become part of
                India's next-generation vehicle identity network.

              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-5 text-lg font-bold shadow-2xl shadow-blue-600/30 transition hover:scale-105"
                >

                  Get Started

                  <ArrowRight
                    size={20}
                    className="transition group-hover:translate-x-1"
                  />

                </Link>

                <Link
                  href="#store"
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-lg font-semibold transition hover:border-blue-500/30 hover:bg-white/10"
                >

                  Explore QR Store

                </Link>

              </div>

            </div>

            {/* Right */}

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="mx-auto w-full max-w-md rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl"
            >

              <div className="text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">

                  <QrCode
                    size={40}
                    className="text-blue-400"
                  />

                </div>

                <h3 className="mt-6 text-3xl font-black">

                  VEHIX QR

                </h3>

                <p className="mt-3 text-zinc-400">

                  Secure • Verified • Smart

                </p>

              </div>

              <div className="mt-8 rounded-[28px] bg-white p-8">

                <QrCode
                  size={220}
                  className="mx-auto text-black"
                />

              </div>

              <div className="mt-8 space-y-4">

                <div className="flex items-center justify-between rounded-2xl bg-black/30 p-4">

                  <span>Emergency Contact</span>

                  <span className="font-bold text-green-400">

                    Active

                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl bg-black/30 p-4">

                  <span>Vehicle Status</span>

                  <span className="font-bold text-blue-400">

                    Verified

                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl bg-black/30 p-4">

                  <span>Privacy</span>

                  <span className="font-bold text-green-400">

                    Protected

                  </span>

                </div>

              </div>

            </motion.div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}