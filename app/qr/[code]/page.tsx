"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Car,
  QrCode,
  Lock,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Siren,
  Lightbulb,
  DoorOpen,
  CarFront,
  Search,
  ArrowRight,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

/* =========================================================
   TYPES
   ========================================================= */

type QRData = {
  qr_code: string;
  status: string;
  product_name: string | null;
  design_name: string | null;
  vehicle_id: string | null;
};

type VehicleData = {
  id: string;
  user_id: string;
  vehicle_number: string;
  brand: string;
  model: string;
  year?: number | null;
  colour: string | null;
  vehicle_type: string | null;
  photo_url: string | null;
};

type ProfileData = {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  emergency_name: string | null;
  emergency_phone: string | null;
};

type ActionType =
  | "lights_on"
  | "door_open"
  | "blocking"
  | "found_vehicle";

type ActionState = {
  loading: boolean;
  success: boolean;
  error: string;
};

/* =========================================================
   HELPERS
   ========================================================= */

/*
 * Converts a phone number into a format suitable for
 * tel:, sms: and WhatsApp links.
 *
 * India:
 * 9876543210       -> 919876543210
 * 09876543210      -> 919876543210
 * +919876543210    -> 919876543210
 *
 * Other international numbers are preserved as digits.
 */
function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, "");

  if (!digits) return "";

  // Indian number beginning with 0
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `91${digits.slice(1)}`;
  }

  // Indian 10-digit mobile number
  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return digits;
}

/*
 * Safely parse an API response.
 *
 * This prevents:
 *
 * Unexpected token '<', "<!DOCTYPE..."
 *
 * when Next.js returns an HTML error page.
 */
async function readApiResponse(response: Response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  throw new Error(
    text ||
      `Request failed with status ${response.status}.`
  );
}

/* =========================================================
   ACTION CARD
   ========================================================= */

