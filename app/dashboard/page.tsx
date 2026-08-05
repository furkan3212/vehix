"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Car,
  Plus,
  QrCode,
  MapPin,
  Shield,
  Wrench,
  FileText,
  Bell,
  ArrowRight,
  Sparkles,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getVehicles } from "@/services/vehicle";
import { Vehicle } from "@/types/vehicle";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [userName, setUserName] = useState("Owner");

  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }

    const result = await getVehicles();

    if (result.success && result.data) {
      setVehicles(result.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-6 text-lg text-zinc-400">
            Loading Dashboard...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[170px]" />

        <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* Hero */}

        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-2xl">

          <div className="relative overflow-hidden p-8 md:p-12">

            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-[120px]" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">

                  <Sparkles size={16} className="text-blue-400" />

                  <span className="text-sm text-blue-300">
                    Smart Vehicle Identity Network
                  </span>

                </div>

                <h1 className="text-4xl font-black leading-tight md:text-6xl">

                  Welcome Back,

                  <br />

                  <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    {userName}
                  </span>

                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">

                  Manage your vehicles, QR identities, parking,
                  documents and maintenance from one premium dashboard.

                </p>

              </div>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 transition hover:scale-105 hover:bg-red-500/20"
              >
                <LogOut size={20} />

                Logout
              </button>

            </div>

          </div>

        </div>

        {/* Stats Section Starts Below */}
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Vehicles */}

          <div className="group rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/40">

            <div className="flex items-center justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20">

                <Car className="text-blue-400" size={32} />

              </div>

              <ArrowRight
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                size={22}
              />

            </div>

            <h2 className="mt-8 text-5xl font-black">

              {vehicles.length}

            </h2>

            <p className="mt-3 text-zinc-400">
              Registered Vehicles
            </p>

          </div>

          {/* QR */}

          <div className="group rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-cyan-500/40">

            <div className="flex items-center justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20">

                <QrCode
                  className="text-cyan-400"
                  size={32}
                />

              </div>

              <ArrowRight
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                size={22}
              />

            </div>

            <h2 className="mt-8 text-5xl font-black">

              {vehicles.length}

            </h2>

            <p className="mt-3 text-zinc-400">

              Active QR Tags

            </p>

          </div>

          {/* Parking */}

          <div className="group rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-green-500/40">

            <div className="flex items-center justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">

                <MapPin
                  className="text-green-400"
                  size={32}
                />

              </div>

              <ArrowRight
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-green-400"
                size={22}
              />

            </div>

            <h2 className="mt-8 text-5xl font-black">

              --

            </h2>

            <p className="mt-3 text-zinc-400">

              Saved Parking

            </p>

          </div>

          {/* Security */}

          <div className="group rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-purple-500/40">

            <div className="flex items-center justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20">

                <Shield
                  className="text-purple-400"
                  size={32}
                />

              </div>

              <ArrowRight
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-purple-400"
                size={22}
              />

            </div>

            <h2 className="mt-8 text-5xl font-black">

              100%

            </h2>

            <p className="mt-3 text-zinc-400">

              Security Status

            </p>

          </div>

        </div>





        {/* Quick Actions */}

        <div className="mt-12">

          <h2 className="mb-6 text-3xl font-black">

            Quick Actions

          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <Link
              href="/add-vehicle"
              className="group rounded-[28px] border border-blue-500/20 bg-gradient-to-br from-blue-600 to-blue-800 p-8 transition hover:scale-[1.03]"
            >

              <Plus size={34} />

              <h3 className="mt-8 text-2xl font-bold">

                Add Vehicle

              </h3>

              <p className="mt-3 text-blue-100">

                Register a new vehicle with Vehix.

              </p>

            </Link>

            <Link
              href="/dashboard/profile"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:scale-[1.03]"
            >

              <Shield
                size={34}
                className="text-blue-400"
              />

              <h3 className="mt-8 text-2xl font-bold">

                My Profile

              </h3>

              <p className="mt-3 text-zinc-400">

                Privacy & emergency contacts.

              </p>

            </Link>

            <Link
              href="/dashboard/settings"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:scale-[1.03]"
            >

              <Wrench
                size={34}
                className="text-orange-400"
              />

              <h3 className="mt-8 text-2xl font-bold">

                Settings

              </h3>

              <p className="mt-3 text-zinc-400">

                Personalize your Vehix account.

              </p>

            </Link>

            <Link
              href="#"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:scale-[1.03]"
            >

              <Bell
                size={34}
                className="text-pink-400"
              />

              <h3 className="mt-8 text-2xl font-bold">

                Notifications

              </h3>

              <p className="mt-3 text-zinc-400">

                Coming soon...

              </p>

            </Link>

          </div>

        </div>
                {/* My Vehicles */}

        <div className="mt-14">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-black">

                My Vehicles

              </h2>

              <p className="mt-2 text-zinc-400">

                All vehicles connected to your Vehix account.

              </p>

            </div>

            <Link
              href="/add-vehicle"
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
            >
              + Add Vehicle
            </Link>

          </div>

          {vehicles.length === 0 ? (

            <div className="rounded-[32px] border border-dashed border-zinc-700 bg-zinc-900/40 p-16 text-center">

              <Car
                size={60}
                className="mx-auto text-zinc-600"
              />

              <h3 className="mt-6 text-3xl font-bold">

                No Vehicles Yet

              </h3>

              <p className="mt-3 text-zinc-500">

                Register your first vehicle to start using Vehix.

              </p>

              <Link
                href="/add-vehicle"
                className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
              >
                Register Vehicle
              </Link>

            </div>

          ) : (

            <div className="grid gap-8">

              {vehicles.map((vehicle) => (

                <div
                  key={vehicle.id}
                  className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl transition duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
                >

                  <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">

                    {/* Left */}

                    <div className="flex items-center gap-6">

                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/20">

                        <Car
                          size={40}
                          className="text-blue-400"
                        />

                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-3xl font-black">

                            {vehicle.vehicle_number}

                          </h3>

                          <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">

                            VERIFIED

                          </span>

                        </div>

                        <p className="mt-2 text-lg text-zinc-400">

                          {vehicle.brand} • {vehicle.model}

                        </p>

                        <p className="mt-1 text-zinc-500">

                          {vehicle.color}

                        </p>

                      </div>

                    </div>

                    {/* Right */}

                    <div className="grid grid-cols-2 gap-4 md:flex">

                      <Link
                        href={`/view-vehicle/${vehicle.id}`}
                        className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-center font-semibold transition hover:bg-blue-500/20"
                      >
                        View
                      </Link>

                      <Link
                        href={`/edit-vehicle/${vehicle.id}`}
                        className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-center font-semibold transition hover:bg-yellow-500/20"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/vehicle/${vehicle.id}/qr`}
                        className="rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-center font-semibold transition hover:bg-green-500/20"
                      >
                        QR Code
                      </Link>

                      <button
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-semibold transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  {/* Bottom Strip */}

                  <div className="grid grid-cols-2 border-t border-white/10 bg-black/20 md:grid-cols-4">

                    <div className="p-5 text-center">

                      <p className="text-xs uppercase tracking-wider text-zinc-500">

                        Brand

                      </p>

                      <p className="mt-2 font-semibold">

                        {vehicle.brand}

                      </p>

                    </div>

                    <div className="p-5 text-center">

                      <p className="text-xs uppercase tracking-wider text-zinc-500">

                        Model

                      </p>

                      <p className="mt-2 font-semibold">

                        {vehicle.model}

                      </p>

                    </div>

                    <div className="p-5 text-center">

                      <p className="text-xs uppercase tracking-wider text-zinc-500">

                        QR Status

                      </p>

                      <p className="mt-2 font-semibold text-green-400">

                        Active

                      </p>

                    </div>

                    <div className="p-5 text-center">

                      <p className="text-xs uppercase tracking-wider text-zinc-500">

                        Security

                      </p>

                      <p className="mt-2 font-semibold text-blue-400">

                        Protected

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
                {/* Premium Dashboard Widgets */}

        <div className="mt-14 grid gap-8 xl:grid-cols-2">

          {/* Smart Parking */}

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl">

            <div className="bg-gradient-to-r from-green-600/20 to-emerald-500/10 p-8">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-green-500/20 p-4">

                    <MapPin
                      size={34}
                      className="text-green-400"
                    />

                  </div>

                  <div>

                    <h2 className="text-3xl font-bold">

                      Smart Parking

                    </h2>

                    <p className="text-zinc-400">

                      Save and locate your vehicle instantly.

                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300">

                  Coming Soon

                </span>

              </div>

            </div>

            <div className="space-y-5 p-8">

              <button className="w-full rounded-2xl bg-green-600 py-4 text-lg font-bold transition hover:bg-green-700">

                📍 Save Parking Location

              </button>

              <button className="w-full rounded-2xl border border-green-500/30 bg-green-500/10 py-4 text-lg font-semibold transition hover:bg-green-500/20">

                🧭 Find My Vehicle

              </button>

            </div>

          </div>

          {/* Documents */}

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl">

            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/10 p-8">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-blue-500/20 p-4">

                    <FileText
                      size={34}
                      className="text-blue-400"
                    />

                  </div>

                  <div>

                    <h2 className="text-3xl font-bold">

                      Secure Documents

                    </h2>

                    <p className="text-zinc-400">

                      RC, Insurance, PUC & Licence.

                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300">

                  Owner Only

                </span>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 p-8">

              <div className="rounded-2xl bg-zinc-900/60 p-5">

                <p className="text-sm text-zinc-500">

                  Documents

                </p>

                <h3 className="mt-3 text-4xl font-black">

                  0

                </h3>

              </div>

              <div className="rounded-2xl bg-zinc-900/60 p-5">

                <p className="text-sm text-zinc-500">

                  Storage

                </p>

                <h3 className="mt-3 text-4xl font-black">

                  ---

                </h3>

              </div>

              <button className="col-span-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold transition hover:bg-blue-700">

                Upload Documents

              </button>

            </div>

          </div>

        </div>





        {/* Maintenance + Security */}

        <div className="mt-8 grid gap-8 xl:grid-cols-2">

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-orange-500/20 p-4">

                <Wrench
                  className="text-orange-400"
                  size={34}
                />

              </div>

              <div>

                <h2 className="text-3xl font-bold">

                  Maintenance

                </h2>

                <p className="text-zinc-400">

                  Track services and reminders.

                </p>

              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 p-8 text-center">

              <h3 className="text-2xl font-bold">

                No Services Added

              </h3>

              <p className="mt-3 text-zinc-500">

                Soon you'll be able to track
                oil changes, insurance,
                PUC and more.

              </p>

            </div>

          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-purple-500/20 p-4">

                <Shield
                  className="text-purple-400"
                  size={34}
                />

              </div>

              <div>

                <h2 className="text-3xl font-bold">

                  Account Security

                </h2>

                <p className="text-zinc-400">

                  Your Vehix account is protected.

                </p>

              </div>

            </div>

            <div className="mt-8 space-y-5">

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/60 p-5">

                <span>Email Verified</span>

                <span className="font-bold text-green-400">

                  ✓ Active

                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/60 p-5">

                <span>Profile Status</span>

                <span className="font-bold text-blue-400">

                  Completed

                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/60 p-5">

                <span>Vehicle Protection</span>

                <span className="font-bold text-green-400">

                  Protected

                </span>

              </div>

            </div>

          </div>

        </div>
                {/* Footer */}

        <div className="mt-14 rounded-[34px] border border-white/10 bg-gradient-to-r from-blue-700/20 via-blue-600/10 to-cyan-500/10 p-10 backdrop-blur-2xl">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">

                <Sparkles size={16} className="text-blue-400" />

                <span className="text-sm text-blue-300">
                  Vehix Premium Dashboard
                </span>

              </div>

              <h2 className="text-4xl font-black">

                One Platform.

                <br />

                Every Vehicle.

              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">

                Manage your vehicles, generate secure QR identities,
                protect your documents, save parking locations,
                monitor maintenance and keep everything connected
                from one powerful dashboard.

              </p>

            </div>

            <div className="grid gap-4">

              <Link
                href="/add-vehicle"
                className="rounded-2xl bg-blue-600 px-7 py-4 text-center font-bold transition hover:bg-blue-700"
              >
                Register New Vehicle
              </Link>

              <Link
                href="/dashboard/profile"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-center font-semibold transition hover:border-blue-500/30 hover:bg-white/10"
              >
                Manage Profile
              </Link>

            </div>

          </div>

          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid gap-6 md:grid-cols-4">

            <div>

              <h3 className="font-bold">
                Vehicles
              </h3>

              <p className="mt-2 text-zinc-500">
                {vehicles.length} Registered
              </p>

            </div>

            <div>

              <h3 className="font-bold">
                Security
              </h3>

              <p className="mt-2 text-green-400">
                Protected
              </p>

            </div>

            <div>

              <h3 className="font-bold">
                Platform
              </h3>

              <p className="mt-2 text-zinc-500">
                Next.js + Supabase
              </p>

            </div>

            <div>

              <h3 className="font-bold">
                Version
              </h3>

              <p className="mt-2 text-zinc-500">
                Vehix v1.0
              </p>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-8 text-center">

            <h3 className="text-3xl font-black tracking-widest">

              VEHIX

            </h3>

            <p className="mt-3 text-zinc-500">

              Smart Vehicle Identity Network

            </p>

            <p className="mt-8 text-sm text-zinc-600">

              © {new Date().getFullYear()} Vehix. All Rights Reserved.

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}