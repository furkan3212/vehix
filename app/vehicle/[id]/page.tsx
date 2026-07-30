"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  ShieldCheck,
  Car,
  Phone,
  MessageCircle,
} from "lucide-react";

import { getPublicVehicle } from "@/services/vehicle";
import { Vehicle } from "@/types/vehicle";

export default function VehicleVerificationPage() {
  const params = useParams();

  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  async function loadVehicle() {
    try {
      setLoading(true);

      const result = await getPublicVehicle(vehicleId);

      if (!result.success || !result.data) {
        setNotFound(true);
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />

          <p className="mt-6 text-zinc-400 text-lg">
            Verifying Vehicle...
          </p>

        </div>

      </main>
    );
  }

  if (notFound || !vehicle) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">

        <div className="max-w-md rounded-3xl border border-red-600/30 bg-zinc-900 p-8 text-center">

          <h1 className="text-3xl font-bold text-red-500">
            Vehicle Not Found
          </h1>

          <p className="mt-4 text-zinc-400">
            This QR Code is not registered with Vehix.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-4xl px-6 py-10">

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                    {/* Header */}

          <div className="border-b border-zinc-800 bg-gradient-to-r from-red-700 to-red-500 px-8 py-10 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur">

              <ShieldCheck size={42} />

            </div>

            <h1 className="mt-6 text-4xl font-bold">
              Verified Vehicle
            </h1>

            <p className="mt-3 text-red-100">
              This vehicle has been successfully verified by Vehix.
            </p>

          </div>

          {/* Vehicle Number */}

          <div className="px-8 pt-10 text-center">

            <div className="inline-block rounded-2xl border border-zinc-700 bg-zinc-950 px-8 py-6">

              <h2 className="text-4xl font-bold tracking-widest">
                {vehicle.vehicle_number}
              </h2>

              <p className="mt-3 text-lg text-zinc-400">
                {vehicle.brand} • {vehicle.model}
              </p>

            </div>

          </div>

          {/* Vehicle Details */}

          <div className="grid gap-6 px-8 py-10 md:grid-cols-2">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Brand
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {vehicle.brand}
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Model
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {vehicle.model}
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Vehicle Number
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {vehicle.vehicle_number}
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Color
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {vehicle.color}
              </p>

            </div>

          </div>

          {/* Contact Owner */}

          <div className="mx-8 rounded-3xl border border-red-600/20 bg-red-600/5 p-8">

            <h2 className="text-2xl font-bold">
              Contact Owner
            </h2>

            <p className="mt-3 text-zinc-400">
              If you've found this vehicle or need to contact its owner,
              use one of the options below.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <a
                href={`tel:${vehicle.phone}`}
                className="flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 font-semibold transition hover:bg-red-700"
              >
                <Phone size={20} />
                Call Owner
              </a>

              <a
                href={`https://wa.me/${vehicle.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 font-semibold transition hover:bg-green-700"
              >
                <MessageCircle size={20} />
                WhatsApp Owner
              </a>

            </div>

          </div>
                  {/* Verification Status */}

          <div className="mx-8 mt-10 rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600">

              <ShieldCheck size={32} />

            </div>

            <h3 className="mt-6 text-2xl font-bold text-green-400">
              Vehicle Successfully Verified
            </h3>

            <p className="mt-3 text-zinc-300">
              This vehicle is officially registered on the Vehix platform.
              The QR code is authentic and the information displayed has been
              verified.
            </p>

          </div>

          {/* Safety Notice */}

          <div className="mx-8 mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h3 className="text-xl font-semibold">
              Important Notice
            </h3>

            <p className="mt-4 leading-7 text-zinc-400">
              If you found this vehicle abandoned or involved in an emergency,
              please contact the owner using the buttons above. If the situation
              requires immediate assistance, contact your local emergency
              services.
            </p>

          </div>

          {/* Footer */}

          <div className="mt-12 border-t border-zinc-800 px-8 py-10 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600">

              <Car size={28} />

            </div>

            <h2 className="text-3xl font-bold tracking-wider">
              VEHIX
            </h2>

            <p className="mt-3 text-zinc-400">
              Smart Vehicle Identity Network
            </p>

            <p className="mt-6 text-sm text-zinc-500">
              Verify • Connect • Protect
            </p>

            <div className="mt-8 border-t border-zinc-800 pt-6">

              <p className="text-xs tracking-wide text-zinc-600">
                © {new Date().getFullYear()} Vehix. All Rights Reserved.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}