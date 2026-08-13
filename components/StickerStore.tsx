"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  ShoppingCart,
} from "lucide-react";
import QRCode from "react-qr-code";

type ProductId = "basic" | "premium" | "metal";
type Shape = "Round" | "Square" | "Hexagon" | "Shield";
type Finish = "Matte" | "Gloss" | "Reflective" | "Carbon";

type ColorOption = {
  name: string;
  value: string;
  text: string;
};

const products = [
  {
    id: "basic" as ProductId,
    name: "Basic QR Sticker",
    price: 299,
    badge: "Best Seller",
    description:
      "A clean, durable Vehix QR identity sticker designed for everyday use.",
    icon: ShieldCheck,
  },
  {
    id: "premium" as ProductId,
    name: "Premium QR Sticker",
    price: 499,
    badge: "Most Popular",
    description:
      "A premium weather-resistant QR identity sticker with a refined automotive finish.",
    icon: Star,
  },
  {
    id: "metal" as ProductId,
    name: "Metal QR Plate",
    price: 899,
    badge: "Luxury",
    description:
      "A premium metal-style Vehix identity plate designed for a more permanent installation.",
    icon: Crown,
  },
];

const shapes: Shape[] = [
  "Round",
  "Square",
  "Hexagon",
  "Shield",
];

const finishes: Finish[] = [
  "Matte",
  "Gloss",
  "Reflective",
  "Carbon",
];

const colors: ColorOption[] = [
  {
    name: "Black",
    value: "#050505",
    text: "text-white",
  },
  {
    name: "White",
    value: "#ffffff",
    text: "text-black",
  },
  {
    name: "Blue",
    value: "#2563eb",
    text: "text-white",
  },
  {
    name: "Red",
    value: "#dc2626",
    text: "text-white",
  },
  {
    name: "Gold",
    value: "#eab308",
    text: "text-black",
  },
];

const finishExtra: Record<Finish, number> = {
  Matte: 0,
  Gloss: 30,
  Reflective: 50,
  Carbon: 80,
};

const shapeExtra: Record<Shape, number> = {
  Round: 0,
  Square: 0,
  Hexagon: 30,
  Shield: 40,
};