function ActionCard({
  icon,
  title,
  description,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex min-h-[145px] w-full flex-col justify-between rounded-3xl border p-5 text-left transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-500/20 bg-red-500/[0.04] hover:border-red-500/50 hover:bg-red-500/[0.08]"
          : "border-white/10 bg-[#0a0b0f] hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            danger
              ? "bg-red-500/10 text-red-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {icon}
        </div>

        <ArrowRight
          size={20}
          className="mt-1 text-zinc-700 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-400"
        />
      </div>

      <div className="mt-5">
        <p
          className={`text-lg font-black ${
            danger ? "text-red-100" : "text-white"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-sm leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </button>
  );
}

/* =========================================================
   INFO CARD
   ========================================================= */

function InfoCard({
  label,
  value,
  verified = false,
}: {
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <p className="text-lg font-bold text-white">
          {value}
        </p>

        {verified && (
          <CheckCircle2
            size={18}
            className="shrink-0 text-emerald-400"
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function QRVehiclePage() {
  const params = useParams();

  /*
   * IMPORTANT:
   *
   * useParams() can technically return:
   *
   * string
   * string[]
   * undefined
   *
   * So we always convert it into a safe string.
   */

  const code =
    typeof params?.code === "string"
      ? params.code
      : Array.isArray(params?.code)
        ? params.code[0]
        : "";

  const [qr, setQr] = useState<QRData | null>(
    null
  );

  const [vehicle, setVehicle] =
    useState<VehicleData | null>(null);

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] =
    useState(false);

  const [notActivated, setNotActivated] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [actionState, setActionState] =
    useState<ActionState>({
      loading: false,
      success: false,
      error: "",
    });

  const [successAction, setSuccessAction] =
    useState("");

  const [showActionMessage, setShowActionMessage] =
    useState(false);

  /* =======================================================
     LOAD QR + VEHICLE + PROFILE
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadVehicleIdentity() {
      if (!code) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        /*
         * ---------------------------------------------------
         * STEP 1: Find QR
         * ---------------------------------------------------
         */

        const {
          data: qrData,
          error: qrError,
        } = await supabase
          .from("qr_inventory")
          .select(
            "qr_code, status, product_name, design_name, vehicle_id"
          )
          .eq("qr_code", code.trim().toUpperCase())
          .maybeSingle();

        if (qrError) {
          console.error(
            "QR lookup error:",
            qrError
          );

          if (!cancelled) {
            setErrorMessage(
              "Unable to verify this Vehix QR code."
            );
            setLoading(false);
          }

          return;
        }

        if (!qrData) {
          if (!cancelled) {
            setNotFound(true);
            setLoading(false);
          }

          return;
        }

        if (cancelled) return;

        setQr(qrData);

        /*
         * ---------------------------------------------------
         * STEP 2: Check activation
         * ---------------------------------------------------
         */

        if (qrData.status !== "activated") {
          setNotActivated(true);
          setLoading(false);
          return;
        }

        /*
         * ---------------------------------------------------
         * STEP 3: QR must have a vehicle
         * ---------------------------------------------------
         */

        if (!qrData.vehicle_id) {
          setErrorMessage(
            "This QR is activated but is not linked to a vehicle."
          );

          setLoading(false);
          return;
        }

        /*
         * ---------------------------------------------------
         * STEP 4: Load vehicle
         *
         * user_id is important because we use it to load
         * the owner's contact information.
         * ---------------------------------------------------
         */

        const {
          data: vehicleData,
          error: vehicleError,
        } = await supabase
          .from("vehicles")
          .select(
            "id, user_id, vehicle_number, brand, model, year, colour, vehicle_type, photo_url"
          )
          .eq("id", qrData.vehicle_id)
          .maybeSingle();

        if (vehicleError) {
          console.error(
            "Vehicle lookup error:",
            vehicleError
          );

          if (!cancelled) {
            setErrorMessage(
              "Unable to load the verified vehicle information."
            );
            setLoading(false);
          }

          return;
        }

        if (!vehicleData) {
          if (!cancelled) {
            setErrorMessage(
              "The vehicle linked to this QR could not be found."
            );
            setLoading(false);
          }

          return;
        }

        if (cancelled) return;

        setVehicle(vehicleData);

        /*
         * ---------------------------------------------------
         * STEP 5: Load owner profile
         * ---------------------------------------------------
         */

        if (vehicleData.user_id) {
          const {
            data: profileData,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select(
              "id, full_name, phone, whatsapp, emergency_name, emergency_phone"
            )
            .eq("id", vehicleData.user_id)
            .maybeSingle();

          /*
           * A profile failure should NOT destroy the QR page.
           *
           * The vehicle itself can still be displayed.
           */
          if (profileError) {
            console.warn(
              "Owner profile lookup:",
              profileError
            );
          }

          if (!cancelled) {
            setProfile(profileData || null);
          }
        }

        if (!cancelled) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Vehix public identity error:",
          error
        );

        if (!cancelled) {
          setErrorMessage(
            "Something went wrong while verifying this vehicle."
          );

          setLoading(false);
        }
      }
    }

    loadVehicleIdentity();

    return () => {
      cancelled = true;
    };
  }, [code]);

  /* =======================================================
     DIRECT CALL OWNER
     ======================================================= */

  const callOwner = () => {
    const phone = normalizePhone(
      profile?.phone
    );

    if (!phone) {
      setActionState({
        loading: false,
        success: false,
        error:
          "The vehicle owner has not configured a phone number yet.",
      });

      setSuccessAction("");
      setShowActionMessage(true);

      return;
    }

    /*
     * Direct phone dialer.
     *
     * The number is NOT rendered visibly on the page.
     */

    window.location.href = `tel:+${phone}`;
  };

  /* =======================================================
     DIRECT SMS
     * ======================================================= */

  const sendSMS = () => {
    const phone = normalizePhone(
      profile?.phone
    );

    if (!phone) {
      setActionState({
        loading: false,
        success: false,
        error:
          "The vehicle owner has not configured a phone number yet.",
      });

      setSuccessAction("");
      setShowActionMessage(true);

      return;
    }

    const text = encodeURIComponent(
      `Hi, I scanned your Vehix vehicle QR. I need to contact you regarding your vehicle.`
    );

    window.location.href = `sms:+${phone}?body=${text}`;
  };

  /* =======================================================
     DIRECT WHATSAPP
     ======================================================= */

  const openWhatsApp = () => {
    /*
     * Prefer the dedicated WhatsApp number.
     *
     * If it is empty, fall back to the normal phone number.
     */

    const whatsappNumber = normalizePhone(
      profile?.whatsapp || profile?.phone
    );

    if (!whatsappNumber) {
      setActionState({
        loading: false,
        success: false,
        error:
          "The vehicle owner has not configured a WhatsApp number yet.",
      });

      setSuccessAction("");
      setShowActionMessage(true);

      return;
    }

    const text = encodeURIComponent(
      `Hi, I scanned your Vehix vehicle QR and need to contact you regarding your vehicle.`
    );

    window.location.href =
      `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  /* =======================================================
     EMERGENCY CONTACT
     ======================================================= */

  const callEmergencyContact = () => {
    const emergencyPhone = normalizePhone(
      profile?.emergency_phone
    );

    if (!emergencyPhone) {
      setActionState({
        loading: false,
        success: false,
        error:
          "No emergency contact number has been configured for this vehicle.",
      });

      setSuccessAction("");
      setShowActionMessage(true);

      return;
    }

    /*
     * DIRECT CALL.
     *
     * No form.
     * No message.
     * No registration.
     */

    window.location.href =
      `tel:+${emergencyPhone}`;
  };

  /* =======================================================
     VEHICLE ALERT ACTION
     * ======================================================= */

  const sendVehicleAction = async (
    action: ActionType,
    title: string
  ) => {
    if (!code) return;

    try {
      setActionState({
        loading: true,
        success: false,
        error: "",
      });

      setSuccessAction(title);
      setShowActionMessage(true);

      const response = await fetch(
        "/api/vehicle-action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qr_code: code,
            action,
          }),
        }
      );

      /*
       * IMPORTANT:
       *
       * Don't blindly call response.json().
       *
       * This prevents the:
       *
       * Unexpected token '<'
       *
       * error if Next.js returns an HTML page.
       */

      const result =
        await readApiResponse(response);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            `Unable to send ${title} alert.`
        );
      }

      setActionState({
        loading: false,
        success: true,
        error: "",
      });
    } catch (error) {
      console.error(
        "Vehicle action error:",
        error
      );

      setActionState({
        loading: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : `Unable to send ${title} alert.`,
      });
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10">
            <QrCode
              size={42}
              className="animate-pulse text-red-500"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-2xl font-black">
            Verifying Vehicle
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Checking the authenticity of this QR code...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     INVALID QR
     ======================================================= */

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#111113] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
            <AlertTriangle
              size={40}
              className="text-red-500"
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Invalid QR Code
          </h1>

          <p className="mt-4 leading-6 text-zinc-400">
            This QR code could not be found in the official
            Vehix network.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Scanned Code
            </p>

            <p className="mt-2 break-all font-mono text-sm font-bold text-zinc-300">
              {code}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT ACTIVATED
     ======================================================= */

  if (notActivated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10">
            <QrCode
              size={40}
              className="text-blue-400"
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-3xl font-black">
            QR Not Activated
          </h1>

          <p className="mt-4 leading-6 text-zinc-400">
            This is an authentic Vehix QR code, but it has
            not yet been activated for a vehicle.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <ShieldCheck size={18} />

              <span className="text-sm font-semibold">
                Authentic Vehix QR
              </span>
            </div>

            <p className="mt-4 font-mono text-sm font-bold text-white">
              {qr?.qr_code}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     GENERAL ERROR
     ======================================================= */

  if (errorMessage || !vehicle || !qr) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#111113] p-8 text-center">
          <AlertTriangle
            size={42}
            className="mx-auto mb-5 text-red-500"
          />

          <h1 className="text-2xl font-black">
            Verification Error
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {errorMessage ||
              "Unable to verify this vehicle."}
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN VERIFIED PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#030303] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10">
              <ShieldCheck
                size={24}
                className="text-red-500"
              />
            </div>

            <div>
              <p className="text-sm font-black tracking-wide">
                VEHIX
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Smart Vehicle Identity
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 sm:flex">
            <CheckCircle2
              size={15}
              className="text-emerald-400"
            />

            <span className="text-xs font-semibold text-emerald-400">
              Official Vehix Network
            </span>
          </div>
        </div>

        {/* =================================================
            HERO
            ================================================= */}

        <section className="relative overflow-hidden rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-7 shadow-[0_20px_80px_rgba(239,68,68,0.18)] sm:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col items-center text-center">

              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <ShieldCheck
                  size={42}
                  className="text-white"
                />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur">
                <CheckCircle2 size={15} />
                Verified by Vehix
              </div>

              <h1 className="mt-6 break-all text-4xl font-black tracking-tight sm:text-6xl">
                {vehicle.vehicle_number.toUpperCase()}
              </h1>

              <p className="mt-3 text-xl font-semibold sm:text-2xl">
                {vehicle.brand.toUpperCase()}{" "}
                <span className="opacity-60">
                  •
                </span>{" "}
                {vehicle.model.toUpperCase()}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-black">
                  <CheckCircle2 size={16} />
                  Registered
                </div>

                <div className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-bold">
                  <Lock size={15} />
                  Privacy Protected
                </div>

                <div className="flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-bold">
                  <QrCode size={16} />
                  Authentic QR
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            VEHICLE PHOTO
            ================================================= */}

        {vehicle.photo_url && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111113]">
            <img
              src={vehicle.photo_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-auto max-h-[520px] w-full object-cover"
            />
          </section>
        )}

        {/* =================================================
            VEHICLE INFORMATION
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#111113] p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <Car
                size={28}
                className="text-red-500"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Vehicle Information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Official details verified by Vehix.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Registration Number"
              value={vehicle.vehicle_number.toUpperCase()}
            />

            <InfoCard
              label="Brand"
              value={vehicle.brand.toUpperCase()}
            />

            <InfoCard
              label="Model"
              value={vehicle.model.toUpperCase()}
            />

            <InfoCard
              label="Colour"
              value={
                vehicle.colour ||
                "Not provided"
              }
            />

            <InfoCard
              label="Vehicle Type"
              value={
                vehicle.vehicle_type ||
                "Vehicle"
              }
            />

            <InfoCard
              label="Identity Status"
              value="Verified & Active"
              verified
            />
          </div>
        </section>

        {/* =================================================
            PRIVACY
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-blue-500/10 bg-blue-500/[0.04] p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
              <Lock
                size={24}
                className="text-blue-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Privacy Protected
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Vehix protects the vehicle owner's personal
                information. Private phone numbers and contact
                details are never displayed publicly through
                this QR identity.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            EMERGENCY CONTACT
            ================================================= */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/60 via-[#160609] to-[#0c0c0f] p-6 shadow-[0_15px_60px_rgba(239,68,68,0.08)] sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                <Siren
                  size={32}
                  className="text-red-400"
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                  Emergency Contact
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Need immediate help?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  Call the emergency contact associated with
                  this vehicle directly.
                </p>

                {profile?.emergency_name && (
                  <p className="mt-3 text-xs font-semibold text-zinc-600">
                    Emergency contact:{" "}
                    <span className="text-zinc-400">
                      {profile.emergency_name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={callEmergencyContact}
              className="flex w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:bg-red-500 active:scale-[0.98] sm:w-auto"
            >
              <Phone size={20} />
              Call Emergency Contact
            </button>
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-red-500/10 bg-black/20 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <p className="text-xs leading-5 text-zinc-500">
              This calls the emergency contact registered by
              the vehicle owner. It does not contact police,
              ambulance or fire services.
            </p>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#111113] p-6 sm:p-8">

          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
              Quick Actions
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Need to reach the owner?
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Choose an action below. No registration or
              contact form is required.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* CALL */}
            <ActionCard
              icon={<Phone size={25} />}
              title="Call Owner"
              description="Call the registered owner directly."
              onClick={callOwner}
            />

            {/* SMS */}
            <ActionCard
              icon={
                <MessageCircle size={25} />
              }
              title="Send SMS"
              description="Open your SMS app directly."
              onClick={sendSMS}
            />

            {/* WHATSAPP */}
            <ActionCard
              icon={
                <MessageCircle size={25} />
              }
              title="WhatsApp"
              description="Open WhatsApp directly."
              onClick={openWhatsApp}
            />

          </div>
        </section>

        {/* =================================================
            VEHICLE ALERTS
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#111113] p-6 sm:p-8">

          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
              Vehicle Alerts
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Something needs attention?
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Send a predefined notification to the vehicle
              owner instantly.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* LIGHTS */}
            <ActionCard
              icon={<Lightbulb size={25} />}
              title="Lights On"
              description="Vehicle lights appear to be on."
              disabled={actionState.loading}
              onClick={() =>
                sendVehicleAction(
                  "lights_on",
                  "Lights On"
                )
              }
            />

            {/* DOOR */}
            <ActionCard
              icon={<DoorOpen size={25} />}
              title="Door Open"
              description="Vehicle door or window appears open."
              disabled={actionState.loading}
              onClick={() =>
                sendVehicleAction(
                  "door_open",
                  "Door Open"
                )
              }
            />

            {/* BLOCKING */}
            <ActionCard
              icon={<CarFront size={25} />}
              title="Vehicle Blocking"
              description="This vehicle is blocking access."
              disabled={actionState.loading}
              onClick={() =>
                sendVehicleAction(
                  "blocking",
                  "Vehicle Blocking"
                )
              }
            />

            {/* FOUND VEHICLE */}
            <ActionCard
              icon={<Search size={25} />}
              title="Found Vehicle"
              description="Someone found or located this vehicle."
              disabled={actionState.loading}
              onClick={() =>
                sendVehicleAction(
                  "found_vehicle",
                  "Found Vehicle"
                )
              }
            />

          </div>
        </section>

        {/* =================================================
            ACTION STATUS
            ================================================= */}

        {showActionMessage && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-[#111113] p-5">

            <div className="flex items-start gap-4">

              {actionState.loading ? (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Loader2
                    size={22}
                    className="animate-spin text-blue-400"
                  />
                </div>
              ) : actionState.success ? (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <CheckCircle2
                    size={22}
                    className="text-emerald-400"
                  />
                </div>
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                  <AlertTriangle
                    size={22}
                    className="text-red-400"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">

                <p className="font-bold text-white">
                  {actionState.loading
                    ? `Sending ${successAction} alert...`
                    : actionState.success
                      ? `${successAction} alert sent`
                      : "Action unavailable"}
                </p>

                <p className="mt-1 text-sm leading-5 text-zinc-500">
                  {actionState.loading
                    ? "Please wait..."
                    : actionState.success
                      ? "The vehicle owner has been notified through Vehix."
                      : actionState.error}
                </p>
              </div>

              {!actionState.loading && (
                <button
                  type="button"
                  onClick={() =>
                    setShowActionMessage(false)
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}

            </div>
          </section>
        )}

        {/* =================================================
            OFFICIAL VERIFICATION
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#0c0c0e] p-6 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
            <ShieldCheck
              size={28}
              className="text-blue-400"
            />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Official Vehix Identity
          </p>

          <p className="mt-2 font-mono text-sm font-bold text-zinc-400">
            {qr.qr_code}
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-xs leading-5 text-zinc-700">
            This vehicle identity is controlled by Vehix.
            Vehicle information and QR activation are
            protected through the Vehix identity system.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-emerald-500">
            <ShieldCheck size={15} />
            Authentic Vehix Identity
          </div>
        </section>

        {/* =================================================
            FOOTER
            ================================================= */}

        <footer className="py-10 text-center">
          <p className="text-sm font-bold text-zinc-600">
            VEHIX
          </p>

          <p className="mt-1 text-xs text-zinc-700">
            Smart Vehicle Identity Network
          </p>

          <p className="mt-4 text-[10px] text-zinc-800">
            This vehicle identity is verified through the
            official Vehix network.
          </p>
        </footer>

      </div>
    </main>
  );
}