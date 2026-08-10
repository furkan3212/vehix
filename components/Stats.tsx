"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

import {
  ShieldCheck,
  QrCode,
  Car,
  PhoneCall,
} from "lucide-react";

const stats = [
  {
    icon: Car,
    number: 5000,
    suffix: "+",
    title: "Protected Vehicles",
    description:
      "Vehicles securely registered on Vehix.",
    color: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  {
    icon: QrCode,
    number: 10000,
    suffix: "+",
    title: "QR Scans",
    description:
      "Successful scans performed by users.",
    color: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: ShieldCheck,
    number: 100,
    suffix: "%",
    decimals: 1,
    title: "Secure Platform",
    description:
      "Privacy-first vehicle identity system.",
    color: "text-green-400",
    glow: "shadow-green-500/20",
  },
  {
    icon: PhoneCall,
    number: 24,
    suffix: "/7",
    title: "Emergency Ready",
    description:
      "Instant contact whenever needed.",
    color: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#030712] py-28">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[170px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

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
          className="mx-auto max-w-3xl text-center"
        >

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">

            Trusted Across India

          </span>

          <h2 className="mt-8 text-4xl font-black md:text-6xl">

            Built For

            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

              {" "}Vehicle Owners

            </span>

          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">

            Thousands of owners rely on Vehix to protect
            their vehicles, simplify emergency contact,
            manage parking, and build a secure digital
            identity.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, index) => {

            const Icon = stat.icon;

            return (

              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 50,
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
                  y: -10,
                  scale: 1.03,
                }}
                className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl transition-all duration-500 ${stat.glow}`}
              >

                {/* Glow */}

                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-[90px] transition-all duration-500 group-hover:bg-blue-500/20" />

                {/* Icon */}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ${stat.color}`}
                >

                  <Icon size={30} />

                </div>

                {/* Number */}

                <h3
                  className={`mt-8 text-5xl font-black ${stat.color}`}
                >

                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    enableScrollSpy
                    scrollSpyOnce
                  />

                  {stat.suffix}

                </h3>

                {/* Title */}

                <h4 className="mt-5 text-2xl font-bold">

                  {stat.title}

                </h4>

                {/* Description */}

                <p className="mt-4 leading-7 text-zinc-400">

                  {stat.description}

                </p>

                {/* Bottom Line */}

                <div className="mt-8 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-transparent opacity-40 transition-all duration-500 group-hover:opacity-100" />

              </motion.div>

            );

          })}
                  </div>

        {/* Bottom Trust Banner */}

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
            delay: 0.2,
          }}
          className="mt-20 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 p-10 backdrop-blur-3xl"
        >

          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

            <div>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">

                TRUSTED PLATFORM

              </span>

              <h3 className="mt-6 text-3xl font-black md:text-5xl">

                Join the Future of

                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

                  {" "}Vehicle Identity

                </span>

              </h3>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">

                Vehix combines secure QR technology, emergency contact,
                smart parking and digital ownership into one seamless platform
                built for modern vehicle owners.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">

                <p className="text-3xl font-black text-blue-400">

                  100%

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  Privacy Focused

                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">

                <p className="text-3xl font-black text-green-400">

                  24×7

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  Emergency Ready

                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">

                <p className="text-3xl font-black text-cyan-400">

                  Fast

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  QR Verification

                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">

                <p className="text-3xl font-black text-purple-400">

                  Safe

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  Owner Identity

                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}