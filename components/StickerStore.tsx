"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import {
  ShieldCheck,
  Sparkles,
  Star,
  ArrowRight,
  Crown,
} from "lucide-react";

const products = [
  {
    id: "basic",
    name: "Basic QR Sticker",
    price: 299,
    badge: "Best Seller",
    description:
      "Premium waterproof QR sticker for everyday use.",
  },
  {
    id: "premium",
    name: "Premium QR Sticker",
    price: 499,
    badge: "Most Popular",
    description:
      "Scratch resistant premium finish with UV protection.",
  },
  {
    id: "metal",
    name: "Metal QR Plate",
    price: 899,
    badge: "Luxury",
    description:
      "Premium aluminium plate with engraved QR identity.",
  },
];

export default function StickerStore() {

  const [selectedProduct, setSelectedProduct] =
    useState("premium");

  return (

    <section
      id="qr-store"
      className="relative overflow-hidden bg-[#030712] py-32 text-white"
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[170px]" />

        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[190px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

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
          className="mx-auto max-w-4xl text-center"
        >

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-blue-400">

            QR STICKER STORE

          </span>

          <h2 className="mt-8 text-5xl font-black md:text-7xl">

            Design Your

            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

              {" "}Perfect QR

            </span>

          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-400">

            Choose your favourite sticker,
            customize it and order directly
            from Vehix.

          </p>

        </motion.div>

        {/* Products */}

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
                    {products.map((product, index) => (

          <motion.div
            key={product.id}
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
              duration: 0.5,
              delay: index * 0.12,
            }}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
            onClick={() => setSelectedProduct(product.id)}
            className={`group cursor-pointer overflow-hidden rounded-[34px] border p-8 backdrop-blur-3xl transition-all duration-500 ${
              selectedProduct === product.id
                ? "border-blue-500 bg-blue-500/10 shadow-[0_0_60px_rgba(37,99,235,0.25)]"
                : "border-white/10 bg-white/5 hover:border-blue-500/30"
            }`}
          >

            {/* Badge */}

            <div className="flex items-center justify-between">

              <span
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] ${
                  product.id === "premium"
                    ? "bg-blue-500/20 text-blue-400"
                    : product.id === "metal"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >

                {product.badge}

              </span>

              {product.id === "premium" && (

                <Star
                  size={22}
                  className="fill-blue-400 text-blue-400"
                />

              )}

              {product.id === "metal" && (

                <Crown
                  size={22}
                  className="text-yellow-400"
                />

              )}

              {product.id === "basic" && (

                <ShieldCheck
                  size={22}
                  className="text-green-400"
                />

              )}

            </div>

            {/* Product Preview */}

            <div className="mt-10 flex justify-center">

              <div
                className={`flex h-40 w-40 items-center justify-center rounded-3xl border ${
                  selectedProduct === product.id
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >

                <div className="text-center">

                  <div className="mx-auto h-20 w-20 rounded-xl bg-white" />

                  <p className="mt-4 text-sm font-semibold tracking-[0.3em] text-zinc-400">

                    VEHIX

                  </p>

                </div>

              </div>

            </div>

            {/* Content */}

            <h3 className="mt-10 text-3xl font-black">

              {product.name}

            </h3>

            <p className="mt-5 leading-8 text-zinc-400">

              {product.description}

            </p>

            <div className="mt-10 flex items-end justify-between">

              <div>

                <p className="text-sm text-zinc-500">

                  Starting From

                </p>

                <h4 className="mt-2 text-4xl font-black text-blue-400">

                  ₹{product.price}

                </h4>

              </div>

              <div
                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  selectedProduct === product.id
                    ? "bg-blue-600 text-white"
                    : "bg-white/10"
                }`}
              >

                {selectedProduct === product.id
                  ? "Selected"
                  : "Select"}

              </div>

            </div>

          </motion.div>

        ))}        </div>

        {/* Customizer */}

        <motion.div
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
            duration: 0.7,
          }}
          className="mt-24 rounded-[36px] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl"
        >

          <div className="grid gap-14 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <h3 className="text-4xl font-black">

                Customize Your Sticker

              </h3>

              <p className="mt-4 text-zinc-400">

                Select your preferred style before placing your
                order.

              </p>

              {/* Shape */}

              <div className="mt-10">

                <h4 className="mb-4 text-lg font-bold">

                  Sticker Shape

                </h4>

                <div className="grid grid-cols-2 gap-4">

                  {[
                    "Round",
                    "Square",
                    "Hexagon",
                    "Shield",
                  ].map((shape) => (

                    <button
                      key={shape}
                      className="rounded-2xl border border-white/10 bg-black/30 px-6 py-5 font-semibold transition hover:border-blue-500 hover:bg-blue-500/10"
                    >

                      {shape}

                    </button>

                  ))}

                </div>

              </div>

              {/* Color */}

              <div className="mt-10">

                <h4 className="mb-4 text-lg font-bold">

                  Sticker Color

                </h4>

                <div className="flex flex-wrap gap-4">

                  {[
                    {
                      name: "Black",
                      color: "bg-black",
                    },
                    {
                      name: "White",
                      color: "bg-white",
                    },
                    {
                      name: "Blue",
                      color: "bg-blue-500",
                    },
                    {
                      name: "Red",
                      color: "bg-red-500",
                    },
                    {
                      name: "Gold",
                      color: "bg-yellow-400",
                    },
                  ].map((item) => (

                    <button
                      key={item.name}
                      className="group flex items-center gap-3 rounded-full border border-white/10 px-4 py-3 transition hover:border-blue-500"
                    >

                      <span
                        className={`h-6 w-6 rounded-full ${item.color}`}
                      />

                      {item.name}

                    </button>

                  ))}

                </div>

              </div>

              {/* Finish */}

              <div className="mt-10">

                <h4 className="mb-4 text-lg font-bold">

                  Finish

                </h4>

                <div className="grid grid-cols-2 gap-4">

                  {[
                    "Matte",
                    "Gloss",
                    "Reflective",
                    "Carbon",
                  ].map((finish) => (

                    <button
                      key={finish}
                      className="rounded-2xl border border-white/10 bg-black/30 px-6 py-5 font-semibold transition hover:border-blue-500 hover:bg-blue-500/10"
                    >

                      {finish}

                    </button>

                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center justify-center">

              <div className="w-full max-w-md rounded-[34px] border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-white/5 to-cyan-500/10 p-8">

                <div className="text-center">

                  <Sparkles
                    size={36}
                    className="mx-auto text-blue-400"
                  />

                  <h3 className="mt-5 text-3xl font-black">

                    Live Preview

                  </h3>

                  <p className="mt-2 text-zinc-400">

                    Your selected design

                  </p>

                </div>

                <div className="mt-10 flex justify-center">

                  <div className="flex h-72 w-72 items-center justify-center rounded-[32px] border border-white bg-white shadow-2xl">

                    <div className="text-center">

                      <div className="mx-auto h-36 w-36 rounded-2xl bg-black" />

                      <p className="mt-6 text-xl font-black tracking-[0.4em] text-black">

                        VEHIX

                      </p>

                      <p className="mt-2 text-sm text-zinc-500">

                        Smart Vehicle Identity

                      </p>

                    </div>

                  </div>

                </div>

                <div className="mt-10 rounded-2xl bg-black/30 p-5 text-center">

                  <p className="text-sm text-zinc-500">

                    Selected Product

                  </p>

                  <h4 className="mt-2 text-2xl font-bold">

                    {products.find(
                      (p) => p.id === selectedProduct
                    )?.name}

                  </h4>

                </div>

                            </div>

            </div>

          </div>

        </motion.div>   

        {/* Pricing & CTA */}

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
          className="mt-16 rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 p-10 backdrop-blur-3xl"
        >

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-green-400">

                READY TO ORDER

              </span>

              <h2 className="mt-6 text-4xl font-black md:text-5xl">

                Premium QR Stickers

                <br />

                Built To Last.

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">

                Waterproof, weather-resistant and professionally
                manufactured for long-term outdoor use.
                Every sticker is printed with your unique
                Vehix QR identity.

              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-black/30 p-5">

                  ✅ Waterproof

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  ☀ UV Protected

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  🚚 Pan India Delivery

                </div>

                <div className="rounded-2xl bg-black/30 p-5">

                  🔒 Secure Checkout

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="rounded-[30px] border border-blue-500/20 bg-black/30 p-8">

              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">

                Starting From

              </p>

              <h2 className="mt-4 text-6xl font-black text-blue-400">

                ₹
                {products.find(
                  (p) => p.id === selectedProduct
                )?.price}

              </h2>

              <p className="mt-4 text-zinc-400">

                Includes premium QR sticker,
                secure digital identity setup
                and lifetime QR activation.

              </p>

              <button
                className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-5 text-lg font-bold transition hover:scale-[1.02]"
              >

                <Sparkles size={22} />

                Add To Cart

              </button>

              <button
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-5 text-lg font-semibold transition hover:border-blue-500/30 hover:bg-white/10"
              >

                Buy Now

                <ArrowRight size={20} />

              </button>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-zinc-500">

                <span>

                  🔒 Secure

                </span>

                <span>

                  ⚡ Fast Checkout

                </span>

                <span>

                  🇮🇳 Made In India

                </span>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
 );

}