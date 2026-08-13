"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Users,
  QrCode,
  Car,
  LogOut,
  RefreshCw,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

type QRItem = {
  id: string;
  qr_code: string;
  status: string;
  product_name: string | null;
  design_name: string | null;
  assigned_user_id: string | null;
  vehicle_id: string | null;
  created_at: string;
  activated_at: string | null;
};

type AdminStats = {
  qrCodes: number;
  users: number;
  vehicles: number;
  activatedQr: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState<AdminStats>({
    qrCodes: 0,
    users: 0,
    vehicles: 0,
    activatedQr: 0,
  });

  const [qrInventory, setQrInventory] = useState<QRItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [batchSize, setBatchSize] = useState("10");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase.rpc("is_admin");

        if (error) {
          console.error("Admin check failed:", error);
          router.replace("/dashboard");
          return;
        }

        if (!data) {
          router.replace("/dashboard");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Admin authentication error:", error);
        router.replace("/dashboard");
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    loadAdminData();
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoadingData(true);

    try {
      const { data: statsData, error: statsError } =
        await supabase.rpc("get_admin_stats");

      if (statsError) {
        console.error("Stats loading error:", statsError);
      } else if (statsData) {
        setStats({
          qrCodes: Number(statsData.qrCodes ?? 0),
          users: Number(statsData.users ?? 0),
          vehicles: Number(statsData.vehicles ?? 0),
          activatedQr: Number(statsData.activatedQr ?? 0),
        });
      }

      const { data: qrData, error: qrError } =
        await supabase.rpc("get_admin_qr_inventory");

      if (qrError) {
        console.error("QR inventory loading error:", qrError);
        setQrInventory([]);
      } else {
        setQrInventory((qrData ?? []) as QRItem[]);
      }
    } catch (error) {
      console.error("Admin data loading error:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleGenerateBatch = async () => {
    if (generating) return;

    const amount = Number(batchSize);

    if (!Number.isInteger(amount) || amount < 1) {
      window.alert("Please enter a valid whole number.");
      return;
    }

    if (amount > 500) {
      window.alert("Maximum batch size is 500 QR codes.");
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.rpc(
        "admin_generate_qr_batch",
        {
          batch_size: amount,
        }
      );

      if (error) {
        console.error("QR generation failed:", error);

        window.alert(
          `QR generation failed: ${error.message}`
        );

        return;
      }

      window.alert(
        `${data} QR code${
          data === 1 ? "" : "s"
        } generated successfully.`
      );

      await loadAdminData();
    } catch (error) {
      console.error("QR generation error:", error);

      window.alert(
        "Something went wrong while generating QR codes."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkSold = async (item: QRItem) => {
    if (item.status !== "available") {
      window.alert(`This QR cannot be sold because its status is "${item.status}".`);
      return;
    }

    const confirmed = window.confirm(
      `Mark ${item.qr_code} as SOLD?\n\nThis will make it eligible for customer activation.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase.rpc("mark_qr_sold", {
        p_qr_id: item.id,
      });

      if (error) {
        console.error("Mark QR sold failed:", error);
        window.alert(`Unable to mark QR as sold: ${error.message}`);
        return;
      }

      window.alert(`${item.qr_code} has been marked as SOLD.`);
      await loadAdminData();
    } catch (error) {
      console.error("Mark QR sold error:", error);
      window.alert("Something went wrong while marking the QR as sold.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="text-center">
          <ShieldCheck
            size={42}
            className="mx-auto mb-4 text-blue-400"
          />

          <p className="text-sm text-zinc-400">
            Verifying admin access...
          </p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ShieldCheck
                size={22}
                className="text-blue-400"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Vehix Admin
              </h1>

              <p className="text-xs text-zinc-500">
                Control Center
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      {/* DASHBOARD */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Administration
          </p>

          <h2 className="text-4xl font-black tracking-tight">
            Vehix Control Center
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Manage your QR inventory, users, vehicles,
            activations and Vehix products from one place.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <QrCode
              className="mb-5 text-blue-400"
              size={28}
            />

            <p className="text-sm text-zinc-500">
              Total QR Codes
            </p>

            <p className="mt-2 text-3xl font-black">
              {stats.qrCodes}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <Users
              className="mb-5 text-cyan-400"
              size={28}
            />

            <p className="text-sm text-zinc-500">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-black">
              {stats.users}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <Car
              className="mb-5 text-purple-400"
              size={28}
            />

            <p className="text-sm text-zinc-500">
              Total Vehicles
            </p>

            <p className="mt-2 text-3xl font-black">
              {stats.vehicles}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <ShieldCheck
              className="mb-5 text-emerald-400"
              size={28}
            />

            <p className="text-sm text-zinc-500">
              Activated QR
            </p>

            <p className="mt-2 text-3xl font-black">
              {stats.activatedQr}
            </p>
          </div>
        </div>

        {/* QR INVENTORY */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-bold">
                QR Inventory
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Generate and manage your official Vehix QR inventory.
              </p>
            </div>

            {/* GENERATE QR */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <Plus
                  size={16}
                  className="text-blue-400"
                />

                <input
                  type="number"
                  min="1"
                  max="500"
                  value={batchSize}
                  onChange={(e) =>
                    setBatchSize(e.target.value)
                  }
                  className="w-20 bg-transparent text-center text-sm font-bold text-white outline-none"
                />
              </div>

              <button
                onClick={handleGenerateBatch}
                disabled={generating}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <QrCode size={17} />

                {generating
                  ? "Generating..."
                  : "Generate QR Batch"}
              </button>

              <button
                onClick={loadAdminData}
                disabled={loadingData}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loadingData
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>
          </div>

          {/* INVENTORY */}
          {loadingData ? (
            <div className="mt-8 rounded-2xl border border-white/10 p-10 text-center">
              <QrCode
                size={40}
                className="mx-auto mb-4 animate-pulse text-blue-400"
              />

              <p className="font-semibold text-zinc-400">
                Loading QR inventory...
              </p>
            </div>
          ) : qrInventory.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <QrCode
                size={40}
                className="mx-auto mb-4 text-zinc-600"
              />

              <p className="font-semibold text-zinc-400">
                QR inventory is empty
              </p>

              <p className="mt-2 text-sm text-zinc-600">
                Generate your first QR batch.
              </p>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.03]">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        QR Code
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Design
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Vehicle
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Created
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {qrInventory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-4">
                          <div className="font-mono text-sm font-bold text-white">
                            {item.qr_code}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              item.status === "activated"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : item.status === "assigned"
                                ? "bg-purple-500/10 text-purple-400"
                                : item.status === "suspended"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          {item.product_name ?? "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          {item.design_name ?? "—"}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {item.vehicle_id ? (
                            <span className="text-emerald-400">
                              Assigned
                            </span>
                          ) : (
                            <span className="text-zinc-600">
                              Not assigned
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-500">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          {item.status === "available" ? (
                            <button
                              type="button"
                              onClick={() => handleMarkSold(item)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
                            >
                              <ShoppingCart size={15} />
                              Mark Sold
                            </button>
                          ) : item.status === "sold" ? (
                            <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                              Ready for Activation
                            </span>
                          ) : item.status === "activated" ? (
                            <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                              Activated
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-600">
                              No action
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}