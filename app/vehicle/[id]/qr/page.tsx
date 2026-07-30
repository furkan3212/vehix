"use client";

import { useEffect, useState, useRef } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Download,
  Printer,
  Car,
} from "lucide-react";

import QRCode from "react-qr-code";

import { getVehicle } from "@/services/vehicle";

import { Vehicle } from "@/types/vehicle";

export default function VehicleQRPage() {
  const router = useRouter();
  const params = useParams();

  const vehicleId = params.id as string;

  const qrRef = useRef<HTMLDivElement>(null);

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [loading, setLoading] =
    useState(true);
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

  const qrUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/vehicle/${vehicleId}`
      : "";

  function downloadQR() {
    if (!qrRef.current) return;

    const svg =
      qrRef.current.querySelector("svg");

    if (!svg) return;

    const svgData =
      new XMLSerializer().serializeToString(svg);

    const canvas =
      document.createElement("canvas");

    const ctx =
      canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      ctx?.drawImage(img, 0, 0, 600, 600);

      const png =
        canvas.toDataURL("image/png");

      const link =
        document.createElement("a");

      link.href = png;

      link.download =
        `${vehicle?.vehicle_number}-QR.png`;

      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(svgData);
  }

  function printQR() {
    window.print();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />

          <p className="mt-4 text-zinc-400">
            Loading QR...
          </p>

        </div>

      </main>
    );
  }

  if (!vehicle) return null;
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-8">

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
              Vehicle QR Code
            </h1>

            <p className="mt-2 text-zinc-500">
              Scan this QR code to verify the vehicle.
            </p>

          </div>

          <div className="rounded-full bg-red-600 p-4">
            <Car size={30} />
          </div>

        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

          <div className="flex flex-col items-center">

            <div
              ref={qrRef}
              className="rounded-2xl bg-white p-6 shadow-xl"
            >
              <QRCode
                value={qrUrl}
                size={260}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>

            <h2 className="mt-8 text-3xl font-bold">
              {vehicle.vehicle_number}
            </h2>

            <p className="mt-2 text-lg text-zinc-400">
              {vehicle.brand} • {vehicle.model}
            </p>

            <div className="mt-8 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-zinc-500">
                    Vehicle Number
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {vehicle.vehicle_number}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Brand
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {vehicle.brand}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Model
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {vehicle.model}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Year
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {vehicle.year}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Color
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {vehicle.color}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Nickname
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {vehicle.nickname || "—"}
                  </p>
                </div>

              </div>

            </div>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Scan this QR code with any smartphone camera to open the
              vehicle verification page instantly.
            </p>
            <div className="mt-10 flex w-full flex-col gap-4 md:flex-row">

              <button
                onClick={downloadQR}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
              >
                <Download size={18} />
                Download QR
              </button>

              <button
                onClick={printQR}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3 font-semibold transition hover:bg-zinc-700"
              >
                <Printer size={18} />
                Print QR
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 font-semibold transition hover:bg-zinc-800"
              >
                <ArrowLeft size={18} />
                Dashboard
              </button>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}