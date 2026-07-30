"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Car,
  Plus,
  LogOut,
  ShieldCheck,
  QrCode,
} from "lucide-react";

import {
  getVehicles,
  deleteVehicle,
} from "@/services/vehicle";

import {
  getCurrentUser,
  logoutUser,
} from "@/services/auth";

import { Vehicle } from "@/types/vehicle";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const username =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Driver";
    async function loadDashboard() {
    try {
      setLoading(true);

      const currentUser =
        await getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      const result =
        await getVehicles();

      if (result.success) {
        setVehicles(result.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Delete this vehicle?"
    );

    if (!confirmDelete) return;

    setDeletingId(id);

    await deleteVehicle(id);

    await loadDashboard();

    setDeletingId(null);
  }
  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">

          <div className="h-12 w-12 mx-auto rounded-full border-4 border-red-600 border-t-transparent animate-spin" />

          <p className="mt-5 text-zinc-400">
            Loading Dashboard...
          </p>

        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm text-zinc-400">
              Welcome Back 👋
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {username}
            </h1>

            <p className="mt-2 text-zinc-500">
              Manage all your vehicles from one place.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                router.push("/add-vehicle")
              }
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
            >
              <Plus size={20} />
              Add Vehicle
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 transition hover:bg-zinc-900"
            >
              <LogOut size={20} />
              Logout
            </button>

          </div>

        </div>

        {/* Stats */}

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <Car
              className="text-red-500"
              size={28}
            />

            <h2 className="mt-5 text-4xl font-bold">
              {vehicles.length}
            </h2>

            <p className="mt-2 text-zinc-400">
              Total Vehicles
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <ShieldCheck
              className="text-green-500"
              size={28}
            />

            <h2 className="mt-5 text-4xl font-bold">
              {vehicles.length}
            </h2>

            <p className="mt-2 text-zinc-400">
              Verified Vehicles
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <QrCode
              className="text-blue-500"
              size={28}
            />

            <h2 className="mt-5 text-4xl font-bold">
              {vehicles.length}
            </h2>

            <p className="mt-2 text-zinc-400">
              QR Codes
            </p>

          </div>

        </div>
        {/* Your Garage */}

        <div className="mt-12">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Your Garage
            </h2>

            <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
              {vehicles.length} Vehicle
              {vehicles.length !== 1 ? "s" : ""}
            </span>

          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 py-16 text-center">

              <Car
                size={60}
                className="mx-auto text-zinc-600"
              />

              <h3 className="mt-6 text-2xl font-semibold">
                No Vehicles Found
              </h3>

              <p className="mt-3 text-zinc-500">
                Add your first vehicle to start using Vehix.
              </p>

              <button
                onClick={() =>
                  router.push("/add-vehicle")
                }
                className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
              >
                Add First Vehicle
              </button>

            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {vehicles.map((vehicle) => (

                <div
                  key={vehicle.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-red-600 hover:shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-2xl font-bold">
                        {vehicle.brand}
                      </h3>

                      <p className="text-zinc-400">
                        {vehicle.model}
                      </p>

                    </div>

                    <Car
                      size={34}
                      className="text-red-500"
                    />

                  </div>

                  <div className="mt-6 space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-zinc-500">
                        Number
                      </span>

                      <span className="font-medium">
                        {vehicle.vehicle_number}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-500">
                        Year
                      </span>

                      <span>{vehicle.year}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-500">
                        Color
                      </span>

                      <span>{vehicle.color}</span>
                    </div>

                    {vehicle.nickname && (
                      <div className="flex justify-between">

                        <span className="text-zinc-500">
                          Nickname
                        </span>

                        <span>
                          {vehicle.nickname}
                        </span>

                      </div>
                    )}

                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        router.push(`/view-vehicle/${vehicle.id}`)
                      }
                      className="rounded-xl bg-zinc-800 py-3 font-medium transition hover:bg-zinc-700"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/edit-vehicle/${vehicle.id}`)
                      }
                      className="rounded-xl bg-blue-600 py-3 font-medium transition hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/vehicle/${vehicle.id}/qr`)
                      }
                      className="rounded-xl bg-green-600 py-3 font-medium transition hover:bg-green-700"
                    >
                      QR Code
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(vehicle.id)
                      }
                      disabled={deletingId === vehicle.id}
                      className="rounded-xl bg-red-600 py-3 font-medium transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === vehicle.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}