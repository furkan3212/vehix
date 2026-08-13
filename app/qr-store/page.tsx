"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ImagePlus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const products = [
  {
    id: "basic",
    name: "Basic Design",
    price: 499,
    badge: "₹499",
    description:
      "Choose from our professionally designed Vehix sticker designs and give your vehicle a clean smart identity.",
    icon: ShieldCheck,
    features: [
      "100% Waterproof",
      "UV & Weather Resistant",
      "Scratch Resistant Finish",
      "Premium Vehicle-Grade Material",
      "Official Vehix QR Identity",
      "Long-Lasting Outdoor Use",
    ],
  },
  {
    id: "design",
    name: "Choose a Design",
    price: 599,
    badge: "₹599",
    description:
      "Have a design you love? Upload your preferred design and we'll prepare your Vehix sticker accordingly.",
    icon: ImagePlus,
    features: [
      "100% Waterproof",
      "Upload Your Own Design",
      "UV & Weather Resistant",
      "Premium Vehicle-Grade Material",
      "Official Vehix QR Identity",
      "High-Quality Print",
    ],
  },
  {
    id: "custom",
    name: "Custom Design",
    price: 699,
    badge: "₹699",
    description:
      "Upload a photo of your vehicle, bike, logo or preferred reference and get a personalized Vehix sticker design.",
    icon: Sparkles,
    features: [
      "100% Waterproof",
      "Custom Design From Your Photo",
      "Professional Design Treatment",
      "UV & Weather Resistant",
      "Premium Vehicle-Grade Material",
      "Official Vehix QR Identity",
    ],
  },
];

