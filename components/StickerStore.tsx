"use client";

import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ImagePlus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  X,
  Palette,
} from "lucide-react";

type ProductType = "standard" | "design" | "custom";

type Design = {
  id: string;
  name: string;
  image: string;
};

const designs: Design[] = [
  {
    id: "design-01",
    name: "Classic Black",
    image: "/qr-store/design-01.png",
  },
  {
    id: "design-02",
    name: "Sport Blue",
    image: "/qr-store/design-02.png",
  },
  {
    id: "design-03",
    name: "Performance Red",
    image: "/qr-store/design-03.png",
  },
  {
    id: "design-04",
    name: "Stealth",
    image: "/qr-store/design-04.png",
  },
  {
    id: "design-05",
    name: "Carbon",
    image: "/qr-store/design-05.png",
  },
  {
    id: "design-06",
    name: "Premium",
    image: "/qr-store/design-06.png",
  },
];

const productPrices: Record<ProductType, number> = {
  standard: 499,
  design: 599,
  custom: 699,
};

export default function StickerStore() {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>("standard");

  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  const [customFile, setCustomFile] = useState<File | null>(null);

  const [customPreview, setCustomPreview] = useState<string>("");

  const [quantity, setQuantity] = useState(1);

  const [uploadError, setUploadError] = useState("");

  const unitPrice = productPrices[selectedProduct];

  const totalPrice = unitPrice * quantity;

  function selectProduct(product: ProductType) {
    setSelectedProduct(product);

    if (product !== "design") {
      setSelectedDesign(null);
    }

    if (product !== "custom") {
      setCustomFile(null);
      setCustomPreview("");
      setUploadError("");
    }
  }

  function handleDesignSelect(design: Design) {
    setSelectedProduct("design");
    setSelectedDesign(design);
    setCustomFile(null);
    setCustomPreview("");
    setUploadError("");
  }

  function handleCustomUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setUploadError("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError("Image size must be 10 MB or less.");
      return;
    }

    if (customPreview) {
      URL.revokeObjectURL(customPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setCustomFile(file);
    setCustomPreview(previewUrl);
    setSelectedProduct("custom");
    setSelectedDesign(null);
  }

  function removeCustomFile() {
    if (customPreview) {
      URL.revokeObjectURL(customPreview);
    }

    setCustomFile(null);
    setCustomPreview("");
    setUploadError("");
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(20, current + 1));
  }

  function checkout() {
    if (selectedProduct === "design" && !selectedDesign) {
      alert("Please select a VEHIX design first.");
      return;
    }

    if (selectedProduct === "custom" && !customFile) {
      alert("Please upload your custom design first.");
      return;
    }

    const params = new URLSearchParams({
      product: selectedProduct,
      price: String(unitPrice),
      quantity: String(quantity),
    });

    if (selectedDesign) {
      params.set("design", selectedDesign.id);
    }

    if (customFile) {
      params.set("custom_file", customFile.name);
    }

    window.location.href = `/checkout?${params.toString()}`;
  }

  return (
    <section
      id="store"
      className="relative overflow-hidden bg-[#030712] py-24 text-white md:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.06] blur-[180px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.025] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <QrCode className="h-3.5 w-3.5" />
            Vehix QR Store
          </span>

          <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Choose your
            <span className="block bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent">
              Vehix identity.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Choose a clean Standard QR, explore our designed collection, or
            create something personal with your own design.
          </p>
        </motion.div>

        {/* Product Categories */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <ProductCard
            selected={selectedProduct === "standard"}
            badge="STANDARD"
            title="Standard QR"
            price="₹499"
            description="A clean and professional Vehix QR for everyday vehicle identity."
            image="/qr-designs/standard-qr.png"
            icon={ShieldCheck}
            onClick={() => selectProduct("standard")}
          />

          <ProductCard
            selected={selectedProduct === "design"}
            badge="VEHIX DESIGNS"
            title="Design QR"
            price="₹599"
            description="Choose from premium Vehix designs created to give your QR a distinctive look."
            image="/qr-designs/design-qr.png"
            icon={Star}
            onClick={() => selectProduct("design")}
            featured
          />

          <ProductCard
            selected={selectedProduct === "custom"}
            badge="CUSTOM"
            title="Custom Design"
            price="₹699"
            description="Upload your own artwork, logo or design and create a personalized Vehix QR."
            image="/qr-store/custom.png"
            icon={ImagePlus}
            onClick={() => selectProduct("custom")}
          />
        </div>

        {/* Design Collection */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14"
        >
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <Palette className="h-3.5 w-3.5" />
                ₹599 Design QR
              </div>

              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Choose a Vehix design
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Pick the design that matches your vehicle.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Premium Vehix collection
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {designs.map((design) => {
              const selected = selectedDesign?.id === design.id;

              return (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => handleDesignSelect(design)}
                  className={`group overflow-hidden rounded-2xl border text-left transition duration-300 hover:-translate-y-1 ${
                    selected
                      ? "border-cyan-400/50 bg-cyan-400/[0.06] shadow-xl shadow-cyan-500/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-black/30">
                    <img
                      src={design.image}
                      alt={design.name}
                      className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
                    />

                    {selected && (
                      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {design.name}
                    </p>

                    <p className="mt-1 text-xs text-cyan-300">₹599</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Custom Upload */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025]"
        >
          <div className="grid lg:grid-cols-2">
            {/* Upload */}
            <div className="p-7 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-400/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                <Upload className="h-3.5 w-3.5" />
                ₹699 Custom
              </span>

              <h3 className="mt-5 text-3xl font-semibold text-white">
                Have your own design?
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Upload your own image, artwork, logo or design and use it as
                the starting point for your customized Vehix QR.
              </p>

              <label className="mt-7 block cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCustomUpload}
                  className="hidden"
                />

                <div className="group flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.02]">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/[0.06] transition group-hover:scale-105">
                      <Upload className="h-6 w-6 text-cyan-300" />
                    </div>

                    <p className="mt-4 font-semibold text-white">
                      Upload your design
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      JPG, PNG or WEBP · Max 10 MB
                    </p>
                  </div>
                </div>
              </label>

              {uploadError && (
                <p className="mt-3 text-sm text-red-400">{uploadError}</p>
              )}

              {customFile && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Check className="h-[18px] w-[18px] shrink-0 text-emerald-300" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {customFile.name}
                      </p>

                      <p className="text-xs text-slate-600">
                        Ready for customization
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeCustomFile}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-white/5 hover:text-white"
                    aria-label="Remove custom design"
                  >
                    <X className="h-[17px] w-[17px]" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="border-t border-white/[0.07] bg-black/20 p-7 md:p-10 lg:border-l lg:border-t-0">
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-3xl border border-white/[0.07] bg-white/[0.015] p-6">
                {customPreview ? (
                  <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                    <img
                      src={customPreview}
                      alt="Custom design preview"
                      className="max-h-[330px] w-full object-contain"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-black/75 p-3 text-center backdrop-blur">
                      <p className="text-xs font-semibold text-white">
                        Your Custom Design
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Vehix Custom QR · ₹699
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
                      <ImagePlus className="h-7 w-7 text-slate-700" />
                    </div>

                    <p className="mt-5 font-semibold text-slate-400">
                      Your design preview
                    </p>

                    <p className="mt-2 text-xs text-slate-700">
                      Upload an image to see it here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* Benefits */}
          <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-7 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Every Vehix Sticker
            </p>

            <h3 className="mt-3 text-3xl font-semibold text-white">
              Built for the road.
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Benefit
                title="Water Resistant"
                description="Designed for everyday vehicle use and outdoor conditions."
              />

              <Benefit
                title="Durable Finish"
                description="Made with everyday automotive use in mind."
              />

              <Benefit
                title="Easy to Scan"
                description="Quick access to your Vehix digital vehicle identity."
              />

              <Benefit
                title="Smart Identity"
                description="Connect your physical vehicle to your digital Vehix profile."
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-[30px] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.07] to-blue-500/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Your Selection
            </p>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-white">
                  {selectedProduct === "standard" && "Standard QR Sticker"}

                  {selectedProduct === "design" && "Vehix Design QR"}

                  {selectedProduct === "custom" && "Custom Design QR"}
                </p>

                {selectedDesign && (
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDesign.name}
                  </p>
                )}

                {customFile && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {customFile.name}
                  </p>
                )}
              </div>

              <p className="shrink-0 text-2xl font-semibold text-cyan-300">
                ₹{unitPrice}
              </p>
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/20 p-3">
              <span className="text-sm font-medium text-slate-400">
                Quantity
              </span>

              <div className="flex items-center overflow-hidden rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="flex h-10 min-w-10 items-center justify-center border-x border-white/[0.08] px-3 text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= 20}
                  className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 border-t border-white/[0.08] pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total</span>

                <span className="text-3xl font-semibold text-white">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={checkout}
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-semibold text-slate-950 shadow-xl shadow-cyan-950/20 transition hover:bg-cyan-50 hover:shadow-cyan-500/10"
            >
              Continue to Checkout

              <ArrowRight className="h-[19px] w-[19px] transition group-hover:translate-x-1" />
            </button>

            <p className="mt-4 text-center text-[10px] leading-5 text-slate-700">
              Payment and final order confirmation happen securely at
              checkout.
            </p>
          </div>
        </motion.div>

        {/* Trust */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <TrustItem
            icon={ShieldCheck}
            title="Built for Vehicles"
            description="Designed for everyday automotive use."
          />

          <TrustItem
            icon={QrCode}
            title="Vehix Digital Identity"
            description="Your QR connects to your vehicle profile."
          />

          <TrustItem
            icon={Sparkles}
            title="Choose Your Style"
            description="Standard, designed or personalized."
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================
   PRODUCT CARD
============================================ */

function ProductCard({
  selected,
  badge,
  title,
  price,
  description,
  image,
  icon: Icon,
  onClick,
  featured = false,
}: {
  selected: boolean;
  badge: string;
  title: string;
  price: string;
  description: string;
  image: string;
  icon: typeof ShieldCheck;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.995 }}
      className={`group relative overflow-hidden rounded-[30px] border text-left transition duration-300 ${
        selected
          ? "border-cyan-400/40 bg-cyan-400/[0.05] shadow-2xl shadow-cyan-500/[0.08]"
          : "border-white/[0.08] bg-white/[0.025] hover:border-white/15"
      }`}
    >
      {featured && (
        <div className="absolute left-5 top-5 z-10 rounded-full bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-950">
          Most Popular
        </div>
      )}

      {selected && (
        <div className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg">
          <Check className="h-[17px] w-[17px]" />
        </div>
      )}

      <div className="aspect-[4/3] overflow-hidden bg-black/30">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain p-5 transition duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-cyan-400/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {badge}
          </span>

          <Icon className="h-[19px] w-[19px] text-cyan-300" />
        </div>

        <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>

        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-700">
              Price
            </p>

            <p className="mt-1 text-3xl font-semibold text-cyan-300">
              {price}
            </p>
          </div>

          <span
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
              selected
                ? "bg-cyan-400 text-slate-950"
                : "bg-white/[0.06] text-slate-300"
            }`}
          >
            {selected ? "Selected" : "Choose"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ============================================
   BENEFIT
============================================ */

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/[0.06]">
          <Check className="h-[17px] w-[17px] text-cyan-300" />
        </div>

        <p className="font-semibold text-white">{title}</p>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-600">{description}</p>
    </div>
  );
}

/* ============================================
   TRUST ITEM
============================================ */

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.06]">
          <Icon className="h-[19px] w-[19px] text-cyan-300" />
        </div>

        <div>
          <p className="font-semibold text-white">{title}</p>

          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}