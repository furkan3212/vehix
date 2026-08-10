"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Shield,
  Car,
  MapPin,
  PhoneCall,
  FileCheck,
} from "lucide-react";

export default function WhyVehix() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#020817] py-32 text-white"
    >

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute left-0 top-20 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[170px]" />

        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[190px]" />

      </div>

      <div className="relative mx-auto max-w-[1450px] px-6">

        <div className="grid items-start gap-20 lg:grid-cols-2">

          {/* LEFT SIDE */}

          <motion.div
            initial={{
              opacity: 0,
              x: -60,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-blue-400">

              WHY VEHIX

            </span>

            <h2 className="mt-8 text-5xl font-black leading-tight md:text-7xl">

              Your Vehicle

              <br />

              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

                Deserves More

              </span>

              <br />

              Than Just

              <br />

              A QR Sticker.

            </h2>

            <p className="mt-6 max-w-lg text-xl leading-9 text-zinc-400">

              Vehix is not simply a QR code.

              It is a complete digital identity platform designed
              to protect your vehicle, connect people instantly,
              safeguard your documents and simplify ownership.

            </p>

            <div className="mt-12 space-y-5">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-blue-500/20 p-3">

                  <Shield
                    size={24}
                    className="text-blue-400"
                  />

                </div>

                <p className="text-lg">

                  Privacy-first vehicle identity

                </p>

              </div>

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-green-500/20 p-3">

                  <MapPin
                    size={24}
                    className="text-green-400"
                  />

                </div>

                <p className="text-lg">

                  Smart parking with saved locations

                </p>

              </div>

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-cyan-500/20 p-3">

                  <PhoneCall
                    size={24}
                    className="text-cyan-400"
                  />

                </div>

                <p className="text-lg">

                  Instant owner contact during emergencies

                </p>

              </div>

            </div>

            <div className="mt-14">

              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-5 text-lg font-bold shadow-xl shadow-blue-600/30 transition hover:scale-105"
              >

                Create Free Account

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />

              </Link>

            </div>

          </motion.div>

          {/* RIGHT SIDE STARTS BELOW */}
                    <motion.div
            initial={{
              opacity: 0,
              x: 60,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
           className="grid gap-8 lg:grid-cols-2"
          >

            {/* Card 1 */}

            <motion.div
              whileHover={{
    y: -8,
    scale: 1.02,
    boxShadow: "0 30px 80px rgba(37,99,235,.25)"
}}
              className="group h-full min-h-[360px] overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl transition-all duration-500 ease-out "
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">

                    <Car
                      size={32}
                      className="text-blue-400"
                    />

                  </div>

                  <h3 className="text-3xl font-black">

                    Lost Your Vehicle?

                  </h3>

                  <p className="mt-5 max-w-md text-lg leading-8 text-zinc-400">

                    Forget where you parked?

                    Vehix stores your parking location,
                    connects it with your vehicle and
                    lets you navigate back in seconds.

                  </p>

                </div>

                <div className="hidden rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 md:block">

                  <span className="font-semibold text-green-400">

                    Smart Parking

                  </span>

                </div>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl bg-black/30 p-5">

                  <p className="text-sm text-zinc-500">

                    Parking Saved

                  </p>

                  <h4 className="mt-2 text-xl font-bold">

                    GPS Location

                  </h4>

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  <p className="text-sm text-zinc-500">

                    Navigation

                  </p>

                  <h4 className="mt-2 text-xl font-bold">

                    One Tap Return

                  </h4>

                </div>

              </div>

            </motion.div>

            {/* Card 2 */}

            <motion.div
              whileHover={{
    y: -8,
    scale: 1.02,
    boxShadow: "0 30px 80px rgba(37,99,235,.25)"
}}
              className="group h-full min-h-[360px] overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl transition-all duration-500 ease-out"
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20">

                    <PhoneCall
                      size={32}
                      className="text-green-400"
                    />

                  </div>

                  <h3 className="text-3xl font-black">

                    Emergency Contact

                  </h3>

                  <p className="mt-5 max-w-md text-lg leading-8 text-zinc-400">

                    If someone finds your vehicle after
                    an accident or emergency,
                    they can immediately reach you
                    without exposing unnecessary
                    personal information.

                  </p>

                </div>

                <div className="hidden rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 md:block">

                  <span className="font-semibold text-blue-400">

                    Privacy First

                  </span>

                </div>

              </div>

              <div className="mt-6 flex flex-wrap gap-4">

                <div className="rounded-2xl bg-black/30 px-5 py-4">

                  📞 Call Owner

                </div>

                <div className="rounded-2xl bg-black/30 px-5 py-4">

                  💬 WhatsApp

                </div>

                <div className="rounded-2xl bg-black/30 px-5 py-4">

                  🚨 Emergency Contact

                </div>

                <div className="rounded-2xl bg-black/30 px-5 py-4">

                  📍 Share Location

                </div>

              </div>

            </motion.div>
                        {/* Card 3 */}

            <motion.div
              whileHover={{
    y: -8,
    scale: 1.02,
    boxShadow: "0 30px 80px rgba(37,99,235,.25)"
}}
              className="group h-full min-h-[360px] overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl transition-all duration-500 ease-out"
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20">

                    <FileCheck
                      size={32}
                      className="text-purple-400"
                    />

                  </div>

                  <h3 className="text-3xl font-black">

                    Secure Vehicle Documents

                  </h3>

                  <p className="mt-5 max-w-md text-lg leading-8 text-zinc-400">

                    Keep your RC, Insurance,
                    PUC and other important
                    documents safely stored inside
                    your private Vehix account.
                    Only you can access them after
                    logging in.

                  </p>

                </div>

                <div className="hidden rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 md:block">

                  <span className="font-semibold text-purple-400">

                    Owner Only

                  </span>

                </div>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl bg-black/30 p-5">

                  <p className="text-sm text-zinc-500">

                    Documents

                  </p>

                  <h4 className="mt-2 text-xl font-bold">

                    RC • Insurance • PUC

                  </h4>

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  <p className="text-sm text-zinc-500">

                    Access

                  </p>

                  <h4 className="mt-2 text-xl font-bold">

                    Private & Encrypted

                  </h4>

                </div>

              </div>

            </motion.div>





            {/* Card 4 */}

            <motion.div
              whileHover={{
    y: -8,
    scale: 1.02,
    boxShadow: "0 30px 80px rgba(37,99,235,.25)"
}}
              className="group h-full min-h-[360px] overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-blue-600/5 p-6 backdrop-blur-3xl transition-all duration-500 ease-out"
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">

                    <Shield
                      size={32}
                      className="text-blue-400"
                    />

                  </div>

                  <h3 className="text-3xl font-black">

                    One Platform.

                    <br />

                    Complete Peace Of Mind.

                  </h3>

                  <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">

                    From QR verification to emergency
                    contact, smart parking, secure
                    documents and future maintenance
                    tracking, Vehix brings everything
                    together into one premium platform.

                  </p>

                </div>

                <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">

                  <span className="font-semibold text-green-400">

                    VERIFIED

                  </span>

                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-black/30 p-5">

                  ✓ Verified Identity

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  ✓ Smart Parking

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  ✓ Emergency Ready

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  ✓ Secure Documents

                </div>

              </div>

            </motion.div>

          </motion.div>
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
            delay: 0.2,
          }}
          className="mt-32 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 p-10 backdrop-blur-3xl"
        >

          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">

            <div>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-blue-400">

                READY TO START?

              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">

                Protect Your Vehicle

                <br />

                With Vehix Today.

              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">

                Join thousands of vehicle owners who are already
                using Vehix to protect their vehicles, simplify
                emergency contact and build a secure digital
                identity for every ride.

              </p>

            </div>

            <div className="flex flex-col gap-4">

              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-5 text-lg font-bold shadow-2xl shadow-blue-600/30 transition duration-300 hover:scale-105"
              >

                Get Started Free

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />

              </Link>

              <Link
                href="#store"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-lg font-semibold transition hover:border-blue-500/30 hover:bg-white/10"
              >

                Explore QR Store

              </Link>

            </div>

          </div>

          {/* Bottom Stats */}

          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 md:grid-cols-4">

            <div className="text-center">

              <h3 className="text-3xl font-black text-blue-400">

                5K+

              </h3>

              <p className="mt-2 text-sm text-zinc-500">

                Protected Vehicles

              </p>

            </div>

            <div className="text-center">

              <h3 className="text-3xl font-black text-cyan-400">

                10K+

              </h3>

              <p className="mt-2 text-sm text-zinc-500">

                QR Scans

              </p>

            </div>

            <div className="text-center">

              <h3 className="text-3xl font-black text-green-400">

                99.9%

              </h3>

              <p className="mt-2 text-sm text-zinc-500">

                Secure Platform

              </p>

            </div>

            <div className="text-center">

              <h3 className="text-3xl font-black text-purple-400">

                24×7

              </h3>

              <p className="mt-2 text-sm text-zinc-500">

                Emergency Ready

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}