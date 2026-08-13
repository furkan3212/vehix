"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Car,
  Phone,
  MessageCircle,
  Send,
  AlertTriangle,
  Siren,
  Lightbulb,
  DoorOpen,
  Ban,
  MapPin,
  ShieldCheck,
  QrCode,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { getPublicVehicle } from "@/services/vehicle";
import { getProfile } from "@/services/profile";
import { createAlert } from "@/services/alerts";

import { PublicVehicle } from "@/types/vehicle";
import { Profile } from "@/types/profile";

type AlertType =
  | "lights"
  | "doors"
  | "parking"
  | "emergency";

const alerts: {
  type: AlertType;
  title: string;
  description: string;
  icon: typeof Lightbulb;
}[] = [
  {
    type: "lights",
    title: "Lights Left On",
    description:
      "Notify the owner that their vehicle lights are on.",
    icon: Lightbulb,
  },
  {
    type: "doors",
    title: "Doors Open",
    description:
      "Notify the owner that a vehicle door may be open.",
    icon: DoorOpen,
  },
  {
    type: "parking",
    title: "Blocked Parking",
    description:
      "Tell the owner their vehicle is blocking another vehicle.",
    icon: Ban,
  },
  {
    type: "emergency",
    title: "Emergency",
    description:
      "Contact the vehicle's emergency contact.",
    icon: Siren,
  },
];

