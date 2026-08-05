"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Shield,
  Moon,
  Bell,
  Globe,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);

  useEffect(() => {
    document.title = "Vehix • Settings";
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-5xl px-6 py-10">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your Vehix preferences.
        </p>

        <div className="mt-10 space-y-6">
                    {/* Appearance */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-blue-600/20 p-3">

                <Moon className="text-blue-400" size={24} />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Dark Mode
                </h2>

                <p className="text-sm text-zinc-400">
                  Use Vehix with a dark appearance.
                </p>

              </div>

            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`h-8 w-14 rounded-full transition ${
                darkMode ? "bg-blue-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full bg-white transition ${
                  darkMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>

          </div>

        </div>

        {/* Notifications */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-yellow-600/20 p-3">

                <Bell className="text-yellow-400" size={24} />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Push Notifications
                </h2>

                <p className="text-sm text-zinc-400">
                  Receive maintenance reminders and vehicle alerts.
                </p>

              </div>

            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`h-8 w-14 rounded-full transition ${
                notifications ? "bg-green-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full bg-white transition ${
                  notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>

          </div>

        </div>

        {/* Location */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-green-600/20 p-3">

                <Globe className="text-green-400" size={24} />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Location Sharing
                </h2>

                <p className="text-sm text-zinc-400">
                  Allow Vehix to save your parking location.
                </p>

              </div>

            </div>

            <button
              onClick={() => setLocationAccess(!locationAccess)}
              className={`h-8 w-14 rounded-full transition ${
                locationAccess ? "bg-green-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full bg-white transition ${
                  locationAccess ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>

          </div>

        </div>

        {/* Security */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 hover:border-red-500 transition">

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="flex w-full items-center justify-between"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-red-600/20 p-3">

                <Shield className="text-red-400" size={24} />

              </div>

              <div className="text-left">

                <h2 className="text-xl font-semibold">
                  Privacy & Contact Settings
                </h2>

                <p className="text-sm text-zinc-400">
                  Manage emergency contacts and public QR visibility.
                </p>

              </div>

            </div>

            <ChevronRight className="text-zinc-500" />

          </button>

        </div>
                {/* About Vehix */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="text-xl font-semibold">
            About Vehix
          </h2>

          <p className="mt-4 leading-7 text-zinc-400">
            Vehix is your Smart Vehicle Identity Network. Every vehicle gets a
            secure QR identity that helps people contact the owner during
            emergencies, locate parked vehicles, and verify authenticity while
            keeping personal information protected.
          </p>

        </div>

        {/* App Information */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">

            <span className="text-zinc-400">
              Version
            </span>

            <span className="font-semibold">
              Vehix v1.0
            </span>

          </div>

          <div className="mt-4 flex items-center justify-between border-b border-zinc-800 pb-4">

            <span className="text-zinc-400">
              Build
            </span>

            <span className="font-semibold">
              Production
            </span>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <span className="text-zinc-400">
              Platform
            </span>

            <span className="font-semibold">
              Next.js + Supabase
            </span>

          </div>

        </div>

        {/* Future Features */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="text-xl font-semibold">
            Upcoming Features
          </h2>

          <ul className="mt-5 space-y-3 text-zinc-400">

            <li>✅ AI Vehicle Assistant</li>

            <li>✅ Maintenance Reminder System</li>

            <li>✅ Parking History</li>

            <li>✅ Theft Mode</li>

            <li>✅ Live Location Sharing</li>

            <li>✅ Insurance & RC Wallet</li>

          </ul>

        </div>

        {/* Danger Zone */}

        <div className="rounded-3xl border border-red-600/30 bg-red-950/20 p-6">

          <h2 className="text-xl font-semibold text-red-400">
            Danger Zone
          </h2>

          <p className="mt-3 text-zinc-400">
            This feature is currently under development.
            Permanent account deletion will be available in a future update.
          </p>

          <button
            disabled
            className="mt-6 rounded-xl bg-red-700 px-6 py-3 font-semibold opacity-60 cursor-not-allowed"
          >
            Delete Account
          </button>

        </div>
      </div>
      </div>

    </main>

  );
}