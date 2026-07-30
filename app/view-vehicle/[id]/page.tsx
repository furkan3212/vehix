"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Car,
  Pencil,
  Trash2,
  QrCode,
} from "lucide-react";

import {
  getVehicle,
  deleteVehicle,
} from "@/services/vehicle";

import { Vehicle } from "@/types/vehicle";

export default function ViewVehiclePage() {
  const router = useRouter();
  const params = useParams();

  const vehicleId = params.id as string;

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);
    async function loadVehicle() {
    try {
      setLoading(true);

      const result =
        await getVehicle(vehicleId);

      if (!result.success || !result.data) {
        router.replace("/dashboard");
        return;
      }

      setVehicle(result.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (vehicleId) {
      loadVehicle();
    }
  }, [vehicleId]);

  async function handleDelete() {
    if (!vehicle) return;

    const confirmDelete = window.confirm(
      "Delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      await deleteVehicle(vehicle.id);

      router.replace("/dashboard");
    } finally {
      setDeleting(false);
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

  if (!vehicle) return null;
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-8">

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
              Vehicle Details
            </h1>

            <p className="mt-2 text-zinc-500">
              View complete information about your vehicle.
            </p>

          </div>

          <div className="rounded-full bg-red-600 p-4">
            <Car size={30} />
          </div>

        </div>

        {/* Vehicle Card */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

          <div className="mb-8 border-b border-zinc-800 pb-6">

            <h2 className="text-3xl font-bold">
              {vehicle.brand}
            </h2>

            <p className="mt-2 text-lg text-zinc-400">
              {vehicle.model}
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-zinc-500">
                Vehicle Number
              </p>

              <p className="mt-2 text-xl font-semibold">
                {vehicle.vehicle_number}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Year
              </p>

              <p className="mt-2 text-xl font-semibold">
                {vehicle.year}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Color
              </p>

              <p className="mt-2 text-xl font-semibold">
                {vehicle.color}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Nickname
              </p>

              <p className="mt-2 text-xl font-semibold">
                {vehicle.nickname || "—"}
              </p>
            </div>

          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <button
              onClick={() =>
                router.push('/edit-vehicle/${vehicle.id}')
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              <Pencil size={18} />
              Edit Vehicle
            </button>

            <button
              onClick={() =>
                router.push('/vehicle/${vehicle.id}/qr')
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold transition hover:bg-green-700"
            >
              <QrCode size={18} />
              Generate QR
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={18} />

              {deleting
                ? "Deleting..."
                : "Delete Vehicle"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}