export default function StickerStore() {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductId>("premium");

  const [selectedShape, setSelectedShape] =
    useState<Shape>("Shield");

  const [selectedColor, setSelectedColor] =
    useState<ColorOption>(colors[0]);

  const [selectedFinish, setSelectedFinish] =
    useState<Finish>("Matte");

  const [quantity, setQuantity] = useState(1);

  const [mobileCustomizerOpen, setMobileCustomizerOpen] =
    useState(false);

  const product = useMemo(
    () =>
      products.find(
        (item) => item.id === selectedProduct
      ) ?? products[1],
    [selectedProduct]
  );

  const unitPrice =
    product.price +
    shapeExtra[selectedShape] +
    finishExtra[selectedFinish];

  const totalPrice = unitPrice * quantity;

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
    const params = new URLSearchParams({
      product: selectedProduct,
      shape: selectedShape,
      color: selectedColor.name,
      finish: selectedFinish,
      quantity: String(quantity),
    });

    window.location.href = `/checkout?${params.toString()}`;
  }

  return (
    <section
      id="qr-store"
      className="relative overflow-hidden bg-[#030712] py-28 text-white md:py-36"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />

        <div className="absolute -right-40 bottom-0 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Header */}
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
            duration: 0.7,
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            <Sparkles size={15} />
            Vehix QR Store
          </span>

          <h2 className="mt-7 text-5xl font-black tracking-tight md:text-7xl">
            Give Your Vehicle
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              A Digital Identity.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
            Choose your Vehix QR identity tag, customize
            the design and get your vehicle ready for the
            connected future.
          </p>
        </motion.div>

        {/* Products */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {products.map((item, index) => {
            const Icon = item.icon;
            const selected =
              selectedProduct === item.id;

            return (
              <motion.button
                type="button"
                key={item.id}
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
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
                onClick={() =>
                  setSelectedProduct(item.id)
                }
                className={`group relative overflow-hidden rounded-[30px] border p-7 text-left transition-all duration-300 ${
                  selected
                    ? "border-blue-500/60 bg-blue-500/[0.08] shadow-[0_0_50px_rgba(37,99,235,0.15)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {selected && (
                  <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                    <Check size={16} />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${
                      item.id === "premium"
                        ? "bg-blue-500/15 text-blue-400"
                        : item.id === "metal"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-green-500/15 text-green-400"
                    }`}
                  >
                    {item.badge}
                  </span>

                  <Icon
                    size={21}
                    className={
                      item.id === "metal"
                        ? "text-yellow-400"
                        : item.id === "basic"
                        ? "text-green-400"
                        : "text-blue-400"
                    }
                  />
                </div>

                {/* Product visual */}
                <div className="mt-8 flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                  <div
                    className={`flex h-32 w-32 items-center justify-center border-4 ${
                      item.id === "metal"
                        ? "rounded-xl border-yellow-400/60"
                        : item.id === "basic"
                        ? "rounded-full border-white/20"
                        : "rounded-[28px] border-blue-500/50"
                    }`}
                  >
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-white p-2">
                      <div className="h-12 w-12 bg-black" />
                      <span className="mt-1 text-[7px] font-black tracking-[0.2em] text-black">
                        VEHIX
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  {item.name}
                </h3>

                <p className="mt-3 min-h-[56px] text-sm leading-7 text-zinc-400">
                  {item.description}
                </p>

                <div className="mt-7 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                      Starting from
                    </p>

                    <p className="mt-1 text-3xl font-black text-blue-400">
                      ₹{item.price}
                    </p>
                  </div>

                  <span
                    className={`rounded-xl px-4 py-2 text-xs font-bold ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-zinc-300"
                    }`}
                  >
                    {selected
                      ? "Selected"
                      : "Select"}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Customizer */}
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
            duration: 0.7,
          }}
          className="mt-10 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] backdrop-blur-2xl"
        >
          {/* Mobile customizer toggle */}
          <button
            type="button"
            onClick={() =>
              setMobileCustomizerOpen(
                !mobileCustomizerOpen
              )
            }
            className="flex w-full items-center justify-between border-b border-white/10 p-6 text-left lg:hidden"
          >
            <div>
              <p className="text-lg font-black">
                Customize Your QR
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Choose your design
              </p>
            </div>

            {mobileCustomizerOpen ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </button>

          <div
            className={`grid gap-10 p-7 md:p-10 lg:grid-cols-[1fr_420px] ${
              mobileCustomizerOpen
                ? "block"
                : "hidden lg:grid"
            }`}
          >
            {/* Options */}
            <div>
              <div className="hidden lg:block">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                  Customize
                </p>

                <h3 className="mt-3 text-4xl font-black">
                  Make It Yours.
                </h3>

                <p className="mt-3 max-w-xl text-zinc-400">
                  Select the style, color and finish
                  that fits your vehicle.
                </p>
              </div>

              {/* Shape */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-bold">
                    Shape
                  </h4>

                  <span className="text-sm text-blue-400">
                    {selectedShape}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {shapes.map((shape) => (
                    <button
                      type="button"
                      key={shape}
                      onClick={() =>
                        setSelectedShape(shape)
                      }
                      className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                        selectedShape === shape
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 bg-black/20 text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      {shape}

                      {shapeExtra[shape] > 0 && (
                        <span className="ml-1 text-[10px] text-zinc-500">
                          +₹{shapeExtra[shape]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-bold">
                    Color
                  </h4>

                  <span className="text-sm text-blue-400">
                    {selectedColor.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      type="button"
                      key={color.name}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                        selectedColor.name ===
                        color.name
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 bg-black/20 hover:border-white/20"
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-white/20"
                        style={{
                          backgroundColor:
                            color.value,
                        }}
                      />

                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-bold">
                    Finish
                  </h4>

                  <span className="text-sm text-blue-400">
                    {selectedFinish}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {finishes.map((finish) => (
                    <button
                      type="button"
                      key={finish}
                      onClick={() =>
                        setSelectedFinish(finish)
                      }
                      className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                        selectedFinish === finish
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 bg-black/20 text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      {finish}

                      {finishExtra[finish] > 0 && (
                        <span className="ml-1 text-[10px] text-zinc-500">
                          +₹{finishExtra[finish]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-8">
                <h4 className="mb-4 font-bold">
                  Quantity
                </h4>

                <div className="flex w-fit items-center rounded-2xl border border-white/10 bg-black/30">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-12 w-12 items-center justify-center text-zinc-400 transition hover:text-white disabled:opacity-30"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="flex h-12 min-w-12 items-center justify-center border-x border-white/10 px-4 font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= 20}
                    className="flex h-12 w-12 items-center justify-center text-zinc-400 transition hover:text-white disabled:opacity-30"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <p className="mt-2 text-xs text-zinc-600">
                  Maximum 20 units per order.
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-[30px] border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] via-black/20 to-cyan-500/[0.06] p-6 md:p-8">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                  Live Preview
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Your Vehix Tag
                </h3>
              </div>

              {/* Tag */}
              <div className="mt-8 flex justify-center">
                <motion.div
                  layout
                  className="relative flex h-72 w-72 items-center justify-center shadow-2xl"
                  style={{
                    backgroundColor:
                      selectedColor.value,
                    borderRadius:
                      selectedShape === "Round"
                        ? "9999px"
                        : selectedShape ===
                          "Square"
                        ? "24px"
                        : selectedShape ===
                          "Hexagon"
                        ? "28px"
                        : "38px 38px 55px 55px",
                    border:
                      selectedColor.name ===
                      "White"
                        ? "3px solid #27272a"
                        : "3px solid rgba(255,255,255,0.22)",
                    transform:
                      selectedFinish ===
                      "Carbon"
                        ? "perspective(700px) rotateX(2deg)"
                        : undefined,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="rounded-2xl p-4"
                      style={{
                        backgroundColor:
                          selectedColor.name ===
                          "White"
                            ? "#050505"
                            : "#ffffff",
                      }}
                    >
                      <QRCode
                        value="https://vehix.in"
                        size={120}
                        bgColor={
                          selectedColor.name ===
                          "White"
                            ? "#050505"
                            : "#ffffff"
                        }
                        fgColor={
                          selectedColor.name ===
                          "White"
                            ? "#ffffff"
                            : "#050505"
                        }
                      />
                    </div>

                    <p
                      className={`mt-4 text-xl font-black tracking-[0.35em] ${
                        selectedColor.name ===
                        "White"
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      VEHIX
                    </p>

                    <p
                      className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] ${
                        selectedColor.name ===
                        "White"
                          ? "text-zinc-500"
                          : "text-white/60"
                      }`}
                    >
                      Smart Vehicle Identity
                    </p>
                  </div>

                  {/* Finish overlay */}
                  {selectedFinish ===
                    "Reflective" && (
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                  )}

                  {selectedFinish ===
                    "Gloss" && (
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                  )}

                  {selectedFinish ===
                    "Carbon" && (
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:12px_12px]" />
                  )}
                </motion.div>
              </div>

              {/* Summary */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                      Product
                    </p>

                    <p className="mt-1 font-bold">
                      {product.name}
                    </p>
                  </div>

                  <p className="text-xl font-black text-blue-400">
                    ₹{unitPrice}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <span className="text-zinc-600">
                      Shape
                    </span>
                    <p className="mt-1 font-semibold">
                      {selectedShape}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <span className="text-zinc-600">
                      Finish
                    </span>
                    <p className="mt-1 font-semibold">
                      {selectedFinish}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <span className="text-zinc-600">
                      Color
                    </span>
                    <p className="mt-1 font-semibold">
                      {selectedColor.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <span className="text-zinc-600">
                      Quantity
                    </span>
                    <p className="mt-1 font-semibold">
                      {quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      Total
                    </span>

                    <span className="text-3xl font-black">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                type="button"
                onClick={checkout}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.01] hover:shadow-blue-500/30"
              >
                Buy Now
                <ArrowRight size={19} />
              </button>

              <button
                type="button"
                onClick={checkout}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] py-4 font-semibold text-zinc-200 transition hover:border-blue-500/30 hover:bg-white/[0.07]"
              >
                <ShoppingCart size={18} />
                Add To Cart
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom trust section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
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
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              title: "Weather Resistant",
              description:
                "Built for everyday outdoor use.",
            },
            {
              title: "Secure Identity",
              description:
                "Connected to your Vehix profile.",
            },
            {
              title: "Easy Activation",
              description:
                "Scan, activate and connect.",
            },
            {
              title: "Made For Vehicles",
              description:
                "Designed around the automotive experience.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="font-bold">
                {item.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Small note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            Final product appearance may vary slightly
            depending on the selected finish and
            manufacturing process.
          </p>
        </div>
      </div>
    </section>
  );
}