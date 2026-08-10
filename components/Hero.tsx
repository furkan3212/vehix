"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowRight,
  ShieldCheck,
  QrCode,
  MapPin,
  PhoneCall,
  Star,
  Sparkles,
  CheckCircle2,
  Car,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#030712] pt-32 pb-24 text-white">

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[170px]" />

        <div className="absolute right-0 top-20 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[190px]" />

        <div className="absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />

      </div>

      {/* Grid */}

      <div className="absolute inset-0 opacity-[0.04]">

        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-20 px-6 lg:flex-row lg:items-center">

        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="flex-1"
        >

          <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-3">

            <Sparkles
              size={18}
              className="text-blue-400"
            />

            <span className="text-sm font-medium text-blue-300">

              India's Smart Vehicle Identity Network

            </span>

          </div>

          <h1 className="mt-8 text-5xl font-black leading-[1.05] md:text-7xl">

            Your Vehicle

            <br />

            <span className="bg-gradient-to-r from-white via-blue-300 to-cyan-400 bg-clip-text text-transparent">

              Deserves More

            </span>

            <br />

            Than Just A

            <br />

            Number Plate.

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-400 md:text-xl">

            Vehix transforms every vehicle into a secure digital identity.

            Protect your ride, connect instantly with people who find it,

            save parking locations, manage documents and access everything

            from one premium platform.

          </p>
                    {/* CTA Buttons */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-5 text-lg font-bold shadow-2xl shadow-blue-600/30 transition duration-300 hover:scale-105 hover:shadow-blue-500/50"
            >

              Get Started Free

              <ArrowRight
                size={22}
                className="transition group-hover:translate-x-1"
              />

            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-lg font-semibold backdrop-blur-xl transition hover:border-blue-500/40 hover:bg-white/10"
            >

              Watch Demo

            </Link>

          </div>

          {/* Trust Row */}

          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-1">

                {Array.from({ length: 5 }).map((_, index) => (

                  <Star
                    key={index}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                ))}

              </div>

              <p className="mt-3 text-zinc-400">

                Trusted by

                <span className="font-bold text-white">

                  {" "}5,000+

                </span>

                {" "}vehicle owners across India.

              </p>

            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-6 py-4">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  className="text-blue-400"
                  size={22}
                />

                <span className="font-semibold">

                  Secure • Verified • Privacy First

                </span>

              </div>

            </div>

          </div>

          {/* Premium Statistics */}

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
            >

              <h3 className="text-4xl font-black text-blue-400">

                5K+

              </h3>

              <p className="mt-2 text-sm text-zinc-400">

                Protected Vehicles

              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
            >

              <h3 className="text-4xl font-black text-cyan-400">

                10K+

              </h3>

              <p className="mt-2 text-sm text-zinc-400">

                QR Scans

              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
            >

              <h3 className="text-4xl font-black text-green-400">

                99.9%

              </h3>

              <p className="mt-2 text-sm text-zinc-400">

                Secure Platform

              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
            >

              <h3 className="text-4xl font-black text-purple-400">

                24/7

              </h3>

              <p className="mt-2 text-sm text-zinc-400">

                Emergency Ready

              </p>

            </motion.div>

          </div>

        </motion.div>

        {/* RIGHT SIDE STARTS BELOW */}
                <motion.div
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="relative flex flex-1 items-center justify-center"
        >

          {/* Floating Glow */}

          <div className="absolute h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[140px]" />

          {/* Floating Card */}

          <motion.div
            animate={{
              y: [0, -18, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full max-w-md rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_0_70px_rgba(37,99,235,0.18)] backdrop-blur-3xl"
          >

            {/* Header */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-zinc-400">

                  VEHIX VERIFIED

                </p>

                <h3 className="mt-2 text-3xl font-black">

                  MH 01 AB 1234

                </h3>

              </div>

              <div className="rounded-full bg-green-500/20 px-4 py-2">

                <span className="text-sm font-bold text-green-400">

                  VERIFIED

                </span>

              </div>

            </div>

            {/* QR */}

            <div className="mt-10 flex justify-center">

              <div className="rounded-[28px] border border-white/10 bg-white p-8 shadow-2xl">

                <QrCode
                  size={180}
                  className="text-black"
                />

              </div>

            </div>

            {/* Vehicle */}

            <div className="mt-10 rounded-3xl bg-black/30 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-zinc-500">

                    Vehicle

                  </p>

                  <h3 className="mt-2 text-2xl font-bold">

                    BMW M340i

                  </h3>

                </div>

                <Car
                  size={40}
                  className="text-blue-400"
                />

              </div>

            </div>

            {/* Features */}

            <div className="mt-8 grid gap-4">

              <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">

                <CheckCircle2
                  className="text-green-400"
                  size={24}
                />

                <span>

                  Owner Identity Verified

                </span>

              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">

                <PhoneCall
                  className="text-blue-400"
                  size={24}
                />

                <span>

                  Emergency Contact Available

                </span>

              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">

                <MapPin
                  className="text-green-400"
                  size={24}
                />

                <span>

                  Smart Parking Enabled

                </span>

              </div>

            </div>

          </motion.div>

          {/* Floating Badge */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute -right-5 top-12 hidden rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-2xl lg:block"
          >

            <ShieldCheck
              size={32}
              className="mx-auto text-green-400"
            />

            <p className="mt-3 text-center text-sm font-semibold">

              100% Verified

            </p>

          </motion.div>

          {/* Floating Parking */}

          <motion.div
            animate={{
              y: [0, 14, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute -bottom-6 -left-6 hidden rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-2xl lg:block"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-green-500/20 p-3">

                <MapPin
                  size={24}
                  className="text-green-400"
                />

              </div>

              <div>

                <p className="text-xs text-zinc-500">

                  Latest Parking

                </p>

                <h4 className="font-bold">

                  Saved Successfully

                </h4>

              </div>

            </div>

          </motion.div>
                    {/* Floating QR Scan Badge */}

          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute left-2 top-24 hidden rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl xl:block"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20">

                <QrCode
                  className="text-cyan-400"
                  size={28}
                />

              </div>

              <div>

                <p className="text-xs text-zinc-500">

                  QR Scans

                </p>

                <h4 className="text-xl font-black">

                  10,247

                </h4>

              </div>

            </div>

          </motion.div>





          {/* Premium Review Card */}

          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute -right-10 bottom-32 hidden w-72 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl xl:block"
          >

            <div className="flex items-center gap-1">

              {Array.from({ length: 5 }).map((_, index) => (

                <Star
                  key={index}
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

              ))}

            </div>

            <p className="mt-5 leading-7 text-zinc-300">

              "Finally a QR system that actually looks premium
              and gives my customers confidence."

            </p>

            <div className="mt-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-black">

                DR

              </div>

              <div>

                <h4 className="font-bold">

                  Detailing Rocks

                </h4>

                <p className="text-sm text-zinc-500">

                  Mumbai

                </p>

              </div>

            </div>

          </motion.div>





          {/* Floating Features */}

          <div className="absolute -bottom-16 left-1/2 hidden -translate-x-1/2 gap-4 lg:flex">

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-xl"
            >

              <div className="flex items-center gap-3">

                <ShieldCheck
                  className="text-green-400"
                  size={22}
                />

                <span className="font-semibold">

                  Privacy Protected

                </span>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-xl"
            >

              <div className="flex items-center gap-3">

                <MapPin
                  className="text-green-400"
                  size={22}
                />

                <span className="font-semibold">

                  Smart Parking

                </span>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-xl"
            >

              <div className="flex items-center gap-3">

                <PhoneCall
                  className="text-blue-400"
                  size={22}
                />

                <span className="font-semibold">

                  Emergency Ready

                </span>

              </div>

            </motion.div>

          </div>

        </motion.div>
                  {/* Premium Trust Bar */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
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
            className="absolute -bottom-32 left-1/2 hidden w-[95%] max-w-6xl -translate-x-1/2 rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl xl:block"
          >

            <div className="grid grid-cols-4 gap-8">

              <div className="text-center">

                <h3 className="text-5xl font-black text-blue-400">

                  5K+

                </h3>

                <p className="mt-3 text-zinc-400">

                  Registered Vehicles

                </p>

              </div>

              <div className="text-center">

                <h3 className="text-5xl font-black text-cyan-400">

                  10K+

                </h3>

                <p className="mt-3 text-zinc-400">

                  Successful QR Scans

                </p>

              </div>

              <div className="text-center">

                <h3 className="text-5xl font-black text-green-400">

                  99.9%

                </h3>

                <p className="mt-3 text-zinc-400">

                  Secure Platform

                </p>

              </div>

              <div className="text-center">

                <h3 className="text-5xl font-black text-purple-400">

                  24×7

                </h3>

                <p className="mt-3 text-zinc-400">

                  Emergency Ready

                </p>

              </div>

            </div>

          </motion.div>

      </div>

      {/* Scroll Indicator */}

      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="mt-24 flex flex-col items-center justify-center"
      >

        <p className="mb-4 text-sm tracking-[0.35em] text-zinc-500 uppercase">

          Scroll To Explore

        </p>

        <div className="flex h-16 w-10 justify-center rounded-full border border-white/20">

          <motion.div
            animate={{
              y: [0, 22, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="mt-3 h-3 w-3 rounded-full bg-blue-500"
          />

        </div>

      </motion.div>
          </section>
  );
}