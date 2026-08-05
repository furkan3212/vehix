"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  ShieldCheck,
  Car,
  Phone,
  MessageCircle,
  MapPin,
  TriangleAlert,
  MessageSquare,
  CheckCircle2,
  BadgeCheck,
  Navigation,
  Siren,
  HeartHandshake,
} from "lucide-react";

import { getPublicVehicle } from "@/services/vehicle";
import { Vehicle } from "@/types/vehicle";

export default function VehicleVerificationPage() {
  const params = useParams();

  const vehicleId = params.id as string;

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  async function loadVehicle() {
    try {
      setLoading(true);

      const result =
        await getPublicVehicle(vehicleId);

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

  async function shareLocation() {
    if (!vehicle) return;

    if (!navigator.geolocation) {
      alert("Location is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const message =
          `Hello,\n\n` +
          `I found your vehicle.\n\n` +
          `My Location:\n` +
          `https://maps.google.com/?q=${lat},${lng}\n\n` +
          `Sent using Vehix.`;

        window.open(
          `https://wa.me/${vehicle.whatsapp}?text=${encodeURIComponent(
            message
          )}`,
          "_blank"
        );
      },
      () => {
        alert(
          "Unable to fetch your location."
        );
      }
    );
  }

  function foundVehicle() {
    if (!vehicle) return;

    const message =
      `Hello,\n\n` +
      `I found your vehicle.\n` +
      `Please contact me.\n\n` +
      `Sent via Vehix.`;

    window.open(
      `https://wa.me/${vehicle.whatsapp}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black">

        <div className="text-center">

          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-red-600 border-t-transparent"/>

          <p className="mt-6 text-lg text-zinc-400">
            Verifying Vehicle...
          </p>

        </div>

      </main>
    );
  }

  if (notFound || !vehicle) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">

        <div className="max-w-lg rounded-3xl border border-red-600/30 bg-zinc-900 p-10 text-center">

          <TriangleAlert
            size={70}
            className="mx-auto text-red-500"
          />

          <h1 className="mt-6 text-4xl font-bold text-red-500">
            Vehicle Not Registered
          </h1>

          <p className="mt-5 text-zinc-400 leading-7">
            This QR Code isn't registered with
            Vehix or may have been removed.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white">

      <div className="mx-auto max-w-5xl px-5 py-10">
        {/* Hero */}

<div className="overflow-hidden rounded-[32px] border border-red-600/20 bg-gradient-to-br from-red-700 via-red-600 to-red-500 shadow-[0_0_80px_rgba(220,38,38,0.25)]">

  <div className="px-8 py-10 md:px-12">

    <div className="flex flex-col items-center text-center">

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl ring-4 ring-white/20">

        <ShieldCheck
          size={54}
          className="text-white"
        />

      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest">

        <BadgeCheck size={18} />

        Verified by Vehix

      </div>

      <h1 className="mt-6 text-5xl font-black tracking-wide">

        {vehicle.vehicle_number}

      </h1>

      <p className="mt-4 text-xl text-red-100">

        {vehicle.brand} • {vehicle.model}

      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">

        <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold">

          ✓ Registered

        </span>

        <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">

          🔒 Privacy Protected

        </span>

        <span className="rounded-full bg-black/30 px-4 py-2 text-sm font-semibold">

          🚗 Authentic QR

        </span>

      </div>

    </div>

  </div>

</div>

{/* Vehicle Card */}

<div className="mt-10 rounded-[30px] border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

  <div className="mb-8 flex items-center gap-4">

    <div className="rounded-2xl bg-red-600 p-4">

      <Car size={30} />

    </div>

    <div>

      <h2 className="text-3xl font-bold">

        Vehicle Information

      </h2>

      <p className="text-zinc-400">

        Official details verified by Vehix.

      </p>

    </div>

  </div>

  <div className="grid gap-6 md:grid-cols-2">

    <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800">

      <p className="text-sm uppercase tracking-wider text-zinc-500">

        Brand

      </p>

      <p className="mt-3 text-2xl font-bold">

        {vehicle.brand}

      </p>

    </div>

    <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800">

      <p className="text-sm uppercase tracking-wider text-zinc-500">

        Model

      </p>

      <p className="mt-3 text-2xl font-bold">

        {vehicle.model}

      </p>

    </div>

    <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800">

      <p className="text-sm uppercase tracking-wider text-zinc-500">

        Registration Number

      </p>

      <p className="mt-3 text-2xl font-bold tracking-wider">

        {vehicle.vehicle_number}

      </p>

    </div>

    <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800">

      <p className="text-sm uppercase tracking-wider text-zinc-500">

        Vehicle Color

      </p>

      <p className="mt-3 text-2xl font-bold">

        {vehicle.color}

      </p>

    </div>

    {vehicle.nickname && (

      <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800 md:col-span-2">

        <p className="text-sm uppercase tracking-wider text-zinc-500">

          Nickname

        </p>

        <p className="mt-3 text-2xl font-bold">

          {vehicle.nickname}

        </p>

      </div>

    )}

  </div>

</div>
{/* Quick Actions */}

<div className="mt-10 rounded-[30px] border border-red-600/20 bg-gradient-to-br from-red-600/10 to-zinc-900 p-8">

  <div className="text-center">

    <h2 className="text-3xl font-bold">
      Need to reach the owner?
    </h2>

    <p className="mt-3 text-zinc-400">
      Choose the quickest option below.
    </p>

  </div>

  <div className="mt-8 grid gap-5 md:grid-cols-2">

    {/* Call */}

    <a
      href={`tel:${vehicle.phone}`}
      className="group flex items-center gap-5 rounded-2xl border border-red-500/30 bg-red-600 p-6 transition duration-300 hover:scale-[1.03] hover:bg-red-700"
    >

      <Phone size={34} />

      <div>

        <h3 className="text-xl font-bold">
          Call Owner
        </h3>

        <p className="text-red-100">
          Direct phone call
        </p>

      </div>

    </a>

    {/* WhatsApp */}

    <a
      href={`https://wa.me/${vehicle.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-5 rounded-2xl border border-green-500/30 bg-green-600 p-6 transition duration-300 hover:scale-[1.03] hover:bg-green-700"
    >

      <MessageCircle size={34} />

      <div>

        <h3 className="text-xl font-bold">
          WhatsApp
        </h3>

        <p className="text-green-100">
          Chat instantly
        </p>

      </div>

    </a>

    {/* SMS */}

    <a
      href={`sms:${vehicle.phone}`}
      className="group flex items-center gap-5 rounded-2xl border border-blue-500/30 bg-blue-600 p-6 transition duration-300 hover:scale-[1.03] hover:bg-blue-700"
    >

      <MessageSquare size={34} />

      <div>

        <h3 className="text-xl font-bold">
          Send SMS
        </h3>

        <p className="text-blue-100">
          Send a quick text
        </p>

      </div>

    </a>

    {/* Share Location */}

    <button
      onClick={shareLocation}
      className="group flex items-center gap-5 rounded-2xl border border-orange-500/30 bg-orange-500 p-6 text-left transition duration-300 hover:scale-[1.03] hover:bg-orange-600"
    >

      <Navigation size={34} />

      <div>

        <h3 className="text-xl font-bold">
          Share My Location
        </h3>

        <p className="text-orange-100">
          Send your live location
        </p>

      </div>

    </button>

    {/* Found Vehicle */}

    <button
      onClick={foundVehicle}
      className="group flex items-center gap-5 rounded-2xl border border-pink-500/30 bg-pink-600 p-6 text-left transition duration-300 hover:scale-[1.03] hover:bg-pink-700"
    >

      <HeartHandshake size={34} />

      <div>

        <h3 className="text-xl font-bold">
          I Found This Vehicle
        </h3>

        <p className="text-pink-100">
          Notify the owner instantly
        </p>

      </div>

    </button>

    {/* Emergency */}

    <a
      href={`tel:${vehicle.phone}`}
      className="group flex items-center gap-5 rounded-2xl border border-yellow-500/30 bg-yellow-500 p-6 text-black transition duration-300 hover:scale-[1.03] hover:bg-yellow-400"
    >

      <Siren size={34} />

      <div>

        <h3 className="text-xl font-bold">
          Emergency Contact
        </h3>

        <p>
          Contact immediately
        </p>

      </div>

    </a>

  </div>

</div>

{/* Trust Banner */}

<div className="mt-10 rounded-3xl border border-green-500/20 bg-green-500/10 p-8">

  <div className="flex flex-col items-center text-center">

    <CheckCircle2
      size={60}
      className="text-green-500"
    />

    <h2 className="mt-6 text-3xl font-bold text-green-400">

      Vehicle Successfully Verified

    </h2>

    <p className="mt-4 max-w-2xl leading-8 text-zinc-300">

      This vehicle is officially registered on the
      Vehix Smart Vehicle Identity Network.

      The QR Code has been authenticated and the
      owner has verified this vehicle.

    </p>

  </div>

</div>
{/* Safety Notice */}

<div className="mt-10 rounded-[30px] border border-zinc-800 bg-zinc-900 p-8">

  <div className="flex items-center gap-4">

    <div className="rounded-2xl bg-yellow-500 p-4">

      <TriangleAlert
        size={30}
        className="text-black"
      />

    </div>

    <div>

      <h2 className="text-3xl font-bold">
        Safety Notice
      </h2>

      <p className="text-zinc-400">
        If you've found this vehicle, please follow these guidelines.
      </p>

    </div>

  </div>

  <div className="mt-8 space-y-5">

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      ✅ Contact the owner using one of the options above before moving the vehicle.
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      📍 If the vehicle is blocking traffic or parked in an unsafe place,
      share your location with the owner.
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      🚨 If the vehicle has been involved in an accident,
      contact your local emergency services immediately.
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      ❤️ Vehix protects owner privacy while making it easy to reconnect
      owners with their vehicles.
    </div>

  </div>

</div>

{/* Powered By */}

<div className="mt-10 rounded-[30px] border border-red-600/20 bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-10 text-center shadow-[0_0_60px_rgba(220,38,38,0.25)]">

  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur">

    <Car size={48} />

  </div>

  <h2 className="mt-6 text-4xl font-black tracking-widest">

    VEHIX

  </h2>

  <p className="mt-4 text-lg text-red-100">

    Smart Vehicle Identity Network

  </p>

  <div className="mt-8 flex flex-wrap justify-center gap-3">

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Scan
    </span>

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Verify
    </span>

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Connect
    </span>

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Protect
    </span>

  </div>

  <div className="mt-8 border-t border-white/20 pt-8">

    <p className="text-sm text-red-100">

      This vehicle is protected by the Vehix Smart Vehicle Identity Network.

    </p>

    <p className="mt-4 text-xs tracking-widest text-red-200">

      © {new Date().getFullYear()} VEHIX • ALL RIGHTS RESERVED

    </p>

  </div>

</div>

</div>

</main>
);
}