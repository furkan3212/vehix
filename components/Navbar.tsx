"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "QR Store", href: "/qr-store" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "px-3 pt-3 sm:px-5"
            : "px-0 pt-0"
        }`}
      >
        <nav
          className={`mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10 transition-all duration-500 ${
            scrolled
              ? "rounded-2xl border border-white/[0.08] bg-[#030712]/85 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              : "border-b border-white/[0.06] bg-[#030712]/60 backdrop-blur-xl"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
            aria-label="Vehix Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-xl border border-white/15 bg-white/[0.04] transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/[0.08]" />

              <div className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute left-[5px] top-[7px] h-[17px] w-[7px] -skew-x-[18deg] rounded-[2px] bg-white" />
                <span className="absolute left-[13px] top-[7px] h-[17px] w-[7px] skew-x-[18deg] rounded-[2px] bg-white/70" />
                <span className="absolute left-[10px] top-[13px] h-[5px] w-[10px] rotate-[0deg] rounded-sm bg-[#030712]" />
              </div>
            </div>

            <div className="leading-none">
              <div className="text-[19px] font-black tracking-[0.18em] text-white">
                VEHIX<span className="text-white/40">™</span>
              </div>
              <div className="mt-1 hidden text-[7px] font-medium tracking-[0.25em] text-white/35 sm:block">
                SMART VEHICLE IDENTITY
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.025] p-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative rounded-full px-4 py-2.5 text-[13px] font-medium text-white/60 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="px-3 py-2 text-[13px] font-medium text-white/60 transition-colors duration-300 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/qr-store"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#030712] transition-all duration-300 hover:scale-[1.02] hover:bg-white/90"
            >
              <span>Get Started</span>

              <ArrowUpRight
                size={15}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:bg-white/[0.08] lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex min-h-full flex-col px-6 pb-8 pt-28">
          {/* Mobile Links */}
          <div className="flex flex-col">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className={`group flex items-center justify-between border-b border-white/[0.07] py-5 transition-all duration-500 ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 60}ms`,
                }}
              >
                <span className="text-2xl font-medium tracking-tight text-white/80 transition-colors group-hover:text-white">
                  {item.label}
                </span>

                <ArrowUpRight
                  size={20}
                  className="text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                />
              </Link>
            ))}
          </div>

          {/* Mobile Actions */}
          <div
            className={`mt-auto space-y-3 transition-all duration-500 ${
              isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition-all hover:bg-white/[0.08]"
            >
              Login
            </Link>

            <Link
              href="/qr-store"
              onClick={closeMenu}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-[#030712] transition-all hover:bg-white/90"
            >
              Get Started
              <ArrowUpRight size={17} strokeWidth={2.5} />
            </Link>

            <p className="pt-4 text-center text-[9px] font-medium tracking-[0.25em] text-white/25">
              SMART VEHICLE IDENTITY NETWORK
            </p>
          </div>
        </div>
      </div>
    </>
  );
}