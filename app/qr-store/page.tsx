"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Droplets,
  ImagePlus,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  UserCircle,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const products = [
  {
    id: "basic",
    name: "Standard QR",
    price: 499,
    badge: "STANDARD",
    description:
      "A clean and simple Vehix QR sticker for everyday vehicle identity.",
    accent: "blue",
    features: ["Waterproof", "Durable", "Easy to Scan"],
    button: "Select Standard",
  },
  {
    id: "design",
    name: "Design QR",
    price: 599,
    badge: "VEHIX DESIGNS",
    description:
      "Choose from our collection of premium Vehix QR sticker designs.",
    accent: "blue",
    popular: true,
    features: ["Premium Designs", "High Quality", "Weatherproof"],
    button: "Browse Designs",
  },
  {
    id: "custom",
    name: "Custom Design",
    price: 699,
    badge: "CUSTOM",
    description:
      "Have your own design? Upload it and we'll create your personalized Vehix sticker.",
    accent: "purple",
    features: ["Your Design", "Premium Print", "Unique Identity"],
    button: "Upload & Customize",
  },
];

const designs = [
  {
    id: "performance-red",
    name: "Performance Red",
    image: "/qr-store/design-01.png",
    type: "design",
    className:
      "bg-gradient-to-br from-[#080b12] via-[#1a1118] to-[#450814]",
    qrClass: "text-white",
    accent: "red",
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    image: "/qr-store/design-02.png",
    type: "design",
    className:
      "bg-gradient-to-br from-[#050b15] via-[#071b35] to-[#063b68]",
    qrClass: "text-white",
    accent: "blue",
  },
  {
    id: "stealth-carbon",
    name: "Stealth Carbon",
    image: "/qr-store/design-03.png",
    type: "design",
    className:
      "bg-gradient-to-br from-[#080808] via-[#181818] to-[#292929]",
    qrClass: "text-white",
    accent: "gray",
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    image: "/qr-store/design-04.png",
    type: "design",
    className:
      "bg-gradient-to-br from-[#080806] via-[#211b0b] to-[#725c18]",
    qrClass: "text-white",
    accent: "gold",
  },
  {
    id: "urban-black",
    name: "Urban Black",
    image: "/qr-store/design-05.png",
    type: "design",
    className:
      "bg-gradient-to-br from-[#050505] via-[#111111] to-[#222222]",
    qrClass: "text-white",
    accent: "black",
  },
  {
    id: "stealth-silver",
    name: "Stealth Silver",
    image: "/qr-store/design-06.png",
    type: "design",
    className:
      "bg-gradient-to-br from-[#15171a] via-[#35383d] to-[#0a0b0d]",
    qrClass: "text-white",
    accent: "silver",
  },
];

function StickerPreview({
  accent = "blue",
  large = false,
  imageSrc,
}: {
  accent?: string;
  large?: boolean;
  imageSrc?: string;
}) {
  const accentClass =
    accent === "red"
      ? "border-red-500/60 shadow-[0_0_35px_rgba(239,68,68,0.18)]"
      : accent === "gold"
        ? "border-yellow-500/60 shadow-[0_0_35px_rgba(234,179,8,0.16)]"
        : accent === "purple"
          ? "border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.18)]"
          : "border-blue-500/60 shadow-[0_0_35px_rgba(37,99,235,0.18)]";

  return (
    <div
      className={`relative ${
        large ? "h-64 w-64" : "h-36 w-36"
      } rotate-[-3deg] rounded-[28%] border-2 ${accentClass}
      bg-[#070b12] p-3 transition-transform duration-500
      group-hover:rotate-0`}
    >
      <div className="absolute inset-2 rounded-[25%] border border-white/10" />

      {imageSrc ? (
        <div className="relative h-full w-full overflow-hidden rounded-[23%]">
          <Image
            src={imageSrc}
            alt="Vehix Standard QR Sticker"
            fill
            sizes={large ? "256px" : "144px"}
            className="object-contain"
            priority={large}
          />
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[23%] bg-black/40">
          <div className="text-[10px] font-black tracking-[0.3em] text-white/80">
            VEHIX
          </div>

          <div className="mt-2 flex aspect-square w-[45%] items-center justify-center rounded-lg bg-white p-1">
            <QrCode className="h-full w-full text-black" />
          </div>

          <div className="mt-2 text-[7px] font-bold uppercase tracking-[0.2em] text-white/50">
            Scan to connect
          </div>
        </div>
      )}
    </div>
  );
}

