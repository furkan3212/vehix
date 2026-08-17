"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <>
      {/* VEHIX NAVBAR */}
      <Navbar />

      <main className="min-h-screen bg-[#030712] text-white">
        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-250px] top-[180px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
          <div className="absolute right-[-250px] top-[400px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute bottom-[-250px] left-[35%] h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-[130px]" />
        </div>

        <div className="relative z-10">
          {/* HERO */}
          <section className="mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-8 lg:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                <Sparkles size={15} />
                CONTACT VEHIX
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                We&apos;re Here to{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Help
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                Have a question, need support, or want to know more about
                VEHIX? Our team is ready to help you.
              </p>
            </div>
          </section>

          {/* MAIN CONTACT AREA */}
          <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* LEFT COLUMN */}
              <div className="space-y-5">
                {/* WHATSAPP */}
                <a
                  href="https://wa.me/8657301721"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-950/80 via-[#071b16] to-[#03100c] p-7 shadow-[0_0_50px_rgba(16,185,129,0.10)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_70px_rgba(16,185,129,0.20)]"
                >
                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl transition duration-500 group-hover:bg-emerald-400/20" />

                  <div className="relative">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <MessageCircle size={34} strokeWidth={2} />
                      </div>

                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Fastest Response
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold">
                      Chat on WhatsApp
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                      Get quick help directly from the VEHIX support team.
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm text-emerald-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Usually replies within minutes
                    </div>

                    <div className="mt-7 inline-flex items-center gap-3 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition group-hover:bg-emerald-400">
                      <MessageCircle size={19} />
                      Chat on WhatsApp
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </a>

                {/* EMAIL */}
                <a
                  href="mailto:support@vehix.co.in"
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.055]"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                      <Mail size={27} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        Email Support
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        We&apos;ll get back to you as soon as possible
                      </p>

                      <p className="mt-2 text-sm font-medium text-blue-400">
                        support@vehix.co.in
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-blue-400"
                  />
                </a>

                {/* CALL */}
                <a
                  href="tel:+918657301721"
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.055]"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                      <Phone size={27} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">Call Us</h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Speak directly with our support team
                      </p>

                      <p className="mt-2 text-sm font-medium text-purple-400">
                        +91 86573 01721
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-purple-400"
                  />
                </a>

                {/* PRIVACY */}
                <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-500/[0.07] to-transparent p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <ShieldCheck size={24} />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Your Privacy Matters
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Your information is handled securely and only used to
                        provide support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Headphones size={24} />
                  </div>

                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Send us a message
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Tell us what you need help with and our team will get back
                    to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAME + EMAIL */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Full Name
                      </label>

                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Email Address
                      </label>

                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* PHONE + TOPIC */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Topic
                      </label>

                      <select
                        required
                        className="w-full appearance-none rounded-xl border border-white/10 bg-[#07101d] px-4 py-3.5 text-sm text-gray-300 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                      >
                        <option value="">Select a topic</option>
                        <option>Account & Login</option>
                        <option>VEHIX QR Tag</option>
                        <option>Vehicle Profile</option>
                        <option>Order & Payment</option>
                        <option>Technical Support</option>
                        <option>General Question</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Message
                    </label>

                    <textarea
                      required
                      rows={6}
                      maxLength={1000}
                      placeholder="How can we help you?"
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <Clock3 size={13} />
                      We usually respond within a few hours
                    </div>
                  </div>

                  {/* SEND */}
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/30"
                  >
                    {submitted ? (
                      <>
                        <CheckCircle2 size={19} />
                        Message Sent
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* TRUST STRIP */}
          <section className="border-t border-white/10 bg-white/[0.02]">
            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Headphones size={21} />
                </div>

                <div>
                  <p className="font-semibold">Quick Support</p>
                  <p className="text-xs text-gray-500">
                    We&apos;re here when you need us
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <p className="font-semibold">Trusted Service</p>
                  <p className="text-xs text-gray-500">
                    Built around your vehicle
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="font-semibold">Privacy First</p>
                  <p className="text-xs text-gray-500">
                    Your information stays protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Sparkles size={21} />
                </div>

                <div>
                  <p className="font-semibold">VEHIX Support</p>
                  <p className="text-xs text-gray-500">
                    Always improving for you
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* VEHIX FOOTER */}
      <Footer />
    </>
  );
}