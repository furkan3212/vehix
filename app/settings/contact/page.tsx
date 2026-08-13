"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  Save,
  ShieldCheck,
  Siren,
  User,
} from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  emergency_name: string | null;
  emergency_phone: string | null;
};

export default function ContactSettingsPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [emergencyName, setEmergencyName] =
    useState("");
  const [emergencyPhone, setEmergencyPhone] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =====================================================
     LOAD PROFILE
     ===================================================== */

  useEffect(() => {
    async function loadContactSettings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/profile/contact",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Unable to load contact settings."
          );
        }

        const data =
          result.profile as Profile;

        setProfile(data);

        setFullName(
          data.full_name || ""
        );

        setPhone(data.phone || "");

        setWhatsapp(
          data.whatsapp || ""
        );

        setEmergencyName(
          data.emergency_name || ""
        );

        setEmergencyPhone(
          data.emergency_phone || ""
        );
      } catch (err) {
        console.error(
          "Contact settings error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load contact settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContactSettings();
  }, []);

  /* =====================================================
     SAVE
     ===================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/profile/contact",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            phone,
            whatsapp,
            emergency_name:
              emergencyName,
            emergency_phone:
              emergencyPhone,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to save contact settings."
        );
      }

      setProfile(result.profile);

      setSuccess(
        "Contact information saved successfully."
      );
    } catch (err) {
      console.error(
        "Contact save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save contact settings."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030303] px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <div className="text-center">
            <Loader2
              size={38}
              className="mx-auto animate-spin text-red-500"
            />

            <p className="mt-4 text-sm text-zinc-500">
              Loading contact settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <main className="min-h-screen bg-[#030303] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
              <ShieldCheck
                size={25}
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

          <h1 className="mt-8 text-3xl font-black sm:text-4xl">
            Contact & Emergency
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Manage how someone who scans your Vehix QR
            can contact you or your emergency contact.
          </p>
        </div>

        {/* =================================================
            ALERTS
            ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <p className="text-sm leading-5 text-red-300">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <p className="text-sm leading-5 text-emerald-300">
              {success}
            </p>
          </div>
        )}

        {/* =================================================
            FORM
            ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              YOUR CONTACT
              ================================================= */}

          <section className="rounded-3xl border border-white/10 bg-[#111113] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                <User
                  size={24}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Your Contact
                </h2>

                <p className="mt-1 text-sm text-zinc-600">
                  These details are used for direct contact
                  from your Vehix QR.
                </p>
              </div>

            </div>

            <div className="mt-7 space-y-5">

              {/* FULL NAME */}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-zinc-300"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Your full name"
                  maxLength={100}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50"
                />
              </div>

              {/* PHONE */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-300"
                >
                  <Phone
                    size={15}
                    className="text-blue-400"
                  />
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+91 98765 43210"
                  maxLength={30}
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50"
                />

                <p className="mt-2 text-xs text-zinc-700">
                  Used by the public QR page when someone
                  chooses "Call Owner" or "Send SMS".
                </p>
              </div>

              {/* WHATSAPP */}

              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-300"
                >
                  <MessageCircle
                    size={15}
                    className="text-emerald-400"
                  />
                  WhatsApp Number
                </label>

                <input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(e.target.value)
                  }
                  placeholder="+91 98765 43210"
                  maxLength={30}
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-500/50"
                />

                <p className="mt-2 text-xs text-zinc-700">
                  If left empty, Vehix will use your phone
                  number for WhatsApp.
                </p>
              </div>

            </div>
          </section>

          {/* =================================================
              EMERGENCY
              ================================================= */}

          <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                <Siren
                  size={25}
                  className="text-red-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Emergency Contact
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Someone scanning your QR can directly call
                  this number when they need to reach your
                  emergency contact.
                </p>
              </div>

            </div>

            <div className="mt-7 space-y-5">

              {/* EMERGENCY NAME */}

              <div>
                <label
                  htmlFor="emergencyName"
                  className="mb-2 block text-sm font-semibold text-zinc-300"
                >
                  Emergency Contact Name
                </label>

                <input
                  id="emergencyName"
                  type="text"
                  value={emergencyName}
                  onChange={(e) =>
                    setEmergencyName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Father, Mother, Brother"
                  maxLength={100}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500/50"
                />
              </div>

              {/* EMERGENCY PHONE */}

              <div>
                <label
                  htmlFor="emergencyPhone"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-300"
                >
                  <Phone
                    size={15}
                    className="text-red-400"
                  />
                  Emergency Phone Number
                </label>

                <input
                  id="emergencyPhone"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) =>
                    setEmergencyPhone(
                      e.target.value
                    )
                  }
                  placeholder="+91 98765 43210"
                  maxLength={30}
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500/50"
                />

                <p className="mt-2 text-xs leading-5 text-zinc-700">
                  This number is never displayed publicly.
                  The QR visitor only receives the ability
                  to initiate a direct call.
                </p>
              </div>

            </div>

          </section>

          {/* =================================================
              PRIVACY
              ================================================= */}

          <section className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.03] p-6">

            <div className="flex gap-3">

              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <p className="font-semibold text-zinc-300">
                  Your numbers stay private
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Vehix does not display your phone number
                  or emergency number as text on the public
                  QR page. The visitor only gets the action
                  you have configured.
                </p>
              </div>

            </div>

          </section>

          {/* =================================================
              SAVE
              ================================================= */}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-4 font-black text-white transition hover:bg-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Contact Settings
              </>
            )}
          </button>

        </form>

        {/* =================================================
            FOOTER
            ================================================= */}

        <footer className="py-10 text-center">
          <p className="text-xs text-zinc-700">
            Vehix Smart Vehicle Identity Network
          </p>
        </footer>

      </div>
    </main>
  );
}