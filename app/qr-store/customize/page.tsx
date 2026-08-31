"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CheckCircle2,
  Loader2,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  Bike,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Vehicle = {
  id: string;
  user_id: string;
  vehicle_number: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  nickname: string | null;
  vehicle_type: string | null;
  photo_url: string | null;
};

const PRODUCT_DETAILS = {
  basic: {
    name: "Standard QR",
    price: 499,
    description:
      "A clean, durable Vehix QR identity sticker for everyday vehicle protection.",
  },
  design: {
    name: "Design QR",
    price: 599,
    description:
      "A premium Vehix QR sticker with a selected design.",
  },
  custom: {
    name: "Custom Design",
    price: 699,
    description:
      "A personalized Vehix QR sticker created around your design.",
  },
} as const;

function VehicleTypeIcon({
  type,
  size = 22,
}: {
  type?: string | null;
  size?: number;
}) {
  const value = (type || "").toLowerCase();

  if (
    value.includes("bike") ||
    value.includes("motorcycle") ||
    value.includes("scooter")
  ) {
    return <Bike size={size} />;
  }

  if (
    value.includes("truck") ||
    value.includes("commercial") ||
    value.includes("bus")
  ) {
    return <Truck size={size} />;
  }

  return <Car size={size} />;
}

function QRCustomizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId =
    searchParams.get("product") === "design"
      ? "design"
      : searchParams.get("product") === "custom"
        ? "custom"
        : "basic";

  const selectedDesign =
    searchParams.get("design") || "";

  const product = PRODUCT_DETAILS[productId];

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<string | null>(null);

  const [ownerName, setOwnerName] = useState("Vehicle Owner");

  const [loading, setLoading] = useState(true);
  const [loadingVehicles, setLoadingVehicles] =
    useState(true);

  const [error, setError] = useState("");
  const [showAddVehicle, setShowAddVehicle] =
    useState(false);

  const [addingVehicle, setAddingVehicle] =
    useState(false);

  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    nickname: "",
    vehicleType: "Car",
  });

  const selectedVehicle = useMemo(
    () =>
      vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId
      ) || null,
    [vehicles, selectedVehicleId]
  );

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace(
            `/login?redirect=${encodeURIComponent(
              `/qr-store/customize?product=${productId}`
            )}`
          );
          return;
        }

        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Vehicle Owner";

        setOwnerName(name);

        setLoadingVehicles(true);

        const { data, error: vehiclesError } =
          await supabase
            .from("vehicles")
            .select(
              `
                id,
                user_id,
                vehicle_number,
                brand,
                model,
                year,
                color,
                nickname,
                vehicle_type,
                photo_url
              `
            )
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            });

        if (vehiclesError) {
          console.error(
            "Vehicle loading error:",
            vehiclesError
          );

          setError(
            "Unable to load your vehicles. Please try again."
          );

          return;
        }

        setVehicles(data || []);

        if (data && data.length > 0) {
          setSelectedVehicleId(data[0].id);
        }
      } catch (err) {
        console.error(
          "QR customization page error:",
          err
        );

        setError(
          "Something went wrong while loading this page."
        );
      } finally {
        setLoading(false);
        setLoadingVehicles(false);
      }
    }

    loadPage();
  }, [productId, router]);

  const handleAddVehicle = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (addingVehicle) return;

    setError("");

    if (!newVehicle.vehicleNumber.trim()) {
      setError(
        "Please enter your vehicle registration number."
      );
      return;
    }

    if (!newVehicle.brand.trim()) {
      setError("Please enter your vehicle brand.");
      return;
    }

    if (!newVehicle.model.trim()) {
      setError("Please enter your vehicle model.");
      return;
    }

    try {
      setAddingVehicle(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/qr-store/customize?product=${productId}`
          )}`
        );
        return;
      }

      const { data, error: insertError } =
        await supabase
          .from("vehicles")
          .insert({
            user_id: user.id,
            vehicle_number:
              newVehicle.vehicleNumber
                .trim()
                .toUpperCase(),
            brand: newVehicle.brand.trim(),
            model: newVehicle.model.trim(),
            year: newVehicle.year
              ? Number(newVehicle.year)
              : null,
            color: newVehicle.color.trim() || null,
            nickname:
              newVehicle.nickname.trim() || null,
            vehicle_type:
              newVehicle.vehicleType || "Car",
            photo_url: null,
          })
          .select(
            `
              id,
              user_id,
              vehicle_number,
              brand,
              model,
              year,
              color,
              nickname,
              vehicle_type,
              photo_url
            `
          )
          .single();

      if (insertError) {
        console.error(
          "Vehicle insert error:",
          insertError
        );

        setError(
          insertError.message ||
            "Unable to add your vehicle."
        );

        return;
      }

      if (data) {
        setVehicles((current) => [
          data,
          ...current,
        ]);

        setSelectedVehicleId(data.id);

        setNewVehicle({
          vehicleNumber: "",
          brand: "",
          model: "",
          year: "",
          color: "",
          nickname: "",
          vehicleType: "Car",
        });

        setShowAddVehicle(false);
      }
    } catch (err) {
      console.error(
        "Add vehicle error:",
        err
      );

      setError(
        "Unable to add your vehicle. Please try again."
      );
    } finally {
      setAddingVehicle(false);
    }
  };

  const handleContinue = () => {
    setError("");

    if (!selectedVehicle) {
      setError(
        "Please select a vehicle before continuing."
      );
      return;
    }

    /*
     * We are intentionally NOT creating the order,
     * assigning a QR, or marking payment here yet.
     *
     * The next page will handle:
     * 1. Order creation
     * 2. Payment
     * 3. QR assignment
     * 4. Admin notification
     */

    const params = new URLSearchParams();

    params.set("product", productId);
    params.set(
      "vehicle",
      selectedVehicle.id
    );

    if (selectedDesign) {
      params.set("design", selectedDesign);
    }

    router.push(
      `/qr-store/checkout?${params.toString()}`
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020611] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <QrCode
              size={30}
              className="animate-pulse text-blue-400"
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              VEHIX
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Preparing your QR order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020611] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-280px] top-[80px] h-[600px] w-[600px] rounded-full bg-blue-600/[0.08] blur-[180px]" />

        <div className="absolute right-[-250px] top-[350px] h-[600px] w-[600px] rounded-full bg-cyan-500/[0.06] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.4) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#020611]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/qr-store")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.25)]">
              <QrCode
                size={21}
                className="text-white"
              />
            </div>

            <div className="text-left">
              <div className="text-sm font-black tracking-[0.22em] text-white">
                VEHIX
              </div>

              <div className="text-[8px] font-bold tracking-[0.25em] text-zinc-600">
                SMART VEHICLE IDENTITY
              </div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-zinc-500">
                Vehicle Owner
              </p>

              <p className="text-sm font-bold text-white">
                {ownerName}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-black text-blue-400">
              {ownerName
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-32 pt-8 sm:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/qr-store")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to QR Store
        </button>

        {/* Progress */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-black">
                1
              </div>

              <span className="hidden text-xs font-bold text-white sm:block">
                Vehicle
              </span>
            </div>

            <div className="mx-3 h-px w-12 bg-blue-500/40 sm:w-20" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-zinc-500">
                2
              </div>

              <span className="hidden text-xs font-bold text-zinc-600 sm:block">
                Payment
              </span>
            </div>

            <div className="mx-3 h-px w-12 bg-white/10 sm:w-20" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-zinc-500">
                3
              </div>

              <span className="hidden text-xs font-bold text-zinc-600 sm:block">
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
            <Sparkles size={13} />
            {product.name}
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            Choose your
            <span className="block bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">
              vehicle.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            Select the vehicle you want to connect with your
            Vehix QR identity. Your QR will be linked to this
            vehicle after your order is completed.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Vehicle section */}
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
                  Your Vehicles
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Select a vehicle
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddVehicle(true)
                }
                className="flex items-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-2.5 text-xs font-bold text-blue-400 transition hover:border-blue-400/50 hover:bg-blue-500/15"
              >
                <Plus size={16} />
                Add Vehicle
              </button>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300">
                <X
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            {loadingVehicles ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.025]">
                <Loader2
                  size={28}
                  className="animate-spin text-blue-400"
                />
              </div>
            ) : vehicles.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <Car
                    size={28}
                    className="text-blue-400"
                  />
                </div>

                <h3 className="mt-5 text-xl font-black">
                  No vehicles yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Add your vehicle first. Your Vehix QR
                  identity will be connected to it.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddVehicle(true)
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold shadow-[0_0_30px_rgba(37,99,235,0.2)] transition hover:bg-blue-500"
                >
                  <Plus size={17} />
                  Add My Vehicle
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {vehicles.map((vehicle) => {
                  const selected =
                    vehicle.id ===
                    selectedVehicleId;

                  return (
                    <button
                      type="button"
                      key={vehicle.id}
                      onClick={() =>
                        setSelectedVehicleId(
                          vehicle.id
                        )
                      }
                      className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 ${
                        selected
                          ? "border-blue-500/70 bg-blue-500/[0.08] shadow-[0_0_45px_rgba(37,99,235,0.12)]"
                          : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                      }`}
                    >
                      {selected && (
                        <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.35)]">
                          <Check size={15} />
                        </div>
                      )}

                      {/* Vehicle image */}
                      <div className="relative mb-5 flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050912]">
                        {vehicle.photo_url ? (
                          <img
                            src={
                              vehicle.photo_url
                            }
                            alt={
                              vehicle.nickname ||
                              `${vehicle.brand || ""} ${vehicle.model || ""}`
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="relative flex h-full w-full items-center justify-center">
                            <div className="absolute h-28 w-28 rounded-full bg-blue-600/10 blur-2xl" />

                            <VehicleTypeIcon
                              type={
                                vehicle.vehicle_type
                              }
                              size={52}
                            />

                            <div className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-zinc-500 backdrop-blur">
                              Vehix Vehicle
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pr-8">
                        <p className="text-lg font-black text-white">
                          {vehicle.nickname ||
                            `${vehicle.brand || "Vehicle"} ${
                              vehicle.model || ""
                            }`}
                        </p>

                        <p className="mt-1 text-sm font-bold uppercase tracking-wider text-blue-400">
                          {vehicle.vehicle_number ||
                            "Registration unavailable"}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                            Brand
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-zinc-300">
                            {vehicle.brand ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                            Model
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-zinc-300">
                            {vehicle.model ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                            Year
                          </p>

                          <p className="mt-1 text-xs font-semibold text-zinc-300">
                            {vehicle.year ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                            Colour
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-zinc-300">
                            {vehicle.color ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
                          selected
                            ? "text-blue-400"
                            : "text-zinc-600"
                        }`}
                      >
                        {selected ? (
                          <>
                            <CheckCircle2
                              size={14}
                            />
                            Selected for QR
                          </>
                        ) : (
                          <>
                            <Car size={14} />
                            Select this vehicle
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] shadow-2xl">
              <div className="border-b border-white/[0.07] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
                  Order Summary
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                    <QrCode
                      size={30}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-black">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Vehix Smart QR Identity
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Product
                  </span>

                  <span className="font-semibold text-white">
                    {product.name}
                  </span>
                </div>

                {selectedDesign && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      Design
                    </span>

                    <span className="max-w-[170px] truncate font-semibold text-white">
                      {selectedDesign}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Vehicle
                  </span>

                  <span className="max-w-[170px] truncate text-right font-semibold text-white">
                    {selectedVehicle
                      ? selectedVehicle.vehicle_number ||
                        `${selectedVehicle.brand || ""} ${
                          selectedVehicle.model || ""
                        }`
                      : "Not selected"}
                  </span>
                </div>

                <div className="my-5 h-px bg-white/[0.07]" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-zinc-600">
                      Total
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      ₹{product.price}
                    </p>
                  </div>

                  <span className="mb-1 text-xs text-zinc-600">
                    incl. applicable taxes
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!selectedVehicle}
                  onClick={handleContinue}
                  className="group mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black shadow-[0_0_35px_rgba(37,99,235,0.2)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-zinc-600 disabled:shadow-none"
                >
                  Continue to Payment
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-semibold text-zinc-600">
                  <ShieldCheck size={14} />
                  Secure Vehix checkout
                </div>
              </div>
            </div>

            {/* Protection cards */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <ShieldCheck
                  size={17}
                  className="text-blue-400"
                />

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Secure QR
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <CheckCircle2
                  size={17}
                  className="text-emerald-400"
                />

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Verified
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#07101d] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
                  New Vehicle
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Add your vehicle
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddVehicle(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleAddVehicle}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-400">
                  Registration Number
                </label>

                <input
                  value={
                    newVehicle.vehicleNumber
                  }
                  onChange={(event) =>
                    setNewVehicle({
                      ...newVehicle,
                      vehicleNumber:
                        event.target.value,
                    })
                  }
                  placeholder="MH 01 AB 1234"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    Brand
                  </label>

                  <input
                    value={newVehicle.brand}
                    onChange={(event) =>
                      setNewVehicle({
                        ...newVehicle,
                        brand:
                          event.target.value,
                      })
                    }
                    placeholder="BMW"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    Model
                  </label>

                  <input
                    value={newVehicle.model}
                    onChange={(event) =>
                      setNewVehicle({
                        ...newVehicle,
                        model:
                          event.target.value,
                      })
                    }
                    placeholder="3 Series"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    Year
                  </label>

                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(event) =>
                      setNewVehicle({
                        ...newVehicle,
                        year:
                          event.target.value,
                      })
                    }
                    placeholder="2025"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    Colour
                  </label>

                  <input
                    value={newVehicle.color}
                    onChange={(event) =>
                      setNewVehicle({
                        ...newVehicle,
                        color:
                          event.target.value,
                      })
                    }
                    placeholder="Black"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    Nickname
                  </label>

                  <input
                    value={
                      newVehicle.nickname
                    }
                    onChange={(event) =>
                      setNewVehicle({
                        ...newVehicle,
                        nickname:
                          event.target.value,
                      })
                    }
                    placeholder="My Beast"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    Vehicle Type
                  </label>

                  <select
                    value={
                      newVehicle.vehicleType
                    }
                    onChange={(event) =>
                      setNewVehicle({
                        ...newVehicle,
                        vehicleType:
                          event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500/60"
                  >
                    <option value="Car">
                      Car
                    </option>

                    <option value="Bike">
                      Bike
                    </option>

                    <option value="Scooter">
                      Scooter
                    </option>

                    <option value="Truck">
                      Truck
                    </option>

                    <option value="Bus">
                      Bus
                    </option>

                    <option value="Commercial">
                      Commercial
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={addingVehicle}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-black transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingVehicle ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Adding Vehicle...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Add Vehicle
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function QRCustomizePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#020611] text-white">
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <QrCode
                  size={30}
                  className="animate-pulse text-blue-400"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                  VEHIX
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Preparing your QR customization...
                </p>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <QRCustomizePageContent />
    </Suspense>
  );
}