export default function QRStorePage() {
  const router = useRouter();

  const handleContinue = (productId: string) => {
    router.push(`/qr-store/customize?product=${productId}`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" />
        <div className="absolute bottom-[-180px] right-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 md:py-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
              <QrCode size={22} />
            </div>

            <div className="text-left">
              <p className="font-black tracking-[0.25em]">
                VEHIX
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Smart Vehicle Identity
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-blue-500/30 hover:bg-white/10"
          >
            Login
          </button>
        </header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl pt-20 text-center md:pt-24"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            <QrCode size={15} />
            Official Vehix QR Stickers
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
            Your Vehicle.
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Your Identity.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
            Choose a Vehix sticker, select your design or
            upload your own photo. Every sticker comes with
            your unique Vehix QR identity.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              💧 100% Waterproof
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              ☀️ UV Resistant
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              🔒 Secure QR Identity
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              🇮🇳 Made For India
            </span>
          </div>
        </motion.section>

        {/* Products */}
        <section className="mt-20 md:mt-28">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Choose Your Sticker
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Pick the style you want.
            </h2>

            <p className="mt-3 max-w-2xl text-zinc-500">
              Three simple options. No complicated packages.
              Choose your sticker and continue.
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-3">
            {products.map((product, index) => {
              const Icon = product.icon;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -8 }}
                  className={`relative flex flex-col overflow-hidden rounded-[32px] border p-7 backdrop-blur-2xl transition ${
                    product.id === "design"
                      ? "border-blue-500/30 bg-blue-500/[0.06] shadow-[0_0_70px_rgba(37,99,235,0.10)]"
                      : "border-white/10 bg-white/[0.035] hover:border-blue-500/20"
                  }`}
                >
                  {product.id === "design" && (
                    <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
                      Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/10">
                    <Icon
                      size={30}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="mt-7 inline-flex w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {product.badge}
                  </div>

                  <h3 className="mt-5 text-2xl font-black">
                    {product.name}
                  </h3>

                  <p className="mt-3 min-h-[84px] leading-7 text-zinc-500">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mt-7 border-y border-white/10 py-6">
                    <p className="text-xs uppercase tracking-widest text-zinc-600">
                      Price
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-5xl font-black text-blue-400">
                        ₹{product.price}
                      </span>

                      <span className="text-sm text-zinc-600">
                        / sticker
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-7 flex-1 space-y-3">
                    {product.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm text-zinc-300"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                          <Check
                            size={13}
                            className="text-green-400"
                          />
                        </div>

                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() =>
                      handleContinue(product.id)
                    }
                    className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold shadow-lg shadow-blue-600/20 transition duration-300 hover:scale-[1.02] hover:shadow-blue-500/30"
                  >
                    {product.id === "basic"
                      ? "Choose Basic Design"
                      : product.id === "design"
                        ? "Upload Design"
                        : "Create Custom Design"}

                    <ArrowRight
                      size={19}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Waterproof Feature */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-[36px] border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-blue-600/10 p-8 md:p-12"
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                <ShieldCheck size={15} />
                Built For Your Vehicle
              </div>

              <h2 className="mt-6 text-3xl font-black md:text-5xl">
                Made for rain,
                <br />
                sun & everyday use.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
                Vehix stickers are designed for outdoor
                vehicle use. They're 100% waterproof,
                weather resistant and built to stay sharp
                through everyday driving conditions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <span className="text-3xl">💧</span>
                <h3 className="mt-4 font-bold">
                  100% Waterproof
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Designed to handle rain and water exposure.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <span className="text-3xl">☀️</span>
                <h3 className="mt-4 font-bold">
                  UV Resistant
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Designed for regular outdoor exposure.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <span className="text-3xl">🛡️</span>
                <h3 className="mt-4 font-bold">
                  Durable Material
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Premium material made for vehicle surfaces.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <span className="text-3xl">⚡</span>
                <h3 className="mt-4 font-bold">
                  Easy to Use
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Peel, apply and activate your QR identity.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Design Options */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Your Design. Your Way.
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Pick what works for you.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <QrCode
                  size={23}
                  className="text-blue-400"
                />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Basic Design
              </h3>

              <p className="mt-2 text-sm leading-7 text-zinc-500">
                Choose one of our ready-to-use Vehix designs.
              </p>

              <p className="mt-5 text-2xl font-black text-blue-400">
                ₹499
              </p>
            </div>

            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Upload
                  size={23}
                  className="text-blue-400"
                />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Upload Your Design
              </h3>

              <p className="mt-2 text-sm leading-7 text-zinc-500">
                Already have a design? Upload it and we'll
                prepare your sticker.
              </p>

              <p className="mt-5 text-2xl font-black text-blue-400">
                ₹599
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Sparkles
                  size={23}
                  className="text-blue-400"
                />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Custom From Photo
              </h3>

              <p className="mt-2 text-sm leading-7 text-zinc-500">
                Upload a photo or reference and get a custom
                Vehix design.
              </p>

              <p className="mt-5 text-2xl font-black text-blue-400">
                ₹699
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mt-20 rounded-[36px] border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Order in a few simple steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Choose",
                text: "Select Basic, Design or Custom.",
              },
              {
                number: "02",
                title: "Customize",
                text: "Upload your design or photo when required.",
              },
              {
                number: "03",
                title: "Order",
                text: "Enter your details and complete payment.",
              },
              {
                number: "04",
                title: "Activate",
                text: "Receive your sticker and activate your Vehix QR.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-sm font-black text-blue-400">
                  {step.number}
                </div>

                <h3 className="mt-4 font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <Zap
              size={30}
              className="text-blue-400"
            />
          </div>

          <h2 className="mt-6 text-4xl font-black md:text-5xl">
            Ready to give your vehicle
            <span className="block text-blue-400">
              its Vehix identity?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-zinc-500">
            Choose your sticker, customize it and make
            your vehicle part of the Vehix network.
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Vehix • Smart
            Vehicle Identity
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-5 text-xs text-zinc-700">
            <span>100% Waterproof</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>Premium Quality</span>
            <span>•</span>
            <span>Made For India</span>
          </div>
        </footer>
      </div>
    </main>
  );
}