export default function QRStorePage() {
  const router = useRouter();

  const [ownerName, setOwnerName] = useState("Owner");
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState("performance-red");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/qr-store");
        return;
      }

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Owner";

      setOwnerName(name);
      setLoadingUser(false);
    }

    loadUser();
  }, [router]);

  const handleContinue = (productId: string) => {
    router.push(
      `/qr-store/customize?product=${productId}${
        productId === "design"
          ? `&design=${selectedDesign}`
          : ""
      }`
    );
  };

  if (loadingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020611] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-blue-600/20">
            <QrCode className="text-blue-400" />
          </div>

          <p className="text-sm text-zinc-500">
            Loading Vehix Store...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020611] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-250px] top-[50px] h-[600px] w-[600px] rounded-full bg-blue-600/[0.08] blur-[180px]" />

        <div className="absolute right-[-250px] top-[400px] h-[600px] w-[600px] rounded-full bg-cyan-500/[0.06] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.25) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 65%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-5 py-6 md:px-10">
        {/* NAVIGATION */}
        <header className="flex items-center justify-between border-b border-white/[0.07] pb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <QrCode size={22} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="font-black tracking-[0.25em]">
                VEHIX
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Smart Vehicle Identity
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-500 lg:flex">
            <button onClick={() => router.push("/dashboard")}>
              Dashboard
            </button>

            <button
              onClick={() => router.push("/vehicle")}
            >
              My Vehicles
            </button>

            <span className="relative text-white">
              QR Store

              <span className="absolute -bottom-7 left-0 right-0 h-[2px] rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
            </span>

            <button
              onClick={() => router.push("/dashboard/orders")}
            >
              Orders
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:block">
              <Sparkles
                size={18}
                className="text-zinc-400"
              />
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition hover:border-blue-500/30">
              <UserCircle
                size={20}
                className="text-blue-400"
              />

              <div className="hidden text-left sm:block">
                <p className="max-w-[130px] truncate text-sm font-bold">
                  {ownerName}
                </p>

                <p className="text-[10px] text-blue-400">
                  Vehicle Owner
                </p>
              </div>

              <ChevronDown
                size={15}
                className="text-zinc-600"
              />
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="relative mt-10 overflow-hidden rounded-[36px] border border-blue-500/10 bg-[#040b16]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.07] via-transparent to-cyan-500/[0.05]" />

          <div className="relative grid items-center gap-10 px-7 py-12 md:px-14 md:py-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                <QrCode size={13} />
                Official Vehix QR Stickers
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Your Vehicle.

                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Identity.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
                Choose your Vehix sticker, select a design
                that matches your style, or upload your own.
                Every sticker carries your unique Vehix QR
                identity.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  [Droplets, "Waterproof"],
                  [Sun, "UV Resistant"],
                  [Lock, "Secure QR"],
                  [ShieldCheck, "Made For India"],
                ].map(([Icon, label]) => (
                  <span
                    key={label as string}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-400"
                  >
                    <Icon
                      size={14}
                      className="text-blue-400"
                    />

                    {label as string}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Hero sticker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex min-h-[330px] items-center justify-center"
            >
              <div className="absolute h-[280px] w-[280px] rounded-full bg-blue-500/10 blur-[80px]" />

              <div className="relative">
                <div className="absolute -inset-16 rounded-full border border-blue-500/10" />

                <div className="absolute -inset-28 rounded-full border border-blue-500/[0.05]" />

                <StickerPreview
                  large
                  accent="blue"
                  imageSrc="/qr-designs/standard-qr.png"
                />

                <div className="absolute -right-20 top-0 hidden rounded-2xl border border-blue-500/20 bg-[#07101d]/90 p-4 backdrop-blur-xl md:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400">
                    SMART QR
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Instant vehicle access
                  </p>
                </div>

                <div className="absolute -bottom-5 -left-24 hidden rounded-2xl border border-white/10 bg-[#07101d]/90 p-4 backdrop-blur-xl md:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">
                    PROTECTED
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Your data. Your control.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CHOOSE YOUR STICKER */}
        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
              Choose Your Sticker
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Pick the perfect style.
            </h2>

            <p className="mt-3 text-zinc-500">
              Simple options. Premium finish. One Vehix
              identity.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className={`group relative overflow-hidden rounded-[28px] border p-6 ${
                  product.popular
                    ? "border-blue-500/50 bg-blue-500/[0.06] shadow-[0_0_70px_rgba(37,99,235,.12)]"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                {product.popular && (
                  <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                    Popular
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[9px] font-black tracking-widest text-blue-400">
                      {product.badge}
                    </span>

                    <h3 className="mt-4 text-2xl font-black">
                      {product.name}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                      {product.description}
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    <StickerPreview
                      accent={product.accent}
                     imageSrc={
  product.id === "basic"
    ? "/qr-designs/standard-qr.png"
    : product.id === "design"
      ? "/qr-designs/design-qr.png"
      : "/qr-store/custom.png"
}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="text-4xl font-black text-blue-400">
                      ₹{product.price}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      / sticker
                    </p>
                  </div>

                  <div className="hidden gap-2 sm:flex">
                    {product.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] text-zinc-500"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleContinue(product.id)
                  }
                  className={`group mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition ${
                    product.accent === "purple"
                      ? "border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                      : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20 hover:scale-[1.01]"
                  }`}
                >
                  {product.button}

                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DESIGN COLLECTION */}
        <section className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                Vehix Designs Collection
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Pick your style.
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Premium QR designs made for your vehicle.
              </p>
            </div>

            <span className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-zinc-400 md:block">
              {designs.length} Designs
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {designs.map((design) => {
              const selected =
                selectedDesign === design.id;

              return (
                <button
                  key={design.id}
                  onClick={() =>
                    setSelectedDesign(design.id)
                  }
                  className={`group relative rounded-2xl border p-3 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-500/[0.08] shadow-[0_0_30px_rgba(37,99,235,.15)]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20"
                  }`}
                >
                  {selected && (
                    <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                      <Check size={13} />
                    </div>
                  )}

                  <div
                    className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-black/30 ${design.className}`}
                  >
                    <div className="absolute inset-0 bg-black/10" />

                    <img
                      src={design.image}
                      alt={`${design.name} VEHIX QR design`}
                      className="relative h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  <p className="mt-3 text-xs font-bold">
                    {design.name}
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    ₹599
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4">
            <div>
              <p className="text-sm font-bold">
                {
                  designs.find(
                    (d) => d.id === selectedDesign
                  )?.name
                }
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Design QR • ₹599
              </p>
            </div>

            <button
              onClick={() => handleContinue("design")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold shadow-lg shadow-blue-600/20"
            >
              Continue

              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* CUSTOM DESIGN */}
        <section className="mt-16 overflow-hidden rounded-[30px] border border-purple-500/20 bg-gradient-to-r from-purple-500/[0.07] to-blue-500/[0.04]">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-300">
                <Sparkles size={14} />
                Your Design
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Have your own design?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-zinc-500">
                Upload your logo, artwork, vehicle theme or
                any reference. We'll prepare it as a premium
                Vehix QR sticker.
              </p>

              <button
                onClick={() => handleContinue("custom")}
                className="mt-7 flex items-center gap-3 rounded-xl border border-purple-500/40 bg-purple-500/10 px-6 py-3.5 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20"
              >
                <Upload size={17} />

                Upload & Customize

                <ArrowRight size={16} />
              </button>
            </div>

            <div className="flex justify-center">
              <div className="relative flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                <div className="absolute h-48 w-48 rounded-full bg-purple-500/10 blur-[70px]" />

                <div className="relative flex flex-col items-center gap-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-purple-500/50 bg-purple-500/10">
                    <ImagePlus
                      size={30}
                      className="text-purple-400"
                    />
                  </div>

                  <p className="text-sm font-bold">
                    Upload your design
                  </p>

                  <p className="text-xs text-zinc-600">
                    PNG, JPG or your artwork
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY VEHIX */}
        <section className="mt-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Droplets,
                title: "100% Waterproof",
                text: "Built for rain and water exposure.",
              },
              {
                icon: Sun,
                title: "UV Resistant",
                text: "Designed for everyday outdoor use.",
              },
              {
                icon: ShieldCheck,
                title: "Vehicle Grade",
                text: "Made for real vehicle surfaces.",
              },
              {
                icon: Zap,
                title: "Easy to Scan",
                text: "Quick access to your Vehix identity.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <Icon
                    size={21}
                    className="text-blue-400"
                  />

                  <h3 className="mt-4 text-sm font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-white/10 py-8 text-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Vehix • Smart
            Vehicle Identity
          </p>
        </footer>
      </div>
    </main>
  );
}