"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Car,
} from "lucide-react";

import {
  addVehicle,
  vehicleExists,
} from "@/services/vehicle";

export default function AddVehiclePage() {
  const router = useRouter();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] =
    useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");
    async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !brand ||
      !model ||
      !vehicleNumber ||
      !year ||
      !color
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    const exists =
      await vehicleExists(vehicleNumber);

    if (exists) {
      setError(
        "Vehicle number already exists."
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await addVehicle({
          brand: brand.trim(),
          model: model.trim(),
          vehicle_number:
            vehicleNumber.toUpperCase().trim(),
          year: Number(year),
          color: color.trim(),
          nickname: nickname.trim(),
          phone:phone.trim(),
          whatsapp:whatsapp.trim(),
        });

      if (!result.success) {
        setError(
          result.error ??
            "Failed to add vehicle."
        );
        return;
      }

      setSuccess(
        "Vehicle added successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Header */}

        <div className="mb-10 flex items-center justify-between">

          <div>

            <button
              onClick={() => router.back()}
              className="mb-5 flex items-center gap-2 text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-4xl font-bold">
              Add Vehicle
            </h1>

            <p className="mt-2 text-zinc-500">
              Register a new vehicle in your Vehix garage.
            </p>

          </div>

          <div className="rounded-full bg-red-600 p-4">
            <Car size={30} />
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand *
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              placeholder="Honda, BMW, KTM..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Model *
            </label>

            <input
              type="text"
              value={model}
              onChange={(e) =>
                setModel(e.target.value)
              }
              placeholder="City, ZX6R, MT15..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Vehicle Number *
            </label>

            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="MH01AB1234"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 uppercase outline-none transition focus:border-red-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Year *
            </label>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              min="1900"
              max="2100"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Color *
            </label>

            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Red, Black, White..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nickname (Optional)
            </label>

            <input
              type="text"
              value={nickname}
              onChange={(e) =>
                setNickname(e.target.value)
              }
              placeholder="My Beast"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
  <label className="mb-2 block text-sm font-medium text-zinc-300">
    Phone Number
  </label>

  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="9876543210"
    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-600"
    required
  />
</div>
<div>
  <label className="mb-2 block text-sm font-medium text-zinc-300">
    WhatsApp Number
  </label>

  <input
    type="tel"
    value={whatsapp}
    onChange={(e) => setWhatsapp(e.target.value)}
    placeholder="9876543210"
    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-600"
    required
  />
</div>
          {error && (
            <div className="rounded-xl border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <div className="flex gap-4 pt-2">

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 rounded-xl border border-zinc-700 py-3 font-semibold transition hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : "Save Vehicle"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}