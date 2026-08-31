"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Car,
  Plus,
  User,
  MapPin,
  FileText,
  Bell,
  BellRing,
  Eye,
  Pencil,
  Trash2,
  ArrowRight,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  DoorOpen,
  Ban,
  Siren,
  Loader2,
  CheckCircle2,
  RefreshCw,
  QrCode,
  ShoppingBag,
  Package,
  ChevronRight,
  Sparkles,
  Clock3,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  getVehicles,
  deleteVehicle,
} from "@/services/vehicle";

import {
  getOwnerAlerts,
  markAlertAsRead,
  type VehicleAlert,
} from "@/services/alerts";

import { Vehicle } from "@/types/vehicle";

type AlertDisplay = {
  title: string;
  description: string;
  icon: typeof Lightbulb;
};

const alertDisplay: Record<
  VehicleAlert["alert_type"],
  AlertDisplay
> = {
  lights: {
    title: "Lights Left On",
    description:
      "Someone reported that your vehicle lights may be on.",
    icon: Lightbulb,
  },

  doors: {
    title: "Doors Open",
    description:
      "Someone reported that a vehicle door may be open.",
    icon: DoorOpen,
  },

  parking: {
    title: "Blocked Parking",
    description:
      "Someone reported that your vehicle may be blocking another vehicle.",
    icon: Ban,
  },

  emergency: {
    title: "Emergency",
    description:
      "Someone reported an emergency involving your vehicle.",
    icon: Siren,
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [alerts, setAlerts] =
    useState<VehicleAlert[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [alertsLoading, setAlertsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [alertError, setAlertError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [markingId, setMarkingId] =
    useState<string | null>(null);

  const [userName, setUserName] =
    useState("");

  const [qrStatus, setQrStatus] = useState<
    "not_ordered" | "pending" | "active"
  >("not_ordered");

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrVehicleId, setQrVehicleId] = useState<string | null>(null);

  const [orderLoading, setOrderLoading] =
    useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    await Promise.all([
      loadVehicles(),
      loadAlerts(),
      loadUser(),
      loadQRStatus(),
    ]);

    setLoading(false);
  }

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      setUserName(name);
    } catch (err) {
      console.error(
        "Failed to load user:",
        err
      );
    }
  }

  async function loadVehicles() {
    try {
      setError("");

      const result =
        await getVehicles();

      if (!result.success) {
        setError(
          result.error ??
            "Failed to load vehicles."
        );

        return;
      }

      setVehicles(result.data ?? []);
    } catch (err) {
      console.error(
        "Load vehicles error:",
        err
      );

      setError(
        "Unable to load your vehicles."
      );
    }
  }

  async function loadAlerts() {
    try {
      setAlertsLoading(true);
      setAlertError("");

      const result =
        await getOwnerAlerts();

      if (!result.success) {
        setAlertError(
          result.error ??
            "Failed to load alerts."
        );

        return;
      }

      setAlerts(result.data ?? []);
    } catch (err) {
      console.error(
        "Load alerts error:",
        err
      );

      setAlertError(
        "Unable to load alerts."
      );
    } finally {
      setAlertsLoading(false);
    }
  }

  async function loadQRStatus() {
    try {
      setOrderLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      /*
       * QR ownership is tracked in qr_inventory.
       *
       * After a successful QR purchase, complete_qr_order
       * assigns a QR to the authenticated user and vehicle.
       * The QR is initially "sold" and becomes "activated"
       * after the owner completes activation.
       *
       * We therefore read qr_inventory directly instead of
       * depending on the orders table or an orders.status column.
       */
      const { data, error } = await supabase
        .from("qr_inventory")
        .select(
          "id,qr_code,status,assigned_user_id,vehicle_id,created_at"
        )
        .eq("assigned_user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn(
          "QR identity is not available yet:",
          error.message
        );

        setQrStatus("not_ordered");
        setQrCode(null);
        setQrVehicleId(null);
        return;
      }

      if (!data) {
        setQrStatus("not_ordered");
        setQrCode(null);
        setQrVehicleId(null);
        return;
      }

      setQrCode(data.qr_code ?? null);
      setQrVehicleId(data.vehicle_id ?? null);

      const status = String(
        data.status ?? ""
      ).toLowerCase();

      if (
        status === "activated" ||
        status.includes("activ")
      ) {
        setQrStatus("active");
      } else {
        /*
         * "sold" means the QR has been purchased and assigned,
         * but it has not been activated yet.
         */
        setQrStatus("pending");
      }
    } catch (err) {
      console.warn(
        "QR status load skipped:",
        err
      );

      setQrStatus("not_ordered");
      setQrCode(null);
      setQrVehicleId(null);
    } finally {
      setOrderLoading(false);
    }
  }

  async function handleDelete(
    vehicle: Vehicle
  ) {
    const confirmed =
      window.confirm(
        `Delete ${vehicle.vehicle_number}? This action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeletingId(vehicle.id);

      const result =
        await deleteVehicle(
          vehicle.id
        );

      if (!result.success) {
        throw new Error(
          result.error ??
            "Unable to delete vehicle."
        );
      }

      setVehicles((current) =>
        current.filter(
          (item) =>
            item.id !== vehicle.id
        )
      );
    } catch (err) {
      console.error(
        "Delete vehicle error:",
        err
      );

      window.alert(
        "Unable to delete this vehicle."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMarkRead(
    alert: VehicleAlert
  ) {
    try {
      setMarkingId(alert.id);

      const result =
        await markAlertAsRead(alert.id);

      if (!result.success) {
        window.alert(
          result.error ??
            "Unable to mark alert as read."
        );

        return;
      }

      setAlerts((current) =>
        current.map((item) =>
          item.id === alert.id
            ? {
                ...item,
                status: "read",
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Mark alert read error:",
        err
      );
    } finally {
      setMarkingId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/login");
  }

  const unreadAlerts =
    alerts.filter(
      (alert) =>
        alert.status !== "read"
    ).length;

  const hasVehicles =
    vehicles.length > 0;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <Loader2
              size={28}
              className="animate-spin text-blue-400"
            />
          </div>

          <p className="mt-5 text-sm text-zinc-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-220px] top-[-220px] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[190px]" />

        <div className="absolute bottom-[-240px] right-[-240px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[190px]" />

        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-500/[0.025] blur-[150px]" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative">
        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/85 backdrop-blur-2xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
                <Car size={23} />
              </div>

              <div className="text-left">
                <p className="font-black tracking-[0.25em]">
                  VEHIX
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  Smart Vehicle Identity
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/profile"
                  )
                }
                className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10 sm:flex"
              >
                <User size={17} />
                Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={17} />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-12">
          {/* WELCOME */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-400">
                  <ShieldCheck size={14} />
                  Account Active
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  Welcome back
                  {userName
                    ? `, ${userName}`
                    : ""}
                  .
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                  Everything you need to manage your
                  vehicles and VEHIX identity, all in one
                  place.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/add-vehicle"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold shadow-lg shadow-blue-600/20 transition hover:scale-[1.02]"
              >
                <Plus size={20} />
                Add Vehicle
              </button>
            </div>
          </section>

          {/* GET MY QR HERO */}
          <section className="relative mb-8 overflow-hidden rounded-[32px] border border-blue-500/20 bg-gradient-to-br from-blue-600/[0.16] via-blue-500/[0.07] to-cyan-500/[0.08] p-6 shadow-2xl shadow-blue-950/20 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-blue-400/10" />

            <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-cyan-400/10" />

            <div className="pointer-events-none absolute right-12 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                  <QrCode size={14} />
                  VEHIX QR Identity
                </div>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Give your vehicle
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    its digital identity.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                  Get your VEHIX QR sticker and connect your
                  vehicle to a smart public identity. Choose
                  a standard design, a VEHIX design or create
                  your own custom design.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-zinc-400">
                    100% Waterproof
                  </span>

                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-zinc-400">
                    Easy to Scan
                  </span>

                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-zinc-400">
                    Smart Vehicle Identity
                  </span>
                </div>
              </div>

              <div className="relative shrink-0 lg:w-[300px]">
                {qrStatus === "not_ordered" && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/qr-store"
                      )
                    }
                    className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-white px-5 py-5 text-left text-[#030712] shadow-2xl shadow-blue-950/30 transition duration-300 hover:-translate-y-1 hover:shadow-blue-900/30"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                        Your next step
                      </p>

                      <p className="mt-1 text-xl font-black">
                        Get My QR
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Choose your design
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition group-hover:scale-110">
                      <ArrowRight size={21} />
                    </div>
                  </button>
                )}

                {qrStatus === "pending" && (
                  <div className="rounded-2xl border border-amber-500/20 bg-black/20 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                        <Clock3
                          size={21}
                          className="text-amber-400"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-amber-400">
                          VEHIX QR
                        </p>

                        <p className="mt-1 font-bold">
                          Activation Pending
                        </p>

                        {qrCode && (
                          <p className="mt-1 truncate font-mono text-[11px] text-zinc-500">
                            {qrCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.04] px-4 py-3">
                      <p className="text-xs leading-5 text-zinc-400">
                        Your VEHIX QR has been purchased successfully and is
                        currently waiting for activation by the VEHIX team.
                      </p>
                    </div>

                    <p className="mt-4 text-[11px] leading-5 text-zinc-600">
                      Your QR identity will appear here as soon as the VEHIX
                      team activates it.
                    </p>
                  </div>
                )}

                {qrStatus === "active" && (
                  <div className="rounded-2xl border border-green-500/20 bg-black/20 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                        <QrCode
                          size={21}
                          className="text-green-400"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-green-400">
                          VEHIX QR
                        </p>

                        <p className="mt-1 font-bold">
                          Active
                        </p>

                        {qrCode && (
                          <p className="mt-1 truncate font-mono text-[11px] text-zinc-500">
                            {qrCode}
                          </p>
                        )}
                      </div>
                    </div>

                    {qrVehicleId && (
                      <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-zinc-600">
                          Linked Vehicle
                        </p>
                        <p className="mt-1 text-xs font-bold text-zinc-300">
                          {vehicles.find(
                            (vehicle) =>
                              vehicle.id === qrVehicleId
                          )
                            ? `${vehicles.find(
                                (vehicle) =>
                                  vehicle.id === qrVehicleId
                              )?.brand ?? ""} ${
                                vehicles.find(
                                  (vehicle) =>
                                    vehicle.id === qrVehicleId
                                )?.model ?? ""
                              } • ${
                                vehicles.find(
                                  (vehicle) =>
                                    vehicle.id === qrVehicleId
                                )?.vehicle_number ?? ""
                              }`
                            : "Vehicle linked"}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/qr-store"
                        )
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-white/10"
                    >
                      Manage QR
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* QUICK STATS */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Car}
              title="My Vehicles"
              value={vehicles.length}
              description="Registered vehicles"
            />

            <StatCard
              icon={BellRing}
              title="Alerts"
              value={unreadAlerts}
              description="Unread notifications"
              alert={unreadAlerts > 0}
            />

            <StatCard
              icon={QrCode}
              title="QR Identity"
              value={
                qrStatus === "active"
                  ? "Active"
                  : qrStatus === "pending"
                  ? "Pending"
                  : "Not Ordered"
              }
              description={
                qrStatus === "active"
                  ? "Vehicle identity active"
                  : "Get your VEHIX QR"
              }
            />

            <StatCard
              icon={FileText}
              title="Documents"
              value="Secure"
              description="Private storage"
            />
          </section>

          {/* QR STORE SHORTCUTS */}
          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <QuickActionCard
              icon={QrCode}
              title="Get My QR"
              description="Choose your VEHIX QR sticker and start your order."
              badge="Shop"
              onClick={() =>
                router.push(
                  "/qr-store"
                )
              }
              primary
            />

            <QuickActionCard
              icon={ShoppingBag}
              title="My Orders"
              description="View your QR orders and delivery status."
              badge="Orders"
              onClick={() =>
                router.push(
                  "/qr-store"
                )
              }
            />

            <QuickActionCard
              icon={QrCode}
              title="My VEHIX QR"
              description={
                qrStatus === "active"
                  ? "View your activated VEHIX vehicle identity."
                  : "Your QR will appear here after VEHIX activates it."
              }
              badge={qrStatus === "active" ? "Active" : "Pending"}
              onClick={() => {
                if (qrStatus === "active") {
                  router.push("/qr-store");
                }
              }}
            />
          </section>

          {/* ALERTS */}
          <section className="mt-12">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black">
                    Vehicle Alerts
                  </h2>

                  {unreadAlerts > 0 && (
                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-black">
                      {unreadAlerts}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-zinc-600">
                  Alerts sent by people who scanned your VEHIX
                  vehicle identity.
                </p>
              </div>

              <button
                type="button"
                onClick={loadAlerts}
                disabled={alertsLoading}
                className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    alertsLoading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            </div>

            {alertError && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
                {alertError}
              </div>
            )}

            {alertsLoading ? (
              <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-12">
                <Loader2
                  size={24}
                  className="animate-spin text-blue-400"
                />
              </div>
            ) : alerts.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Bell
                    size={26}
                    className="text-blue-400"
                  />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  No alerts yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  When someone scans your VEHIX QR and reports
                  an issue, their alert will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const display =
                    alertDisplay[
                      alert.alert_type
                    ];

                  const Icon =
                    display.icon;

                  const unread =
                    alert.status !==
                    "read";

                  return (
                    <div
                      key={alert.id}
                      className={`rounded-3xl border p-5 transition ${
                        unread
                          ? "border-blue-500/20 bg-blue-500/[0.05]"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            unread
                              ? "bg-blue-500/10"
                              : "bg-white/5"
                          }`}
                        >
                          <Icon
                            size={23}
                            className={
                              unread
                                ? "text-blue-400"
                                : "text-zinc-600"
                            }
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black">
                              {display.title}
                            </h3>

                            {unread && (
                              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-blue-400">
                                New
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm leading-6 text-zinc-500">
                            {alert.message ||
                              display.description}
                          </p>

                          <p className="mt-2 text-xs text-zinc-700">
                            {formatDate(
                              alert.created_at
                            )}
                          </p>
                        </div>

                        {unread && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkRead(
                                alert
                              )
                            }
                            disabled={
                              markingId ===
                              alert.id
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                          >
                            {markingId ===
                            alert.id ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2
                                size={16}
                              />
                            )}

                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* VEHICLES */}
          <section className="mt-12">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-black">
                  My Vehicles
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                  Manage your registered VEHIX vehicles.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/add-vehicle"
                  )
                }
                className="flex w-fit items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Add another vehicle
                <ArrowRight size={16} />
              </button>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
                {error}
              </div>
            )}

            {vehicles.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Car
                    size={30}
                    className="text-blue-400"
                  />
                </div>

                <h3 className="mt-6 text-xl font-black">
                  No vehicles yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  Add your first vehicle to create its digital
                  VEHIX identity.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/add-vehicle"
                    )
                  }
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold transition hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Your First Vehicle
                </button>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] backdrop-blur-xl transition hover:border-blue-500/20"
                  >
                    {/* VEHICLE HEADER */}
                    <div className="border-b border-white/10 bg-gradient-to-br from-blue-600/[0.08] to-transparent p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                            <Car
                              size={27}
                              className="text-blue-400"
                            />
                          </div>

                          <div>
                            <h3 className="text-xl font-black">
                              {vehicle.brand}{" "}
                              {vehicle.model}
                            </h3>

                            <p className="mt-1 text-sm font-bold tracking-wider text-blue-400">
                              {
                                vehicle.vehicle_number
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          Active
                        </div>
                      </div>

                      {vehicle.nickname && (
                        <p className="mt-5 text-sm italic text-zinc-600">
                          "{vehicle.nickname}"
                        </p>
                      )}
                    </div>

                    {/* VEHICLE DETAILS */}
                    <div className="grid grid-cols-3 gap-px bg-white/10">
                      <VehicleDetail
                        label="Year"
                        value={String(
                          vehicle.year
                        )}
                      />

                      <VehicleDetail
                        label="Color"
                        value={
                          vehicle.color
                        }
                      />

                      <VehicleDetail
                        label="Contact"
                        value={
                          vehicle.phone
                            ? "Available"
                            : "Not set"
                        }
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="grid gap-2 p-5 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/vehicle/${vehicle.id}`
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold transition hover:bg-white/10"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/edit-vehicle/${vehicle.id}`
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/dashboard/location?vehicle=${vehicle.id}`
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                      >
                        <MapPin size={16} />
                        Location
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            vehicle
                          )
                        }
                        disabled={
                          deletingId ===
                          vehicle.id
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId ===
                        vehicle.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MANAGEMENT */}
          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-black">
                Vehicle Management
              </h2>

              <p className="mt-2 text-sm text-zinc-600">
                Quickly access the rest of your VEHIX vehicle
                tools.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ManagementCard
                icon={User}
                title="Profile"
                description="Manage your contact and emergency information."
                onClick={() =>
                  router.push(
                    "/dashboard/profile"
                  )
                }
              />

              <ManagementCard
                icon={MapPin}
                title="Parking Location"
                description="Save and manage your vehicle parking location."
                onClick={() =>
                  router.push(
                    "/dashboard/location"
                  )
                }
              />

              <ManagementCard
                icon={FileText}
                title="Documents"
                description="Keep your RC, insurance, PUC and other documents secure."
                onClick={() =>
                  router.push(
                    "/dashboard/documents"
                  )
                }
              />
            </div>
          </section>

          {/* SECURITY */}
          <section className="mt-12 overflow-hidden rounded-[32px] border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-blue-500/[0.03] to-cyan-500/5 p-7 md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                <ShieldCheck
                  size={28}
                  className="text-blue-400"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-black">
                  Your VEHIX Identity
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Your vehicle information stays connected to
                  your VEHIX account. Public visitors can contact
                  you through the information you choose to
                  provide.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400">
                <CheckCircle2 size={15} />
                Protected
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="pb-8 pt-14 text-center">
            <p className="text-xs text-zinc-700">
              VEHIX • Smart Vehicle Identity
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-zinc-800">
              Smarter • Safer • Connected
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* ============================================
   STAT CARD
============================================ */

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  alert = false,
}: {
  icon: typeof Car;
  title: string;
  value: string | number;
  description: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 transition ${
        alert
          ? "border-red-500/20 bg-red-500/[0.04]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            alert
              ? "bg-red-500/10"
              : "bg-blue-500/10"
          }`}
        >
          <Icon
            size={21}
            className={
              alert
                ? "text-red-400"
                : "text-blue-400"
            }
          />
        </div>

        {alert && (
          <AlertTriangle
            size={17}
            className="text-red-400"
          />
        )}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-zinc-600">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-700">
        {description}
      </p>
    </div>
  );
}

