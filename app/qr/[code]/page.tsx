/* app/qr/[code]/page.tsx
 *
 * Replace the existing public Vehix QR page with this file.
 * If your QR route is in a different folder, keep that folder/path
 * and replace only the page.tsx contents.
 */

"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CarFront,
  CheckCircle2,
  DoorOpen,
  FileCheck2,
  History,
  Lightbulb,
  Lock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  PhoneCall,
  QrCode,
  Search,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type QRData = {
  qr_code: string;
  status: string;
  product_name: string | null;
  design_name: string | null;
  vehicle_id: string | null;
};

type VehicleData = {
  id: string;
  vehicle_number: string;
  brand: string;
  model: string;
  year?: number | null;
  colour: string | null;
  vehicle_type: string | null;
  photo_url: string | null;
  nickname?: string | null;
};

type ProfileData = {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  emergency_name: string | null;
  emergency_phone: string | null;
};

type FeatureSettings = {
  digital_identity: boolean;
  public_vehicle_page: boolean;
  vehicle_information: boolean;
  share_vehicle: boolean;
  contact_owner: boolean;
  smart_parking: boolean;
  emergency_mode: boolean;
  theft_assist: boolean;
  document_verification: boolean;
  vehicle_passport: boolean;
  smart_maintenance: boolean;
  scan_activity: boolean;
  notifications: boolean;
};

type ParkingLocation = {
  latitude: number;
  longitude: number;
  label: string | null;
  saved_at: string | null;
  directions_url: string;
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

type ContactMode = "menu" | "message" | "call" | "whatsapp" | "emergency";

const DEFAULT_FEATURES: FeatureSettings = {
  digital_identity: true,
  public_vehicle_page: true,
  vehicle_information: true,
  share_vehicle: true,
  contact_owner: true,
  smart_parking: true,
  emergency_mode: true,
  theft_assist: true,
  document_verification: true,
  vehicle_passport: true,
  smart_maintenance: true,
  scan_activity: true,
  notifications: true,
};

const contactReasons = [
  { value: "blocking", label: "Vehicle is blocking me" },
  { value: "lights_on", label: "Lights/accessories are left on" },
  { value: "door_open", label: "Door/window appears open" },
  { value: "accident", label: "Possible accident or damage" },
  { value: "found_item", label: "I found something related to this vehicle" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `91${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return digits;
}

async function readApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  throw new Error(
    text || `Request failed with status ${response.status}.`
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: ReactNode;
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
      className={`group flex min-h-[132px] w-full flex-col justify-between rounded-3xl border p-5 text-left transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-500/20 bg-red-500/[0.04] hover:border-red-500/50 hover:bg-red-500/[0.08]"
          : "border-white/10 bg-[#0a0b0f] hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            danger
              ? "bg-red-500/10 text-red-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="mt-1 text-zinc-700 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400"
        />
      </div>

      <div className="mt-4">
        <p
          className={`text-base font-black ${
            danger ? "text-red-100" : "text-white"
          }`}
        >
          {title}
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </button>
  );
}

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
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <p className="break-words text-sm font-bold text-white">{value}</p>

        {verified && (
          <CheckCircle2
            size={16}
            className="shrink-0 text-emerald-400"
          />
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  onClick,
  tone = "blue",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  tone?: "blue" | "red" | "green" | "amber" | "purple";
}) {
  const toneClasses = {
    blue: "border-blue-500/10 bg-blue-500/[0.035] text-blue-400",
    red: "border-red-500/10 bg-red-500/[0.035] text-red-400",
    green: "border-emerald-500/10 bg-emerald-500/[0.035] text-emerald-400",
    amber: "border-amber-500/10 bg-amber-500/[0.035] text-amber-400",
    purple: "border-purple-500/10 bg-purple-500/[0.035] text-purple-400",
  };

  const content = (
    <>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-black text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-600">
            {description}
          </p>
        </div>

        {onClick && (
          <ArrowRight
            size={17}
            className="mt-1 shrink-0 text-zinc-700"
          />
        )}
      </div>
    </>
  );

  if (!onClick) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0d0d10] p-5">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl border border-white/10 bg-[#0d0d10] p-5 text-left transition hover:border-white/20 hover:bg-white/[0.025] active:scale-[0.99]"
    >
      {content}
    </button>
  );
}

