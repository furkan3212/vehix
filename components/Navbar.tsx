"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Car, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const links = [
    {
      title: "Features",
      href: "#features",
    },
    {
      title: "How It Works",
      href: "#how-it-works",
    },
    {
      title: "QR Store",
      href: "#qr-store",
    },
    {
      title: "Pricing",
      href: "#pricing",
    },
    {
      title: "Contact",
      href: "#footer",
    },
  ];

  return (
    <>
      <motion.header
        initial={{
          y: -100,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-black/60 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/30">

              <Car
                size={24}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="text-2xl font-black tracking-wider">

                VEHIX

              </h1>

              <p className="-mt-1 text-xs text-blue-400">

                Smart Vehicle Identity

              </p>

            </div>

          </Link>

          {/* Desktop Menu */}

          <nav className="hidden items-center gap-10 lg:flex">

            {links.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="relative text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {link.title}
              </a>
            ))}

          </nav>
                    {/* Desktop Buttons */}

          <div className="hidden items-center gap-4 lg:flex">

            <Link
              href="/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-blue-500/40 hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:scale-105 hover:shadow-blue-500/50"
            >

              Get Started

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />

            </Link>

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:border-blue-500/40 hover:bg-white/10 lg:hidden"
          >

            {mobileOpen ? (

              <X size={24} />

            ) : (

              <Menu size={24} />

            )}

          </button>

        </div>

      </motion.header>

      {/* Mobile Menu */}

      <AnimatePresence>

        {mobileOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: -40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -40,
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed left-0 top-20 z-40 w-full border-t border-white/10 bg-black/95 backdrop-blur-3xl lg:hidden"
          >

            <div className="space-y-2 px-6 py-8">

              {links.map((link) => (

                <a
                  key={link.title}
                  href={link.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="block rounded-2xl px-5 py-4 text-lg font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >

                  {link.title}

                </a>

              ))}

              <div className="mt-8 space-y-4">

                <Link
                  href="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="block rounded-2xl border border-white/10 bg-white/5 py-4 text-center font-semibold transition hover:bg-white/10"
                >

                  Login

                </Link>

                <Link
                  href="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="block rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-center font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
                >

                  Get Started

                </Link>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>
          </>
  );
}