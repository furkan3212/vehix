"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Car,
  MapPin,
  Navigation,
  Trash2,
  LocateFixed,
  CheckCircle2,
} from "lucide-react";

import { getVehicles } from "@/services/vehicle";

import {
  saveVehicleLocation,
  getVehicleLocation,
  deleteVehicleLocation,
  VehicleLocation,
} from "@/services/location";

import { Vehicle } from "@/types/vehicle";

export default function VehicleLocationPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState("");

  const [location, setLocation] =
    useState<VehicleLocation | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadVehicles() {
    try {
      setLoading(true);
      setError("");

      const result = await getVehicles();

      if (!result.success) {
        setError(
          result.error ?? "Failed to load vehicles."
        );
        return;
      }

      const vehicleList = result.data ?? [];

      setVehicles(vehicleList);

      if (vehicleList.length > 0) {
        setSelectedVehicleId(vehicleList[0].id);
      }
    } catch (err) {
      console.error(err);

      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLocation(vehicleId: string) {
    if (!vehicleId) {
      setLocation(null);
      return;
    }

    setError("");
    setSuccess("");

    const result =
      await getVehicleLocation(vehicleId);

    if (!result.success) {
      setError(
        result.error ??
          "Failed to load saved location."
      );
      return;
    }

    setLocation(result.data);
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      loadLocation(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  function getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error(
            "Geolocation is not supported by this browser."
          )
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let message =
            "Unable to get your location.";

          if (error.code === 1) {
            message =
              "Location permission was denied. Please allow location access.";
          }

          if (error.code === 2) {
            message =
              "Your location could not be determined.";
          }

          if (error.code === 3) {
            message =
              "Location request timed out. Please try again.";
          }

          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }

  async function handleSaveLocation() {
    if (!selectedVehicleId) {
      setError("Please select a vehicle first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const currentLocation =
        await getCurrentLocation();

      const result =
        await saveVehicleLocation(
          selectedVehicleId,
          currentLocation.latitude,
          currentLocation.longitude
        );

      if (!result.success) {
        setError(
          result.error ??
            "Failed to save your parking location."
        );
        return;
      }

      setLocation(result.data);

      setSuccess(
        "Parking location saved successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save location."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLocation() {
    if (!selectedVehicleId) return;

    const confirmed = window.confirm(
      "Remove the saved parking location for this vehicle?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const result =
        await deleteVehicleLocation(
          selectedVehicleId
        );

      if (!result.success) {
        setError(
          result.error ??
            "Failed to remove location."
        );
        return;
      }

      setLocation(null);

      setSuccess(
        "Saved parking location removed."
      );
    } catch (err) {
      console.error(err);

      setError("Failed to remove location.");
    } finally {
      setDeleting(false);
    }
  }

  function openNavigation() {
    if (!location) return;

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${location.latitude},${location.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id === selectedVehicleId
    ) ?? null;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-5 text-zinc-400">
            Loading Location...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="mb-5 flex items-center gap-2 text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-green-600/20 p-4">
                <MapPin
                  size={32}
                  className="text-green-400"
                />
              </div>

              <div>
                <h1 className="text-4xl font-black">
                  Vehicle Location
                </h1>

                <p className="mt-2 text-zinc-500">
                  Save your parking location and
                  find your vehicle later.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* No Vehicles */}
        {vehicles.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <Car
              size={56}
              className="mx-auto text-zinc-600"
            />

            <h2 className="mt-6 text-2xl font-bold">
              No Vehicles Found
            </h2>

            <p className="mt-3 text-zinc-500">
              Add a vehicle before saving a parking
              location.
            </p>

            <button
              onClick={() =>
                router.push("/add-vehicle")
              }
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <>
            {/* Vehicle Selector */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <label className="mb-3 block text-sm font-semibold text-zinc-300">
                Select Vehicle
              </label>

              <select
                value={selectedVehicleId}
                onChange={(e) =>
                  setSelectedVehicleId(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-white outline-none transition focus:border-blue-500"
              >
                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.vehicle_number} —{" "}
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </option>
                ))}
              </select>

              {selectedVehicle && (
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black/40 p-5">
                  <div className="rounded-xl bg-blue-600/20 p-3">
                    <Car
                      size={25}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="font-bold">
                      {
                        selectedVehicle.vehicle_number
                      }
                    </p>

                    <p className="text-sm text-zinc-500">
                      {selectedVehicle.brand}{" "}
                      {selectedVehicle.model}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Save Location */}
            <div className="mt-8 rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-zinc-900 p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <LocateFixed
                      size={28}
                      className="text-green-400"
                    />

                    <h2 className="text-2xl font-bold">
                      Save Current Location
                    </h2>
                  </div>

                  <p className="mt-3 max-w-xl text-zinc-400">
                    Allow Vehix to access your current
                    location and save where you parked
                    your vehicle.
                  </p>
                </div>

                <button
                  onClick={handleSaveLocation}
                  disabled={saving}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-4 font-bold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MapPin size={20} />

                  {saving
                    ? "Saving..."
                    : "Save Current Location"}
                </button>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
                <CheckCircle2 size={20} />
                {success}
              </div>
            )}

            {/* Saved Location */}
            <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Saved Parking Location
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    {selectedVehicle
                      ? `${selectedVehicle.vehicle_number} — ${selectedVehicle.brand} ${selectedVehicle.model}`
                      : "Selected vehicle"}
                  </p>
                </div>

                {location && (
                  <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                    <CheckCircle2 size={16} />
                    Location Saved
                  </div>
                )}
              </div>

              {!location ? (
                <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-black/20 p-10 text-center">
                  <MapPin
                    size={48}
                    className="mx-auto text-zinc-600"
                  />

                  <h3 className="mt-5 text-xl font-bold">
                    No Parking Location Saved
                  </h3>

                  <p className="mt-2 text-zinc-500">
                    Save your current location when
                    you park your vehicle.
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-zinc-500">
                          Latitude
                        </p>

                        <p className="mt-2 font-semibold">
                          {location.latitude.toFixed(
                            6
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-zinc-500">
                          Longitude
                        </p>

                        <p className="mt-2 font-semibold">
                          {location.longitude.toFixed(
                            6
                          )}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm text-zinc-500">
                          Last Saved
                        </p>

                        <p className="mt-2 font-semibold">
                          {formatDate(
                            location.updated_at
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <button
                      onClick={openNavigation}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold transition hover:bg-blue-700"
                    >
                      <Navigation size={19} />
                      Navigate to Vehicle
                    </button>

                    <button
                      onClick={
                        handleDeleteLocation
                      }
                      disabled={deleting}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-4 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={19} />

                      {deleting
                        ? "Removing..."
                        : "Remove Location"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-7">
              <div className="flex gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Navigation
                    size={22}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <h3 className="font-bold">
                    Your parking location is private
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Your saved parking location belongs
                    to your account and is protected by
                    Vehix security policies. It is not
                    publicly displayed on your dashboard
                    or vehicle profile.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}