export default function QRVehiclePage() {
  const params = useParams();

  const code =
    typeof params?.code === "string"
      ? params.code
      : Array.isArray(params?.code)
        ? params.code[0]
        : "";

  const [qr, setQr] = useState<QRData | null>(null);
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [features, setFeatures] =
    useState<FeatureSettings>(DEFAULT_FEATURES);

  const [parkingLocation, setParkingLocation] =
    useState<ParkingLocation | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [notActivated, setNotActivated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [actionState, setActionState] = useState<ActionState>({
    loading: false,
    success: false,
    error: "",
  });

  const [successAction, setSuccessAction] = useState("");
  const [showActionMessage, setShowActionMessage] = useState(false);

  const [showContact, setShowContact] = useState(false);
  const [contactMode, setContactMode] =
    useState<ContactMode>("menu");
  const [senderName, setSenderName] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [showInfo, setShowInfo] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showTheft, setShowTheft] = useState(false);

  const vehicleName = useMemo(() => {
    if (!vehicle) return "";
    return `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();
  }, [vehicle]);

  const vehicleMeta = useMemo(() => {
    if (!vehicle) return [];

    return [
      vehicle.colour,
      vehicle.vehicle_type,
      vehicle.year ? String(vehicle.year) : null,
    ].filter(Boolean) as string[];
  }, [vehicle]);

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

        const normalizedCode = code.trim().toUpperCase();

        /* -------------------------------------------------------
           1. VERIFY QR
           ------------------------------------------------------- */
        const {
          data: qrData,
          error: qrError,
        } = await supabase
          .from("qr_inventory")
          .select(
            "qr_code, status, product_name, design_name, vehicle_id"
          )
          .eq("qr_code", normalizedCode)
          .maybeSingle();

        if (qrError) {
          console.error("QR lookup error:", qrError);

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

        /* -------------------------------------------------------
           2. ACTIVATION
           ------------------------------------------------------- */
        if (qrData.status !== "activated") {
          setNotActivated(true);
          setLoading(false);
          return;
        }

        if (!qrData.vehicle_id) {
          setErrorMessage(
            "This QR is activated but is not linked to a vehicle."
          );
          setLoading(false);
          return;
        }

        /* -------------------------------------------------------
           3. PUBLIC VEHICLE DATA
           IMPORTANT: use vehicle_public, not private vehicles.
           ------------------------------------------------------- */
        const {
          data: vehicleData,
          error: vehicleError,
        } = await supabase
          .from("vehicle_public")
          .select(
            "id, vehicle_number, brand, model, year, colour, vehicle_type, photo_url, nickname"
          )
          .eq("id", qrData.vehicle_id)
          .maybeSingle();

        if (vehicleError) {
          console.error("Vehicle lookup error:", vehicleError);

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

        /* -------------------------------------------------------
           4. PUBLIC SMART PARKING LOCATION
           Only the explicitly supported parking fields are returned
           by the server. The public page never reads the private
           vehicles table for location data.
           ------------------------------------------------------- */
        try {
          const parkingResponse = await fetch(
            `/api/public-vehicle-location?qr_code=${encodeURIComponent(
              normalizedCode
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          const parkingResult =
            await readApiResponse(parkingResponse);

          if (
            parkingResponse.ok &&
            parkingResult?.success &&
            parkingResult?.location
          ) {
            setParkingLocation(parkingResult.location);
          } else {
            setParkingLocation(null);
          }
        } catch (parkingError) {
          console.warn(
            "Public parking location lookup failed:",
            parkingError
          );

          setParkingLocation(null);
        }

        /* -------------------------------------------------------
           5. FEATURE VISIBILITY
           The endpoint returns only public-safe feature flags.
           ------------------------------------------------------- */
        try {
          const settingsResponse = await fetch(
            `/api/public-vehicle-settings?qr_code=${encodeURIComponent(
              normalizedCode
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          const settingsResult =
            await readApiResponse(settingsResponse);

          if (
            settingsResponse.ok &&
            settingsResult?.success &&
            settingsResult?.settings
          ) {
            setFeatures({
              ...DEFAULT_FEATURES,
              ...settingsResult.settings,
            });
          } else {
            console.warn(
              "Public feature settings unavailable; using safe defaults.",
              settingsResult?.error
            );
          }
        } catch (settingsError) {
          console.warn(
            "Public feature settings lookup failed:",
            settingsError
          );
        }

        /* -------------------------------------------------------
           6. SECURE PUBLIC CONTACT GATEWAY
           ------------------------------------------------------- */
        const {
          data: contactData,
          error: contactError,
        } = await supabase.rpc(
          "get_public_vehicle_contact",
          {
            p_qr_code: qrData.qr_code,
          }
        );

        if (contactError) {
          console.warn(
            "Vehix public contact lookup:",
            contactError
          );
        } else if (contactData && !cancelled) {
          setProfile({
            id: "public-contact",
            phone: contactData.phone ?? null,
            whatsapp: contactData.whatsapp ?? null,
            emergency_name:
              contactData.emergency_name ?? null,
            emergency_phone:
              contactData.emergency_phone ?? null,
          });
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

  const callOwner = () => {
    setSent(false);
    setErrorMessage("");
    setContactMode("call");
    setReason("other");
    setMessage(
      "I would like to speak with the vehicle owner regarding this vehicle."
    );
    setSenderContact("");
    setShowContact(true);
  };

  const sendSMS = () => {
    const phone = normalizePhone(profile?.phone);

    if (!phone) {
      setActionState({
        loading: false,
        success: false,
        error:
          "The vehicle owner has not configured a phone number yet.",
      });
      setShowActionMessage(true);
      return;
    }

    const text = encodeURIComponent(
      "Hi, I scanned your Vehix vehicle QR. I need to contact you regarding your vehicle."
    );

    window.location.href = `sms:+${phone}?body=${text}`;
  };

  const openWhatsApp = () => {
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
      setShowActionMessage(true);
      return;
    }

    const text = encodeURIComponent(
      "Hi, I scanned your Vehix vehicle QR and need to contact you regarding your vehicle."
    );

    window.location.href =
      `https://wa.me/${whatsappNumber}?text=${text}`;
  };

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
      setShowActionMessage(true);
      return;
    }

    window.location.href = `tel:+${emergencyPhone}`;
  };

  const openContactForm = () => {
    setSent(false);
    setErrorMessage("");
    setContactMode("menu");
    setShowContact(true);
  };

  const closeContactForm = () => {
    if (sending) return;

    setShowContact(false);
    setContactMode("menu");
    setErrorMessage("");
  };

  const openMessageMode = () => {
    setSent(false);
    setErrorMessage("");
    setContactMode("message");
  };

  const openQuickRequest = (
    mode: "call" | "whatsapp" | "emergency"
  ) => {
    setSent(false);
    setErrorMessage("");
    setContactMode(mode);

    if (mode === "call") {
      setReason("other");
      setMessage(
        "I would like to request a private call regarding this vehicle. Please contact me through the secure Vehix system."
      );
    }

    if (mode === "whatsapp") {
      setReason("other");
      setMessage(
        "I would like to contact the vehicle owner through WhatsApp. Please respond through the secure Vehix system."
      );
    }

    if (mode === "emergency") {
      setReason("emergency");
      setMessage(
        "URGENT: I need the vehicle owner to be contacted regarding an emergency involving this vehicle."
      );
    }
  };

  const backToContactMenu = () => {
    if (sending) return;

    setErrorMessage("");
    setContactMode("menu");
  };

  const handleContactSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (contactMode === "call") {
      if (!senderContact.trim()) {
        setErrorMessage(
          "Enter your phone number so Vehix can call you."
        );
        return;
      }

      try {
        setSending(true);

        const response = await fetch(
          "/api/vehicle-call",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              qr_code: code,
              caller_phone: senderContact.trim(),
            }),
          }
        );

        const result = await readApiResponse(response);

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.error ||
              "Unable to start the private call."
          );
        }

        setSent(true);
        setSenderContact("");
      } catch (error) {
        console.error("Vehix private call error:", error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to start the private call."
        );
      } finally {
        setSending(false);
      }

      return;
    }

    if (!reason) {
      setErrorMessage(
        "Please select a reason for contacting the owner."
      );
      return;
    }

    if (!message.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }

    if (message.trim().length < 3) {
      setErrorMessage(
        "Please enter a little more information."
      );
      return;
    }

    if (message.trim().length > 1000) {
      setErrorMessage(
        "Your message cannot exceed 1000 characters."
      );
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        "/api/vehicle-contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qr_code: code,
            reason,
            message: message.trim(),
            sender_name:
              senderName.trim() || undefined,
            sender_contact:
              senderContact.trim() || undefined,
          }),
        }
      );

      const result = await readApiResponse(response);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            "Unable to send your message."
        );
      }

      setSent(true);
      setSenderName("");
      setSenderContact("");
      setReason("");
      setMessage("");
    } catch (error) {
      console.error(
        "Contact owner error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your message."
      );
    } finally {
      setSending(false);
    }
  };

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

      const result = await readApiResponse(response);

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

  const shareVehicle = async () => {
    if (!vehicle || !qr) return;

    const url = window.location.href;
    const shareText =
      `Vehix vehicle identity — ${vehicle.vehicle_number.toUpperCase()}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareText,
          text: `View the verified Vehix identity for ${vehicleName}.`,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);

      setActionState({
        loading: false,
        success: true,
        error: "",
      });
      setSuccessAction("Vehicle link");
      setShowActionMessage(true);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      setActionState({
        loading: false,
        success: false,
        error:
          "Unable to share this vehicle link on your device.",
      });
      setShowActionMessage(true);
    }
  };

  const openParking = () => {
    if (!features.smart_parking) return;

    if (!parkingLocation) {
      setActionState({
        loading: false,
        success: false,
        error:
          "No public parking location has been shared for this vehicle.",
      });
      setSuccessAction("Smart Parking");
      setShowActionMessage(true);
      return;
    }

    window.open(
      parkingLocation.directions_url,
      "_blank",
      "noopener,noreferrer"
    );
  };

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

  if (
    errorMessage ||
    !vehicle ||
    !qr
  ) {
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

  /*
   * If public_vehicle_page is explicitly disabled, don't expose
   * the feature experience. The QR itself remains verified.
   */
  if (!features.public_vehicle_page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-500/10">
            <Lock size={38} className="text-zinc-400" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-2xl font-black">
            Vehicle Page Private
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            The vehicle owner has chosen not to make this Vehix
            identity page publicly available.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
            <ShieldCheck size={15} />
            Authentic Vehix QR
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050506] text-white selection:bg-red-500/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-260px] right-[-160px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.05] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-4 sm:px-6 sm:pt-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
              <ShieldCheck size={20} className="text-red-500" />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.18em]">
                VEHIX
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                Smart Vehicle Identity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-bold text-emerald-400">
              VERIFIED
            </span>
          </div>
        </header>

        {/* =====================================================
            VEHICLE IDENTITY
            ===================================================== */}
        {features.digital_identity && (
          <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.18),transparent_48%)]" />

            <div className="relative p-6 sm:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                    Official Vehix Identity
                  </span>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.08]">
                  <Car size={30} className="text-red-500" />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600">
                  Vehicle Registration
                </p>

                <h1 className="mt-2 break-all text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                  {vehicle.vehicle_number.toUpperCase()}
                </h1>

                <p className="mt-3 text-lg font-semibold text-zinc-300 sm:text-xl">
                  {vehicleName.toUpperCase()}
                </p>

                {vehicle.nickname && (
                  <p className="mt-2 text-sm font-medium text-zinc-500">
                    {vehicle.nickname}
                  </p>
                )}

                {vehicleMeta.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {vehicleMeta.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black">
                    <CheckCircle2 size={13} />
                    Active
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <Lock size={13} />
                    Privacy Protected
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {vehicle.photo_url && features.digital_identity && (
          <section className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d10]">
            <img
              src={vehicle.photo_url}
              alt={vehicleName}
              className="max-h-[560px] w-full object-cover"
            />
          </section>
        )}

        {/* =====================================================
            PRIMARY CONTACT
            ===================================================== */}
        {features.contact_owner && (
          <section className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#161619] to-[#0b0b0d] p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-red-400">
                  <Phone size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                    Need to reach the owner?
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  Contact the vehicle owner
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-5 text-zinc-500">
                  Choose a secure way to notify or contact the registered owner.
                </p>
              </div>

              <button
                type="button"
                onClick={openContactForm}
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500 active:scale-[0.98] sm:w-auto"
              >
                <Phone size={18} />
                Contact Owner
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.08] active:scale-[0.98]"
              >
                <MessageCircle size={17} />
                WhatsApp
              </button>

              <button
                type="button"
                onClick={sendSMS}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.08] active:scale-[0.98]"
              >
                <MessageCircle size={17} />
                SMS
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-600">
              <Lock size={12} />
              Owner contact details are not displayed publicly.
            </div>
          </section>
        )}

        {/* =====================================================
            QUICK ACTIONS
            ===================================================== */}
        {(features.contact_owner ||
          features.smart_parking ||
          features.emergency_mode ||
          features.share_vehicle) && (
          <section className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.smart_parking && (
              <FeatureCard
                icon={<MapPin size={20} />}
                title="Find Vehicle"
                description={
                  parkingLocation
                    ? "Navigate to the shared parking location."
                    : "No public parking location has been shared yet."
                }
                onClick={openParking}
                tone="green"
              />
            )}

            {features.emergency_mode && (
              <FeatureCard
                icon={<Siren size={20} />}
                title="Emergency Contact"
                description="Reach the emergency contact configured for this vehicle."
                onClick={callEmergencyContact}
                tone="red"
              />
            )}

            {features.share_vehicle && (
              <FeatureCard
                icon={<Share2 size={20} />}
                title="Share Vehicle"
                description="Share this verified Vehix vehicle identity with another person."
                onClick={shareVehicle}
                tone="blue"
              />
            )}

            {features.contact_owner && (
              <FeatureCard
                icon={<PhoneCall size={20} />}
                title="Private Contact"
                description="Send a private message, call request or WhatsApp request through Vehix."
                onClick={openContactForm}
                tone="purple"
              />
            )}
          </section>
        )}

        {/* =====================================================
            VEHICLE INFORMATION
            ===================================================== */}
        {features.vehicle_information && (
          <section className="mt-4 rounded-[2rem] border border-white/10 bg-[#0d0d10] p-5 sm:p-7">
            <button
              type="button"
              onClick={() => setShowInfo((value) => !value)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/[0.08]">
                  <Car size={22} className="text-red-500" />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Vehicle Information
                  </h2>
                  <p className="text-xs text-zinc-600">
                    Public vehicle details selected for this identity.
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className={`text-zinc-600 transition-transform ${
                  showInfo ? "rotate-90" : ""
                }`}
              />
            </button>

            {showInfo && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoCard
                  label="Registration"
                  value={vehicle.vehicle_number.toUpperCase()}
                  verified
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
                  value={vehicle.colour || "Not provided"}
                />
                <InfoCard
                  label="Vehicle Type"
                  value={vehicle.vehicle_type || "Vehicle"}
                />
                {vehicle.year && (
                  <InfoCard
                    label="Year"
                    value={String(vehicle.year)}
                  />
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            VERIFICATION
            ===================================================== */}
        {features.document_verification && (
          <section className="mt-4 rounded-[2rem] border border-white/10 bg-[#0d0d10] p-5 sm:p-7">
            <button
              type="button"
              onClick={() =>
                setShowVerification((value) => !value)
              }
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/[0.08]">
                  <FileCheck2
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Verification
                  </h2>
                  <p className="text-xs text-zinc-600">
                    Public verification status without exposing private documents.
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className={`text-zinc-600 transition-transform ${
                  showVerification ? "rotate-90" : ""
                }`}
              />
            </button>

            {showVerification && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <InfoCard
                  label="Vehix QR"
                  value="Authentic"
                  verified
                />
                <InfoCard
                  label="Identity"
                  value="Active"
                  verified
                />
                <InfoCard
                  label="Public Documents"
                  value="Owner Controlled"
                />
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            VEHICLE PASSPORT
            ===================================================== */}
        {features.vehicle_passport && (
          <section className="mt-4 rounded-[2rem] border border-purple-500/10 bg-purple-500/[0.025] p-5 sm:p-7">
            <button
              type="button"
              onClick={() => setShowPassport((value) => !value)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                  <History
                    size={22}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-400">
                    Vehicle Passport
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    Vehicle history
                  </h2>
                </div>
              </div>

              <ArrowRight
                size={18}
                className={`text-zinc-600 transition-transform ${
                  showPassport ? "rotate-90" : ""
                }`}
              />
            </button>

            {showPassport && (
              <div className="mt-6">
                <div className="relative ml-2 border-l border-white/10 pl-6">
                  {[
                    ["Vehicle Created", "Vehicle identity registered"],
                    ["Documents", "Vehicle records managed privately"],
                    ["Services", "Maintenance history"],
                    ["Insurance", "Insurance records"],
                    ["PUC", "Pollution certificate records"],
                    ["Ownership", "Ownership history"],
                    ["Vehix QR Identity", "Connected digital identity"],
                  ].map(([title, description], index) => (
                    <div
                      key={title}
                      className="relative pb-6 last:pb-0"
                    >
                      <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-purple-500/30 bg-[#111113]">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            index === 6
                              ? "bg-emerald-400"
                              : "bg-purple-400"
                          }`}
                        />
                      </span>

                      <p className="text-sm font-black text-white">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-zinc-600">
                  Private documents and sensitive ownership records are not
                  displayed on this public QR page.
                </p>
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            SMART MAINTENANCE
            ===================================================== */}
        {features.smart_maintenance && (
          <section className="mt-4 rounded-[2rem] border border-amber-500/10 bg-amber-500/[0.025] p-5 sm:p-7">
            <button
              type="button"
              onClick={() =>
                setShowMaintenance((value) => !value)
              }
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                  <Wrench
                    size={22}
                    className="text-amber-400"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                    Smart Maintenance
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    Keep vehicle care organized
                  </h2>
                </div>
              </div>

              <ArrowRight
                size={18}
                className={`text-zinc-600 transition-transform ${
                  showMaintenance ? "rotate-90" : ""
                }`}
              />
            </button>

            {showMaintenance && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <FeatureCard
                  icon={<Wrench size={20} />}
                  title="Service History"
                  description="Vehicle service records belong to the owner's private maintenance history."
                  tone="amber"
                />

                <FeatureCard
                  icon={<Sparkles size={20} />}
                  title="Maintenance Ready"
                  description="Maintenance information can be organized alongside the vehicle identity."
                  tone="blue"
                />
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            THEFT ASSIST
            ===================================================== */}
        {features.theft_assist && (
          <section className="mt-4 rounded-[2rem] border border-red-500/15 bg-red-950/10 p-5 sm:p-7">
            <button
              type="button"
              onClick={() => setShowTheft((value) => !value)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                  <ShieldAlert
                    size={22}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
                    Theft Assist
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    Vehicle safety
                  </h2>
                </div>
              </div>

              <ArrowRight
                size={18}
                className={`text-zinc-600 transition-transform ${
                  showTheft ? "rotate-90" : ""
                }`}
              />
            </button>

            {showTheft && (
              <div className="mt-5">
                <div className="rounded-2xl border border-red-500/10 bg-black/20 p-4">
                  <div className="flex gap-3">
                    <ShieldAlert
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Owner-controlled theft assistance
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        Theft status and sensitive recovery information should
                        only be shown when the registered owner has activated
                        the corresponding Vehix safety feature.
                      </p>
                    </div>
                  </div>
                </div>

                {features.contact_owner && (
                  <button
                    type="button"
                    onClick={openContactForm}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-black transition hover:bg-red-500"
                  >
                    <PhoneCall size={17} />
                    Contact Owner About This Vehicle
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            VEHICLE ALERTS
            ===================================================== */}
        {features.notifications && (
          <section className="mt-4 rounded-[2rem] border border-white/10 bg-[#0d0d10] p-5 sm:p-7">
            <div className="mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                Owner Alerts
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Something needs attention?
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Send a predefined notification to the vehicle owner.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ActionCard
                icon={<Lightbulb size={21} />}
                title="Lights On"
                description="The vehicle lights appear to be on."
                disabled={actionState.loading}
                onClick={() =>
                  sendVehicleAction(
                    "lights_on",
                    "Lights On"
                  )
                }
              />

              <ActionCard
                icon={<DoorOpen size={21} />}
                title="Door Open"
                description="A door or window appears to be open."
                disabled={actionState.loading}
                onClick={() =>
                  sendVehicleAction(
                    "door_open",
                    "Door Open"
                  )
                }
              />

              <ActionCard
                icon={<CarFront size={21} />}
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

              <ActionCard
                icon={<Search size={21} />}
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
        )}

        {showActionMessage && (
          <section className="mt-4 rounded-2xl border border-white/10 bg-[#0d0d10] p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  actionState.loading
                    ? "bg-blue-500/10"
                    : actionState.success
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                }`}
              >
                {actionState.loading ? (
                  <QrCode
                    size={19}
                    className="animate-pulse text-blue-400"
                  />
                ) : actionState.success ? (
                  <CheckCircle2
                    size={19}
                    className="text-emerald-400"
                  />
                ) : (
                  <AlertTriangle
                    size={19}
                    className="text-red-400"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">
                  {actionState.loading
                    ? `Sending ${successAction} alert...`
                    : actionState.success
                      ? `${successAction} alert sent`
                      : "Action unavailable"}
                </p>

                <p className="mt-0.5 text-xs text-zinc-600">
                  {actionState.loading
                    ? "Please wait..."
                    : actionState.success
                      ? "The request was sent through Vehix."
                      : actionState.error}
                </p>
              </div>

              {!actionState.loading && (
                <button
                  type="button"
                  onClick={() =>
                    setShowActionMessage(false)
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-white/5 hover:text-white"
                  aria-label="Close"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            SMART PARKING DETAIL
            ===================================================== */}
        {features.smart_parking && (
          <section className="mt-4 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/[0.025] p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Navigation
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                    Smart Parking
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    {parkingLocation
                      ? "Parking location available"
                      : "Parking location not shared"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {parkingLocation
                      ? parkingLocation.label ||
                        "A parking location has been shared for this vehicle."
                      : "The vehicle owner has not shared a public parking location."}
                  </p>

                  {parkingLocation?.saved_at && (
                    <p className="mt-2 text-[11px] text-zinc-700">
                      Last saved {
                        new Date(
                          parkingLocation.saved_at
                        ).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      }
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={openParking}
                disabled={!parkingLocation}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MapPin size={17} />
                {parkingLocation
                  ? "Navigate"
                  : "Location Unavailable"}
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            QR VERIFICATION
            ===================================================== */}
        <section className="mt-4 rounded-[2rem] border border-white/10 bg-[#0c0c0e] p-6 text-center">
          <QrCode
            size={32}
            className="mx-auto text-zinc-600"
          />

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Official Vehix QR
          </p>

          <p className="mt-2 break-all font-mono text-sm font-bold text-zinc-400">
            {qr.qr_code}
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-emerald-500">
            <ShieldCheck size={15} />
            Authentic Vehix Identity
          </div>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-blue-500/10 bg-blue-500/[0.035] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Lock size={20} className="text-blue-400" />
            </div>

            <h3 className="mt-4 text-base font-black">
              Privacy Protected
            </h3>

            <p className="mt-2 text-xs leading-5 text-zinc-600">
              Personal phone numbers and private account information
              are not displayed publicly through this QR identity.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0d0d10] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <ShieldCheck
                size={20}
                className="text-emerald-400"
              />
            </div>

            <h3 className="mt-4 text-base font-black">
              Verified Vehicle
            </h3>

            <p className="mt-2 text-xs leading-5 text-zinc-600">
              This identity is linked to an active Vehix QR and
              the public vehicle record.
            </p>
          </div>
        </section>

        <footer className="px-2 py-10 text-center">
          <div className="mx-auto mb-4 h-px max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <p className="text-sm font-black tracking-[0.2em] text-zinc-700">
            VEHIX™
          </p>

          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-800">
            Smart Vehicle Identity Network
          </p>
        </footer>
      </div>

      {/* =======================================================
          CONTACT OWNER MODAL
          ======================================================= */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#111113] p-6 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
                  {contactMode === "emergency" ? (
                    <Siren
                      size={24}
                      className="text-red-400"
                    />
                  ) : contactMode === "call" ? (
                    <PhoneCall
                      size={24}
                      className="text-red-500"
                    />
                  ) : contactMode === "whatsapp" ? (
                    <MessageCircle
                      size={24}
                      className="text-emerald-400"
                    />
                  ) : (
                    <Phone
                      size={24}
                      className="text-red-500"
                    />
                  )}
                </div>

                <h2 className="text-2xl font-black">
                  {contactMode === "menu"
                    ? "Contact Vehicle Owner"
                    : contactMode === "call"
                      ? "Request a Private Call"
                      : contactMode === "whatsapp"
                        ? "Request WhatsApp Contact"
                        : contactMode === "emergency"
                          ? "Emergency Contact"
                          : "Send Private Message"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {contactMode === "menu"
                    ? "Choose a secure way to contact the vehicle owner. Their personal details remain hidden."
                    : contactMode === "call"
                      ? "Request a private call without displaying the owner's phone number."
                      : contactMode === "whatsapp"
                        ? "Request WhatsApp contact without displaying the owner's number."
                        : contactMode === "emergency"
                          ? "Send an urgent alert to the vehicle owner."
                          : "Send a private message through Vehix."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeContactForm}
                disabled={sending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10">
                  <CheckCircle2
                    size={42}
                    className="text-emerald-400"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {contactMode === "emergency"
                    ? "Emergency Alert Sent"
                    : contactMode === "call"
                      ? "Call Request Sent"
                      : contactMode === "whatsapp"
                        ? "WhatsApp Request Sent"
                        : "Message Sent"}
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                  Your request has been securely sent through Vehix.
                  No private owner contact information was revealed.
                </p>

                <button
                  type="button"
                  onClick={closeContactForm}
                  className="mt-7 rounded-2xl bg-red-600 px-6 py-3.5 text-sm font-bold transition hover:bg-red-500"
                >
                  Done
                </button>
              </div>
            ) : contactMode === "menu" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={openMessageMode}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-red-500/30 hover:bg-red-500/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                    <MessageCircle
                      size={23}
                      className="text-red-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">
                      Send Private Message
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Send a secure message without revealing personal contact details.
                    </p>
                  </div>

                  <span className="text-zinc-600">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => openQuickRequest("call")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                    <PhoneCall
                      size={23}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">
                      Request a Private Call
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Ask the owner to contact you.
                    </p>
                  </div>

                  <span className="text-zinc-600">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => openQuickRequest("whatsapp")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <MessageCircle
                      size={23}
                      className="text-emerald-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">
                      Request WhatsApp Contact
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Request WhatsApp contact without exposing the owner's number.
                    </p>
                  </div>

                  <span className="text-zinc-600">→</span>
                </button>

                {features.emergency_mode && (
                  <button
                    type="button"
                    onClick={() =>
                      openQuickRequest("emergency")
                    }
                    className="group flex w-full items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4 text-left transition hover:border-red-500/40 hover:bg-red-500/10"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                      <Siren
                        size={23}
                        className="text-red-400"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-red-200">
                        Emergency
                      </p>
                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        Send an urgent alert to the vehicle owner.
                      </p>
                    </div>

                    <span className="text-zinc-600">→</span>
                  </button>
                )}

                <div className="mt-5 flex gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                  <Lock
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />

                  <p className="text-xs leading-5 text-zinc-500">
                    Vehix keeps the owner's personal phone number and
                    email hidden from the public identity page.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="space-y-5"
              >
                <button
                  type="button"
                  onClick={backToContactMenu}
                  disabled={sending}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-white disabled:opacity-50"
                >
                  ← Back to contact options
                </button>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Why are you contacting the owner?
                  </label>

                  <select
                    value={reason}
                    onChange={(event) =>
                      setReason(event.target.value)
                    }
                    disabled={
                      sending ||
                      contactMode !== "message"
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none focus:border-red-500/50 disabled:opacity-70"
                  >
                    <option value="">
                      Select a reason
                    </option>

                    {contactReasons.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Your Name
                    <span className="ml-2 text-xs font-normal text-zinc-600">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={senderName}
                    onChange={(event) =>
                      setSenderName(event.target.value)
                    }
                    disabled={sending}
                    maxLength={100}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    {contactMode === "call"
                      ? "Your Phone Number"
                      : "Your Contact"}
                    <span className="ml-2 text-xs font-normal text-zinc-600">
                      {contactMode === "call"
                        ? "Required"
                        : "Optional"}
                    </span>
                  </label>

                  <input
                    type="tel"
                    value={senderContact}
                    onChange={(event) =>
                      setSenderContact(event.target.value)
                    }
                    disabled={sending}
                    maxLength={20}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={
                      contactMode === "call"
                        ? "+91 XXXXX XXXXX"
                        : "Phone or email"
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-red-500/50"
                  />

                  {contactMode === "call" && (
                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Vehix will call this number first. After you answer,
                      the secure call is connected to the vehicle owner.
                    </p>
                  )}
                </div>

                {contactMode !== "call" && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      {contactMode === "emergency"
                        ? "Emergency Details"
                        : contactMode === "whatsapp"
                          ? "WhatsApp Request"
                          : "Message"}
                    </label>

                    <span className="text-xs text-zinc-700">
                      {message.length}/1000
                    </span>
                  </div>

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    disabled={sending}
                    maxLength={1000}
                    rows={5}
                    placeholder="Tell the vehicle owner what happened..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-red-500/50"
                  />
                </div>
                )}

                {contactMode === "emergency" && (
                  <div className="flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                    <Siren
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-xs leading-5 text-red-300/80">
                      Vehix alerts the vehicle owner. It does not
                      contact police, ambulance or fire services.
                    </p>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-sm leading-6 text-red-300">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                  <Lock
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />

                  <p className="text-xs leading-5 text-zinc-500">
                    Your request is sent through Vehix. The vehicle
                    owner's private contact information is not displayed.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <QrCode
                        size={19}
                        className="animate-pulse"
                      />
                      Sending Securely...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {contactMode === "emergency"
                        ? "Send Emergency Alert"
                        : contactMode === "call"
                          ? "Call Vehicle Owner"
                          : contactMode === "whatsapp"
                            ? "Send WhatsApp Request"
                            : "Send Secure Message"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
