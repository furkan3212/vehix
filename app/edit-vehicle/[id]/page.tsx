"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Car,
} from "lucide-react";

import {
  getVehicle,
  updateVehicle,
} from "@/services/vehicle";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();

  const vehicleId = params.id as string;

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] =
    useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [nickname, setNickname] =
    useState("");
  const [phone, setPhone] = useState("");
const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");
    async function loadVehicle() {
    try {
      setLoading(true);

      const result =
        await getVehicle(vehicleId);

      if (!result.success || !result.data) {
        router.replace("/dashboard");
        return;
      }

      const vehicle = result.data;

      setBrand(vehicle.brand);
      setModel(vehicle.model);
      setVehicleNumber(
        vehicle.vehicle_number
      );
      setYear(vehicle.year.toString());
      setColor(vehicle.color);
      setNickname(vehicle.nickname ?? "");
      setPhone(vehicle.phone ?? "");
setWhatsapp(vehicle.whatsapp ?? "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (vehicleId) {
      loadVehicle();
    }
  }, [vehicleId]);

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

    try {
      setSaving(true);

      const result =
       await updateVehicle(vehicleId, {
  brand: brand.trim(),
  model: model.trim(),
  vehicle_number: vehicleNumber.trim(),
  year: Number(year),
  color: color.trim(),
  nickname: nickname.trim(),
  phone: phone.trim(),
  whatsapp: whatsapp.trim(),
});

      if (!result.success) {
        setError(
          result.error ??
            "Failed to update vehicle."
        );
        return;
      }

      setSuccess(
        "Vehicle updated successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />

          <p className="mt-5 text-zinc-400">
            Loading Vehicle...
          </p>

        </div>

      </main>
    );
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
              Edit Vehicle
            </h1>

            <p className="mt-2 text-zinc-500">
              Update your vehicle information.
            </p>

          </div>

          <div className="rounded-full bg-blue-600 p-4">
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
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
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
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
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
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 uppercase outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Year *
            </label>

            <input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              min="1900"
              max="2100"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Color *
            </label>

            <input
              type="text"
              value={color}
              onChange={(e) =>
                setColor(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nickname
            </label>

            <input
              type="text"
              value={nickname}
              onChange={(e) =>
                setNickname(e.target.value)
              }
              placeholder="Optional"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>
          <div>
  <label className="mb-2 block text-sm font-medium">
    Phone Number *
  </label>

  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-medium">
    WhatsApp Number *
  </label>

  <input
    type="tel"
    value={whatsapp}
    onChange={(e) => setWhatsapp(e.target.value)}
    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-blue-500"
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
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {saving
                ? "Updating..."
                : "Update Vehicle"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}