/* ============================================
   QUICK ACTION CARD
============================================ */

function QuickActionCard({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
  primary = false,
}: {
  icon: typeof QrCode;
  title: string;
  description: string;
  badge: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition duration-300 hover:-translate-y-1 ${
        primary
          ? "border-blue-500/20 bg-blue-500/[0.07] hover:bg-blue-500/[0.10]"
          : "border-white/10 bg-white/[0.03] hover:border-blue-500/20 hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            primary
              ? "bg-blue-500/15"
              : "bg-white/5"
          }`}
        >
          <Icon
            size={22}
            className={
              primary
                ? "text-blue-400"
                : "text-zinc-400"
            }
          />
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-zinc-600">
          {badge}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-400">
        Open
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}

/* ============================================
   VEHICLE DETAIL
============================================ */

function VehicleDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#070b14] p-4 text-center">
      <p className="text-[10px] uppercase tracking-widest text-zinc-700">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-zinc-300">
        {value}
      </p>
    </div>
  );
}

/* ============================================
   MANAGEMENT CARD
============================================ */

function ManagementCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof User;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
          <Icon
            size={22}
            className="text-blue-400"
          />
        </div>

        <ChevronRight
          size={18}
          className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-blue-400"
        />
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </button>
  );
}

/* ============================================
   DATE FORMAT
============================================ */

function formatDate(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(value));
  } catch {
    return value;
  }
}