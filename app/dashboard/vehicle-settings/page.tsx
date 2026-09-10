"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Car,
  Check,
  ChevronDown,
  Eye,
  FileCheck2,
  Gauge,
  Globe2,
  HeartPulse,
  History,
  Lock,
  MapPin,
  MessageCircle,
  QrCode,
  Save,
  ScanLine,
  Share2,
  Shield,
  ShieldAlert,
  Settings2,
  Wrench,
} from "lucide-react";

import { getVehicles } from "@/services/vehicle";
import {
  ensureVehicleFeatureSettings,
  updateVehicleFeatureSetting,
  type VehicleFeatureKey,
  type VehicleFeatureSettings,
} from "@/services/vehicle-feature-settings";
import { type Vehicle } from "@/types/vehicle";

type FeatureGroup = {
  title: string;
  description: string;
  features: {
    key: VehicleFeatureKey;
    title: string;
    description: string;
    icon: React.ElementType;
    recommended?: boolean;
  }[];
};

const featureGroups: FeatureGroup[] = [
  {
    title: "Vehicle Identity",
    description:
      "Control the core information that represents your vehicle through Vehix.",
    features: [
      {
        key: "digital_identity",
        title: "Digital Vehicle Identity",
        description:
          "Enable your vehicle's official Vehix identity.",
        icon: QrCode,
        recommended: true,
      },
      {
        key: "public_vehicle_page",
        title: "Public Vehicle Page",
        description:
          "Allow visitors who scan your QR to access your Vehix vehicle experience.",
        icon: Globe2,
        recommended: true,
      },
      {
        key: "vehicle_information",
        title: "Vehicle Information",
        description:
          "Show owner-approved vehicle details on the public experience.",
        icon: Car,
        recommended: true,
      },
      {
        key: "share_vehicle",
        title: "Share Vehicle",
        description:
          "Allow your Vehix vehicle identity to be shared.",
        icon: Share2,
      },
    ],
  },
  {
    title: "Owner Contact",
    description:
      "Choose how people can reach you when they scan your vehicle.",
    features: [
      {
        key: "contact_owner",
        title: "Contact Owner",
        description:
          "Allow visitors to contact you through the available Vehix contact options.",
        icon: MessageCircle,
        recommended: true,
      },
    ],
  },
  {
    title: "Location & Parking",
    description:
      "Control whether your saved vehicle location can be used through Vehix.",
    features: [
      {
        key: "smart_parking",
        title: "Smart Parking",
        description:
          "Enable parking location and vehicle-finding features.",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Safety & Emergency",
    description:
      "Enable optional safety features when you want them available.",
    features: [
      {
        key: "emergency_mode",
        title: "Emergency Mode",
        description:
          "Enable emergency-related actions and information for your vehicle.",
        icon: HeartPulse,
      },
      {
        key: "theft_assist",
        title: "Theft Assist",
        description:
          "Enable Vehix theft-assistance features for this vehicle.",
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: "Documents & History",
    description:
      "Control the vehicle information and history features available through Vehix.",
    features: [
      {
        key: "document_verification",
        title: "Document Verification",
        description:
          "Enable public-safe document verification information.",
        icon: FileCheck2,
        recommended: true,
      },
      {
        key: "vehicle_passport",
        title: "Vehicle Passport",
        description:
          "Enable your vehicle's digital history and identity timeline.",
        icon: History,
        recommended: true,
      },
      {
        key: "smart_maintenance",
        title: "Smart Maintenance",
        description:
          "Enable maintenance tracking, service records and reminders.",
        icon: Wrench,
        recommended: true,
      },
    ],
  },
  {
    title: "Activity & Notifications",
    description:
      "Control activity visibility and Vehix notifications for this vehicle.",
    features: [
      {
        key: "scan_activity",
        title: "QR Scan Activity",
        description:
          "Allow Vehix to record and provide scan activity for your vehicle.",
        icon: ScanLine,
        recommended: true,
      },
      {
        key: "notifications",
        title: "Vehix Notifications",
        description:
          "Enable important notifications related to this vehicle.",
        icon: Bell,
        recommended: true,
      },
    ],
  },
];

function FeatureSwitch({
  enabled,
  loading,
  onChange,
}: {
  enabled: boolean;
  loading: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={enabled ? "Turn feature off" : "Turn feature on"}
      disabled={loading}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        enabled
          ? "border-blue-500/50 bg-blue-600"
          : "border-white/10 bg-zinc-800"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function VehicleSettingsPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [settings, setSettings] =
    useState<VehicleFeatureSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [savingKey, setSavingKey] =
    useState<VehicleFeatureKey | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedVehicle = useMemo(
    () =>
      vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId
      ) ?? null,
    [vehicles, selectedVehicleId]
  );

  async function loadVehicles() {
    try {
      setLoading(true);
      setError("");

      const result = await getVehicles();

      if (!result.success) {
        setError(
          result.error ?? "Unable to load your vehicles."
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
      setError("Unable to load your vehicles.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSettings(vehicleId: string) {
    if (!vehicleId) {
      setSettings(null);
      return;
    }

    try {
      setSettingsLoading(true);
      setError("");
      setSuccess("");

      const result =
        await ensureVehicleFeatureSettings(vehicleId);

      if (!result.success || !result.data) {
        setSettings(null);
        setError(
          result.error ??
            "Unable to load vehicle feature settings."
        );
        return;
      }

      setSettings(result.data);
    } catch (err) {
      console.error(err);
      setSettings(null);
      setError(
        "Unable to load vehicle feature settings."
      );
    } finally {
      setSettingsLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      loadSettings(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  async function toggleFeature(
    key: VehicleFeatureKey
  ) {
    if (!selectedVehicleId || !settings) {
      return;
    }

    const currentValue = settings[key];

    setSavingKey(key);
    setError("");
    setSuccess("");

    /*
     * Optimistic UI update.
     */
    setSettings((current) =>
      current
        ? {
            ...current,
            [key]: !currentValue,
          }
        : current
    );

    try {
      const result =
        await updateVehicleFeatureSetting(
          selectedVehicleId,
          key,
          !currentValue
        );

      if (!result.success || !result.data) {
        /*
         * Roll back if the database update fails.
         */
        setSettings((current) =>
          current
            ? {
                ...current,
                [key]: currentValue,
              }
            : current
        );

        setError(
          result.error ??
            "Unable to update this feature."
        );
        return;
      }

      setSettings(result.data);
      setSuccess("Feature setting updated.");
    } catch (err) {
      console.error(err);

      setSettings((current) =>
        current
          ? {
              ...current,
              [key]: currentValue,
            }
          : current
      );

      setError(
        "Unable to update this feature."
      );
    } finally {
      setSavingKey(null);
    }
  }

  const enabledCount = settings
    ? featureGroups
        .flatMap((group) => group.features)
        .filter((feature) => settings[feature.key]).length
    : 0;

  const totalCount = featureGroups.reduce(
    (total, group) => total + group.features.length,
    0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <Settings2
                size={28}
                className="animate-pulse text-blue-400"
              />
            </div>

            <p className="mt-5 text-sm font-semibold text-zinc-500">
              Loading vehicle settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (vehicles.length === 0) {
    return (
      <main className="min-h-screen bg-[#030712] px-5 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-10 flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">
            <Car
              size={48}
              className="mx-auto text-zinc-600"
            />

            <h1 className="mt-6 text-3xl font-black">
              No Vehicle Found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Add a vehicle to your Vehix account before
              configuring vehicle features.
            </p>

            <button
              type="button"
              onClick={() => router.push("/add-vehicle")}
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold transition hover:bg-blue-500"
            >
              Add Vehicle
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[140px]" />
        <div className="absolute bottom-[-300px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.035] blur-[140px]" />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/85 backdrop-blur-2xl">
          <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Shield
                  size={20}
                  className="text-blue-400"
                />
              </div>

              <div className="text-left">
                <p className="text-sm font-black tracking-[0.2em]">
                  VEHIX
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Vehicle Settings
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">
                Dashboard
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-12">
          <section>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-3 py-1.5">
                  <Settings2
                    size={14}
                    className="text-blue-400"
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    Feature Control
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                  Your vehicle.
                  <br />
                  <span className="text-zinc-500">
                    Your control.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                  Choose which Vehix features are active for
                  this vehicle. You can change these settings
                  whenever you want.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Active Features
                </p>

                <p className="mt-1 text-2xl font-black">
                  {enabledCount}
                  <span className="text-zinc-600">
                    {" "}
                    / {totalCount}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <Car
                  size={23}
                  className="text-blue-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Configuring Vehicle
                </p>

                <p className="mt-1 truncate text-base font-black sm:text-lg">
                  {selectedVehicle
                    ? `${selectedVehicle.brand} ${selectedVehicle.model}`
                    : "Select Vehicle"}
                </p>

                {selectedVehicle?.vehicle_number && (
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {selectedVehicle.vehicle_number}
                  </p>
                )}
              </div>

              <div className="relative">
                <select
                  value={selectedVehicleId}
                  onChange={(event) =>
                    setSelectedVehicleId(
                      event.target.value
                    )
                  }
                  className="appearance-none rounded-xl border border-white/10 bg-[#0a0d14] py-3 pl-4 pr-10 text-sm font-semibold text-white outline-none transition focus:border-blue-500/40"
                >
                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.vehicle_number ||
                        `${vehicle.brand} ${vehicle.model}`}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm font-semibold text-red-300">
              {error}
            </div>
          )}

          {success && !error && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4 text-sm font-semibold text-emerald-300">
              <Check size={16} />
              {success}
            </div>
          )}

          {settingsLoading || !settings ? (
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-10 text-center">
              <Settings2
                size={28}
                className="mx-auto animate-pulse text-zinc-600"
              />
              <p className="mt-4 text-sm text-zinc-500">
                Loading feature controls...
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {featureGroups.map((group) => (
                <section
                  key={group.title}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]"
                >
                  <div className="border-b border-white/10 px-5 py-5 sm:px-7">
                    <h2 className="text-lg font-black sm:text-xl">
                      {group.title}
                    </h2>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm">
                      {group.description}
                    </p>
                  </div>

                  <div className="divide-y divide-white/[0.06]">
                    {group.features.map((feature) => {
                      const Icon = feature.icon;
                      const enabled =
                        settings[feature.key];
                      const saving =
                        savingKey === feature.key;

                      return (
                        <div
                          key={feature.key}
                          className="flex gap-4 px-5 py-5 sm:px-7 sm:py-6"
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              enabled
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-white/[0.035] text-zinc-600"
                            }`}
                          >
                            <Icon size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-black sm:text-base">
                                {feature.title}
                              </h3>

                              {feature.recommended && (
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-400">
                                  Recommended
                                </span>
                              )}
                            </div>

                            <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm">
                              {feature.description}
                            </p>

                            <p
                              className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                                enabled
                                  ? "text-emerald-400"
                                  : "text-zinc-700"
                              }`}
                            >
                              {enabled
                                ? "Enabled"
                                : "Disabled"}
                            </p>
                          </div>

                          <FeatureSwitch
                            enabled={enabled}
                            loading={saving}
                            onChange={() =>
                              toggleFeature(
                                feature.key
                              )
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          <section className="mt-8 rounded-[2rem] border border-blue-500/10 bg-blue-500/[0.035] p-5 sm:p-7">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <Lock
                  size={20}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h2 className="text-base font-black">
                  Your settings control your experience
                </h2>

                <p className="mt-2 text-xs leading-5 text-zinc-600 sm:text-sm">
                  Disabled features should not be available
                  through your vehicle's public Vehix
                  experience. These controls are stored per
                  vehicle, so each vehicle can have its own
                  configuration.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 flex justify-center pb-8">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}