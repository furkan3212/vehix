"use client";

import { useEffect, useState } from "react";

import {
  User,
  Phone,
  MessageCircle,
  Shield,
  Save,
  ArrowLeft,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  getOrCreateProfile,
  updateProfile,
} from "@/services/profile";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Account

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Emergency

  const [emergencyName, setEmergencyName] =
    useState("");

  const [emergencyPhone, setEmergencyPhone] =
    useState("");

  // Privacy

  const [allowCall, setAllowCall] =
    useState(true);

  const [allowWhatsapp, setAllowWhatsapp] =
    useState(true);

  const [allowSms, setAllowSms] =
    useState(true);

  const [allowEmergency, setAllowEmergency] =
    useState(true);

  const [
    allowLocationShare,
    setAllowLocationShare,
  ] = useState(true);

  async function loadProfile() {
    try {
      setLoading(true);

      const result =
        await getOrCreateProfile();

      if (!result.success || !result.data) {
        setError(
          result.error ??
            "Unable to load profile."
        );
        return;
      }

      const profile = result.data;

      setFullName(profile.full_name ?? "");
      setEmail(profile.email ?? "");

      setPhone(profile.phone ?? "");
      setWhatsapp(profile.whatsapp ?? "");

      setEmergencyName(
        profile.emergency_name ?? ""
      );

      setEmergencyPhone(
        profile.emergency_phone ?? ""
      );

      setAllowCall(profile.allow_call);

      setAllowWhatsapp(
        profile.allow_whatsapp
      );

      setAllowSms(profile.allow_sms);

      setAllowEmergency(
        profile.allow_emergency
      );

      setAllowLocationShare(
        profile.allow_location_share
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave() {
    try {
      setSaving(true);

      setError("");
      setSuccess("");

      const result =
        await updateProfile({
          full_name: fullName.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),

          emergency_name:
            emergencyName.trim(),

          emergency_phone:
            emergencyPhone.trim(),

          allow_call: allowCall,

          allow_whatsapp:
            allowWhatsapp,

          allow_sms: allowSms,

          allow_emergency:
            allowEmergency,

          allow_location_share:
            allowLocationShare,
        });

      if (!result.success) {
        setError(
          result.error ??
            "Failed to update profile."
        );

        return;
      }

      setSuccess(
        "Profile updated successfully."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-red-600 border-t-transparent"/>

          <p className="mt-6 text-zinc-400">

            Loading Profile...

          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}

<div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

  <div>

    <button
      onClick={() => router.push("/dashboard")}
      className="mb-5 flex items-center gap-2 text-zinc-400 transition hover:text-white"
    >
      <ArrowLeft size={18} />
      Back to Dashboard
    </button>

    <h1 className="text-5xl font-black tracking-tight">
      My Profile
    </h1>

    <p className="mt-3 max-w-xl text-lg text-zinc-400">
      Manage your Vehix account, emergency contact and privacy settings.
    </p>

  </div>

  <div className="rounded-3xl bg-gradient-to-br from-red-700 to-red-500 p-6 shadow-[0_0_40px_rgba(220,38,38,0.35)]">

    <User size={42} />

  </div>

</div>

{/* Account Information */}

<div className="rounded-[32px] border border-zinc-800 bg-zinc-900 p-8">

  <div className="mb-8 flex items-center gap-4">

    <div className="rounded-2xl bg-red-600 p-4">

      <User size={28} />

    </div>

    <div>

      <h2 className="text-3xl font-bold">
        Account Information
      </h2>

      <p className="text-zinc-400">
        Your primary Vehix account details.
      </p>

    </div>

  </div>

  <div className="grid gap-6 md:grid-cols-2">

    {/* Full Name */}

    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-400">
        Full Name
      </label>

      <input
        type="text"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
        placeholder="Enter your full name"
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none transition focus:border-red-500"
      />

    </div>

    {/* Email */}

    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-400">
        Email Address
      </label>

      <input
        type="email"
        value={email}
        readOnly
        className="w-full cursor-not-allowed rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-4 text-zinc-400"
      />

    </div>

    {/* Phone */}

    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-400">

        <Phone size={16} />

        Phone Number

      </label>

      <input
        type="tel"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        placeholder="+91 XXXXX XXXXX"
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none transition focus:border-red-500"
      />

    </div>

    {/* WhatsApp */}

    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-400">

        <MessageCircle size={16} />

        WhatsApp Number

      </label>

      <input
        type="tel"
        value={whatsapp}
        onChange={(e) =>
          setWhatsapp(e.target.value)
        }
        placeholder="+91 XXXXX XXXXX"
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none transition focus:border-red-500"
      />

    </div>

  </div>

</div>
{/* Emergency Contact */}

<div className="mt-10 rounded-[32px] border border-zinc-800 bg-zinc-900 p-8">

  <div className="mb-8 flex items-center gap-4">

    <div className="rounded-2xl bg-orange-500 p-4">

      <Phone size={28} className="text-black" />

    </div>

    <div>

      <h2 className="text-3xl font-bold">
        Emergency Contact
      </h2>

      <p className="text-zinc-400">
        This contact can be shown on your Vehix QR page during emergencies.
      </p>

    </div>

  </div>

  <div className="grid gap-6 md:grid-cols-2">

    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-400">
        Emergency Contact Name
      </label>

      <input
        type="text"
        value={emergencyName}
        onChange={(e) =>
          setEmergencyName(e.target.value)
        }
        placeholder="Father, Brother, Friend..."
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none transition focus:border-orange-500"
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-400">
        Emergency Contact Number
      </label>

      <input
        type="tel"
        value={emergencyPhone}
        onChange={(e) =>
          setEmergencyPhone(e.target.value)
        }
        placeholder="+91 XXXXX XXXXX"
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none transition focus:border-orange-500"
      />

    </div>

  </div>

</div>

{/* Privacy Settings */}

<div className="mt-10 rounded-[32px] border border-zinc-800 bg-zinc-900 p-8">

  <div className="mb-8 flex items-center gap-4">

    <div className="rounded-2xl bg-green-600 p-4">

      <Shield size={28} />

    </div>

    <div>

      <h2 className="text-3xl font-bold">
        Privacy Settings
      </h2>

      <p className="text-zinc-400">
        Decide what people can access after scanning your Vehix QR.
      </p>

    </div>

  </div>

  <div className="space-y-5">

    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-red-500">

      <div>

        <h3 className="font-semibold">
          Allow Phone Calls
        </h3>

        <p className="text-sm text-zinc-500">
          Display the Call Owner button.
        </p>

      </div>

      <input
        type="checkbox"
        checked={allowCall}
        onChange={(e) =>
          setAllowCall(e.target.checked)
        }
        className="h-5 w-5 accent-red-600"
      />

    </label>

    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-green-500">

      <div>

        <h3 className="font-semibold">
          Allow WhatsApp
        </h3>

        <p className="text-sm text-zinc-500">
          Display the WhatsApp button.
        </p>

      </div>

      <input
        type="checkbox"
        checked={allowWhatsapp}
        onChange={(e) =>
          setAllowWhatsapp(
            e.target.checked
          )
        }
        className="h-5 w-5 accent-green-600"
      />

    </label>

    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-blue-500">

      <div>

        <h3 className="font-semibold">
          Allow SMS
        </h3>

        <p className="text-sm text-zinc-500">
          Display the SMS button.
        </p>

      </div>

      <input
        type="checkbox"
        checked={allowSms}
        onChange={(e) =>
          setAllowSms(e.target.checked)
        }
        className="h-5 w-5 accent-blue-600"
      />

    </label>

    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-yellow-500">

      <div>

        <h3 className="font-semibold">
          Show Emergency Contact
        </h3>

        <p className="text-sm text-zinc-500">
          Display emergency contact details on the QR page.
        </p>

      </div>

      <input
        type="checkbox"
        checked={allowEmergency}
        onChange={(e) =>
          setAllowEmergency(
            e.target.checked
          )
        }
        className="h-5 w-5 accent-yellow-500"
      />

    </label>

    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-purple-500">

      <div>

        <h3 className="font-semibold">
          Allow Location Sharing
        </h3>

        <p className="text-sm text-zinc-500">
          Let people send their live location through WhatsApp.
        </p>

      </div>

      <input
        type="checkbox"
        checked={allowLocationShare}
        onChange={(e) =>
          setAllowLocationShare(
            e.target.checked
          )
        }
        className="h-5 w-5 accent-purple-500"
      />

    </label>

  </div>

</div>
{/* Status Messages */}

{error && (
  <div className="mt-10 rounded-2xl border border-red-500 bg-red-500/10 px-6 py-5">

    <h3 className="font-semibold text-red-400">
      Something went wrong
    </h3>

    <p className="mt-2 text-red-300">
      {error}
    </p>

  </div>
)}

{success && (
  <div className="mt-10 rounded-2xl border border-green-500 bg-green-500/10 px-6 py-5">

    <h3 className="font-semibold text-green-400">
      Profile Updated
    </h3>

    <p className="mt-2 text-green-300">
      {success}
    </p>

  </div>
)}

{/* Save Section */}

<div className="mt-10 rounded-[32px] border border-zinc-800 bg-zinc-900 p-8">

  <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

    <div>

      <h2 className="text-3xl font-bold">
        Save Changes
      </h2>

      <p className="mt-2 text-zinc-400">

        Your information is securely stored and
        protected by Vehix.

      </p>

    </div>

    <button
      onClick={handleSave}
      disabled={saving}
      className="flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >

      <Save size={22} />

      {saving
        ? "Saving..."
        : "Save Changes"}

    </button>

  </div>

</div>

{/* Privacy Information */}

<div className="mt-10 rounded-[32px] border border-blue-500/20 bg-blue-500/10 p-8">

  <div className="flex items-start gap-5">

    <div className="rounded-2xl bg-blue-600 p-4">

      <Shield size={28} />

    </div>

    <div>

      <h2 className="text-2xl font-bold">

        Your Privacy Matters

      </h2>

      <p className="mt-4 leading-8 text-zinc-300">

        Vehix is designed with a privacy-first
        approach.

        Your personal information is never publicly
        displayed unless you explicitly allow it.

      </p>

      <div className="mt-6 space-y-3">

        <div className="flex items-center gap-3">

          <div className="h-2 w-2 rounded-full bg-green-500" />

          <p className="text-zinc-300">
            Vehicle verification remains public.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="h-2 w-2 rounded-full bg-green-500" />

          <p className="text-zinc-300">
            Contact buttons follow your privacy settings.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="h-2 w-2 rounded-full bg-green-500" />

          <p className="text-zinc-300">
            Your account is protected using Supabase Authentication.
          </p>

        </div>

      </div>

    </div>

  </div>

</div>
{/* Footer */}

<div className="mt-12 rounded-[32px] border border-red-600/20 bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-10 text-center shadow-[0_0_60px_rgba(220,38,38,0.25)]">

  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur">

    <Shield size={40} />

  </div>

  <h2 className="mt-6 text-4xl font-black tracking-widest">

    VEHIX

  </h2>

  <p className="mt-4 text-lg text-red-100">

    Smart Vehicle Identity Network

  </p>

  <p className="mt-6 max-w-2xl mx-auto leading-8 text-red-100">

    Your profile securely stores your contact details,
    emergency information and privacy preferences.
    You stay in control of what people can access after
    scanning your Vehix QR.

  </p>

  <div className="mt-8 flex flex-wrap justify-center gap-3">

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Privacy First
    </span>

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Secure
    </span>

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Verified
    </span>

    <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
      Protected
    </span>

  </div>

  <div className="mt-10 border-t border-white/20 pt-8">

    <p className="text-sm text-red-100">

      Powered by Vehix

    </p>

    <p className="mt-2 text-xs tracking-widest text-red-200">

      © {new Date().getFullYear()} VEHIX • ALL RIGHTS RESERVED

    </p>

  </div>

</div>

</div>

</main>
);
}