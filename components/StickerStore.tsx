"use client";

import { motion } from "framer-motion";
import {
  ChangeEvent,
  useState,
} from "react";
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
} from "lucide-react";

type ProductType =
  | "standard"
  | "design"
  | "custom";

type Design = {
  id: string;
  name: string;
  image: string;
};

const designs: Design[] = [
  {
    id: "design-01",
    name: "Classic Black",
    image: "/qr-store/design-01.jpg",
  },
  {
    id: "design-02",
    name: "Sport Blue",
    image: "/qr-store/design-02.jpg",
  },
  {
    id: "design-03",
    name: "Performance Red",
    image: "/qr-store/design-03.jpg",
  },
  {
    id: "design-04",
    name: "Stealth",
    image: "/qr-store/design-04.jpg",
  },
  {
    id: "design-05",
    name: "Carbon",
    image: "/qr-store/design-05.jpg",
  },
  {
    id: "design-06",
    name: "Premium",
    image: "/qr-store/design-06.jpg",
  },
];

const productPrices: Record<
  ProductType,
  number
> = {
  standard: 499,
  design: 599,
  custom: 699,
};

export default function StickerStore() {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>("standard");

  const [selectedDesign, setSelectedDesign] =
    useState<Design | null>(null);

  const [customFile, setCustomFile] =
    useState<File | null>(null);

  const [customPreview, setCustomPreview] =
    useState<string>("");

  const [quantity, setQuantity] =
    useState(1);

  const [uploadError, setUploadError] =
    useState("");

  const unitPrice =
    productPrices[selectedProduct];

  const totalPrice =
    unitPrice * quantity;

  function selectProduct(
    product: ProductType
  ) {
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

  function handleDesignSelect(
    design: Design
  ) {
    setSelectedProduct("design");
    setSelectedDesign(design);
  }

  function handleCustomUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    setUploadError("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Please upload a JPG, PNG or WEBP image."
      );
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError(
        "Image size must be 10 MB or less."
      );
      return;
    }

    setCustomFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setCustomPreview(previewUrl);
    setSelectedProduct("custom");
  }

  function removeCustomFile() {
    setCustomFile(null);
    setCustomPreview("");
    setUploadError("");
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(20, current + 1)
    );
  }

  function checkout() {
    if (
      selectedProduct === "design" &&
      !selectedDesign
    ) {
      alert(
        "Please select a VEHIX design first."
      );
      return;
    }

    if (
      selectedProduct === "custom" &&
      !customFile
    ) {
      alert(
        "Please upload your custom design first."
      );
      return;
    }

    const params =
      new URLSearchParams({
        product: selectedProduct,
        price: String(unitPrice),
        quantity: String(quantity),
      });

    if (selectedDesign) {
      params.set(
        "design",
        selectedDesign.id
      );
    }

    if (customFile) {
      params.set(
        "custom_file",
        customFile.name
      );
    }

    window.location.href =
      `/checkout?${params.toString()}`;
  }

  return (
    <section
      id="qr-store"
      className="relative overflow-hidden bg-[#030712] py-24 text-white md:py-32"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />

        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            <QrCode size={15} />
            VEHIX QR Store
          </span>

          <h2 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Choose Your
            <br />

            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              VEHIX Identity.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Choose a standard sticker, select a VEHIX
            design or upload your own design.
          </p>
        </motion.div>

        {/* PRODUCT CATEGORIES */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* STANDARD */}
          <ProductCard
            selected={
              selectedProduct ===
              "standard"
            }
            badge="Standard"
            title="Standard QR"
            price="₹499"
            description="Our clean and simple VEHIX QR sticker for everyday vehicle identity."
            image="/qr-store/standard.jpg"
            icon={ShieldCheck}
            onClick={() =>
              selectProduct(
                "standard"
              )
            }
          />

          {/* DESIGNS */}
          <ProductCard
            selected={
              selectedProduct ===
              "design"
            }
            badge="VEHIX Designs"
            title="Design QR"
            price="₹599"
            description="Choose from our collection of premium VEHIX sticker designs."
            image="/qr-store/design-cover.jpg"
            icon={Star}
            onClick={() =>
              selectProduct(
                "design"
              )
            }
            featured
          />

          {/* CUSTOM */}
          <ProductCard
            selected={
              selectedProduct ===
              "custom"
            }
            badge="Custom"
            title="Custom Design"
            price="₹699"
            description="Have your own design? Upload it and we'll create your customized VEHIX sticker."
            image="/qr-store/custom.jpg"
            icon={ImagePlus}
            onClick={() =>
              selectProduct(
                "custom"
              )
            }
          />
        </div>

        {/* VEHIX DESIGNS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-12"
        >
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
                ₹599
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Choose a VEHIX Design
              </h3>

              <p className="mt-2 text-sm text-zinc-600">
                Pick the design that matches your vehicle.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <Sparkles
                size={14}
                className="text-blue-400"
              />
              Premium VEHIX designs
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {designs.map((design) => {
              const selected =
                selectedDesign?.id ===
                design.id;

              return (
                <button
                  key={design.id}
                  type="button"
                  onClick={() =>
                    handleDesignSelect(
                      design
                    )
                  }
                  className={`group overflow-hidden rounded-2xl border text-left transition duration-300 hover:-translate-y-1 ${
                    selected
                      ? "border-blue-500 bg-blue-500/[0.08] shadow-xl shadow-blue-500/10"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20"
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-black/30">
                    <img
                      src={design.image}
                      alt={design.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {selected && (
                      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg">
                        <Check
                          size={16}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-bold">
                      {design.name}
                    </p>

                    <p className="mt-1 text-xs text-blue-400">
                      ₹599
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CUSTOM UPLOAD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]"
        >
          <div className="grid lg:grid-cols-2">
            {/* UPLOAD */}
            <div className="p-7 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-purple-400">
                <Upload size={14} />
                ₹699 Custom
              </span>

              <h3 className="mt-5 text-3xl font-black">
                Have Your Own Design?
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
                Upload your own image, artwork, logo or
                design and we'll create your customized
                VEHIX QR sticker.
              </p>

              <label className="mt-7 block cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleCustomUpload
                  }
                  className="hidden"
                />

                <div className="group flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 p-8 text-center transition hover:border-blue-500/40 hover:bg-blue-500/[0.03]">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 transition group-hover:scale-110">
                      <Upload
                        size={24}
                        className="text-blue-400"
                      />
                    </div>

                    <p className="mt-4 font-bold">
                      Upload your design
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      JPG, PNG or WEBP · Max 10 MB
                    </p>
                  </div>
                </div>
              </label>

              {uploadError && (
                <p className="mt-3 text-sm text-red-400">
                  {uploadError}
                </p>
              )}

              {customFile && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Check
                      size={18}
                      className="shrink-0 text-green-400"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {customFile.name}
                      </p>

                      <p className="text-xs text-zinc-600">
                        Ready for customization
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      removeCustomFile
                    }
                    className="rounded-lg p-2 text-zinc-600 transition hover:bg-white/5 hover:text-white"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}
            </div>

            {/* CUSTOM PREVIEW */}
            <div className="border-t border-white/10 bg-black/20 p-7 md:p-10 lg:border-l lg:border-t-0">
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                {customPreview ? (
                  <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                    <img
                      src={customPreview}
                      alt="Custom design preview"
                      className="max-h-[330px] w-full object-contain"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 text-center backdrop-blur">
                      <p className="text-xs font-bold text-white">
                        Your Custom Design
                      </p>

                      <p className="mt-1 text-[10px] text-zinc-400">
                        VEHIX QR sticker · ₹699
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                      <ImagePlus
                        size={28}
                        className="text-zinc-600"
                      />
                    </div>

                    <p className="mt-5 font-bold text-zinc-400">
                      Your design preview
                    </p>

                    <p className="mt-2 text-xs text-zinc-700">
                      Upload an image to see it here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ORDER SUMMARY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* BENEFITS */}
          <div className="rounded-[30px] border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
              Every VEHIX Sticker
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Built for the road.
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Benefit
                title="100% Waterproof"
                description="Designed to handle rain, washing and everyday outdoor conditions."
              />

              <Benefit
                title="Durable Finish"
                description="Made for real-world automotive use."
              />

              <Benefit
                title="Easy to Scan"
                description="Quick access to your VEHIX digital vehicle identity."
              />

              <Benefit
                title="Smart Identity"
                description="Connect your physical vehicle to your digital VEHIX profile."
              />
            </div>
          </div>

          {/* SUMMARY */}
          <div className="rounded-[30px] border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-cyan-500/[0.04] p-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
              Your Selection
            </p>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-black">
                  {selectedProduct ===
                    "standard" &&
                    "Standard QR Sticker"}

                  {selectedProduct ===
                    "design" &&
                    "VEHIX Design QR"}

                  {selectedProduct ===
                    "custom" &&
                    "Custom Design QR"}
                </p>

                {selectedDesign && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {selectedDesign.name}
                  </p>
                )}

                {customFile && (
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {customFile.name}
                  </p>
                )}
              </div>

              <p className="text-2xl font-black text-blue-400">
                ₹{unitPrice}
              </p>
            </div>

            {/* QUANTITY */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3">
              <span className="text-sm font-semibold text-zinc-400">
                Quantity
              </span>

              <div className="flex items-center overflow-hidden rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= 1
                  }
                  className="flex h-10 w-10 items-center justify-center text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                >
                  −
                </button>

                <span className="flex h-10 min-w-10 items-center justify-center border-x border-white/10 px-3 text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    quantity >= 20
                  }
                  className="flex h-10 w-10 items-center justify-center text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  Total
                </span>

                <span className="text-3xl font-black">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={checkout}
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-black text-white shadow-xl shadow-blue-600/20 transition hover:scale-[1.01] hover:shadow-blue-500/30"
            >
              Continue to Checkout

              <ArrowRight
                size={19}
                className="transition group-hover:translate-x-1"
              />
            </button>

            <p className="mt-4 text-center text-[10px] leading-5 text-zinc-700">
              Payment and order confirmation will happen at
              checkout.
            </p>
          </div>
        </motion.div>

        {/* TRUST */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <TrustItem
            icon={ShieldCheck}
            title="100% Waterproof"
            description="Made for everyday vehicle use."
          />

          <TrustItem
            icon={QrCode}
            title="VEHIX Digital Identity"
            description="Your QR connects to your vehicle profile."
          />

          <TrustItem
            icon={Sparkles}
            title="Made For Cars"
            description="Designed specifically for automotive use."
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
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[30px] border text-left transition duration-300 hover:-translate-y-1 ${
        selected
          ? "border-blue-500/60 bg-blue-500/[0.08] shadow-2xl shadow-blue-500/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/20"
      }`}
    >
      {featured && (
        <div className="absolute left-5 top-5 z-10 rounded-full bg-blue-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white">
          Most Popular
        </div>
      )}

      {selected && (
        <div className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
          <Check size={17} />
        </div>
      )}

      <div className="aspect-[4/3] overflow-hidden bg-black/30">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
            {badge}
          </span>

          <Icon
            size={19}
            className="text-blue-400"
          />
        </div>

        <h3 className="mt-5 text-2xl font-black">
          {title}
        </h3>

        <p className="mt-3 min-h-[72px] text-sm leading-6 text-zinc-500">
          {description}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
              Price
            </p>

            <p className="mt-1 text-3xl font-black text-blue-400">
              {price}
            </p>
          </div>

          <span
            className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
              selected
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-zinc-300"
            }`}
          >
            {selected
              ? "Selected"
              : "Choose"}
          </span>
        </div>
      </div>
    </button>
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
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
          <Check
            size={17}
            className="text-blue-400"
          />
        </div>

        <p className="font-bold">
          {title}
        </p>
      </div>

      <p className="mt-3 text-xs leading-5 text-zinc-600">
        {description}
      </p>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Icon
            size={19}
            className="text-blue-400"
          />
        </div>

        <div>
          <p className="font-bold">
            {title}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}