export default function PublicVehiclePage() {
  const params = useParams();

  const vehicleId = params.id as string;

  const [vehicle, setVehicle] =
    useState<PublicVehicle | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedAlert, setSelectedAlert] =
    useState<AlertType | null>(null);

  const [alertSent, setAlertSent] =
    useState(false);

  const [sendingAlert, setSendingAlert] =
    useState(false);

  const [alertError, setAlertError] =
    useState("");

  useEffect(() => {
    if (!vehicleId) return;

    loadVehicle();
  }, [vehicleId]);

  async function loadVehicle() {
    try {
      setLoading(true);
      setError("");

      const vehicleResult =
        await getPublicVehicle(vehicleId);

      if (
        !vehicleResult.success ||
        !vehicleResult.data
      ) {
        setError(
          "Vehicle could not be found."
        );

        return;
      }

      setVehicle(vehicleResult.data);

      /*
       * Emergency profile information is loaded
       * separately. The public vehicle page itself
       * does not require authentication.
       */
      try {
        const profileResult =
          await getProfile();

        if (
          profileResult.success &&
          profileResult.data
        ) {
          setProfile(profileResult.data);
        }
      } catch {
        /*
         * Public vehicle information should still
         * work when the visitor is not logged in.
         */
      }
    } catch (err) {
      console.error(
        "Public vehicle error:",
        err
      );

      setError(
        "Unable to load vehicle information."
      );
    } finally {
      setLoading(false);
    }
  }

  function callOwner() {
    if (!vehicle?.phone) return;

    window.location.href =
      `tel:${vehicle.phone}`;
  }

  function whatsappOwner() {
    if (!vehicle?.whatsapp) return;

    const number =
      vehicle.whatsapp.replace(
        /\D/g,
        ""
      );

    window.open(
      `https://wa.me/${number}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function smsOwner() {
    if (!vehicle?.phone) return;

    window.location.href =
      `sms:${vehicle.phone}`;
  }

  function handleAlert(
    type: AlertType
  ) {
    setSelectedAlert(type);
    setAlertSent(false);
    setAlertError("");
  }

  async function sendAlert() {
    if (!vehicle || !selectedAlert) return;

    try {
      setSendingAlert(true);
      setAlertError("");

      const result =
        await createAlert({
          vehicle_id: vehicle.id,
          alert_type: selectedAlert,
        });

      if (!result.success) {
        setAlertError(
          result.error ??
            "Unable to send alert."
        );

        return;
      }

      setAlertSent(true);
    } catch (err) {
      console.error(
        "Send alert error:",
        err
      );

      setAlertError(
        "Unable to send alert. Please try again."
      );
    } finally {
      setSendingAlert(false);
    }
  }

  function closeAlert() {
    if (sendingAlert) return;

    setSelectedAlert(null);
    setAlertSent(false);
    setAlertError("");
  }

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
            Loading vehicle...
          </p>
        </div>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertTriangle
              size={30}
              className="text-red-400"
            />
          </div>

          <h1 className="mt-6 text-2xl font-black">
            Vehicle Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error ||
              "This vehicle identity is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  /*
   * IMPORTANT:
   *
   * The current profile service returns the
   * authenticated user's profile. A public
   * visitor is not authenticated, so emergency
   * contact availability will remain disabled
   * until we create the public-safe emergency
   * lookup.
   *
   * We intentionally do not expose the owner's
   * complete private profile here.
   */
  const emergencyAvailable =
    Boolean(
      profile?.emergency_phone
    );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" />

        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
              <QrCode size={22} />
            </div>

            <div>
              <p className="font-black tracking-[0.25em]">
                VEHIX
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Smart Vehicle Identity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400">
            <ShieldCheck size={14} />
            Verified
          </div>
        </header>

        {/* Vehicle Identity */}
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] backdrop-blur-xl">
          <div className="border-b border-white/10 bg-gradient-to-br from-blue-600/10 to-cyan-500/5 p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10">
              <Car
                size={40}
                className="text-blue-400"
              />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              Vehix Vehicle Identity
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              {vehicle.vehicle_number}
            </h1>

            <p className="mt-3 text-lg text-zinc-400">
              {vehicle.brand}{" "}
              {vehicle.model}
            </p>

            {vehicle.nickname && (
              <p className="mt-2 text-sm text-zinc-600">
                "{vehicle.nickname}"
              </p>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            <div className="bg-[#070b14] p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-zinc-600">
                Year
              </p>

              <p className="mt-2 text-lg font-bold">
                {vehicle.year}
              </p>
            </div>

            <div className="bg-[#070b14] p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-zinc-600">
                Color
              </p>

              <p className="mt-2 text-lg font-bold">
                {vehicle.color}
              </p>
            </div>

            <div className="bg-[#070b14] p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-zinc-600">
                Status
              </p>

              <p className="mt-2 flex items-center justify-center gap-2 text-lg font-bold text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Active
              </p>
            </div>
          </div>
        </section>

        {/* Contact Owner */}
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-black">
            Contact Vehicle Owner
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={callOwner}
              disabled={!vehicle.phone}
              className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 font-bold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Phone size={20} />
              Call Owner
            </button>

            <button
              type="button"
              onClick={whatsappOwner}
              disabled={!vehicle.whatsapp}
              className="flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MessageCircle size={20} />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={smsOwner}
              disabled={!vehicle.phone}
              className="flex items-center justify-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 font-bold text-blue-400 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={20} />
              SMS Owner
            </button>
          </div>
        </section>

        {/* Alerts */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-black">
              Need to Alert the Owner?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Select an issue and send an alert to
              the vehicle owner.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {alerts.map((alert) => {
              const Icon = alert.icon;

              const disabled =
                alert.type === "emergency" &&
                !emergencyAvailable;

              return (
                <button
                  key={alert.type}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    handleAlert(alert.type)
                  }
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-blue-500/30 hover:bg-blue-500/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-blue-500/10 p-3">
                      <Icon
                        size={22}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold">
                        {alert.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        {alert.description}
                      </p>
                    </div>

                    <span className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-blue-400">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-6">
          <div className="flex gap-4">
            <div className="rounded-xl bg-red-500/10 p-3">
              <Siren
                size={24}
                className="text-red-400"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-black">
                Emergency Contact
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                If there is an emergency involving
                this vehicle, use the emergency
                contact option.
              </p>

              {emergencyAvailable ? (
                <button
                  type="button"
                  onClick={() =>
                    handleAlert("emergency")
                  }
                  className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-700"
                >
                  <Siren size={17} />
                  Contact Emergency Contact
                </button>
              ) : (
                <p className="mt-4 text-xs text-zinc-700">
                  Emergency contact is currently
                  unavailable.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex gap-4">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <MapPin
                size={23}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="font-black">
                Vehicle Identity
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                This Vehix QR connects this vehicle
                to its digital identity and owner
                contact system.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-6 pt-12 text-center">
          <p className="text-xs text-zinc-700">
            Powered by Vehix Smart Vehicle Identity
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-800">
            Scan • Connect • Protect
          </p>
        </footer>
      </div>

      {/* Alert Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b101b] p-7 shadow-2xl">
            {!alertSent ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-blue-500/10 p-4">
                    <AlertTriangle
                      size={26}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-black">
                      {alerts.find(
                        (item) =>
                          item.type ===
                          selectedAlert
                      )?.title}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-600">
                      Send this alert to the vehicle
                      owner?
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm leading-7 text-zinc-400">
                    The owner will receive this alert
                    in their Vehix dashboard.
                  </p>
                </div>

                {alertError && (
                  <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {alertError}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={closeAlert}
                    disabled={sendingAlert}
                    className="rounded-xl border border-white/10 py-3 font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={sendAlert}
                    disabled={sendingAlert}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingAlert ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Send Alert
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2
                    size={34}
                    className="text-green-400"
                  />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Alert Sent
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  The vehicle owner has been notified
                  through their Vehix dashboard.
                </p>

                <button
                  type="button"
                  onClick={closeAlert}
                  className="mt-7 w-full rounded-xl bg-blue-600 py-3 font-bold transition hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}