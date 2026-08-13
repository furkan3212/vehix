"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  ShieldCheck,
  User,
  QrCode,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function QRManagementPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [qr, setQr] = useState<QRItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selling, setSelling] = useState(false);

  useEffect(() => {
    const loadQR = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase.rpc(
          "get_admin_qr_inventory"
        );

        if (error) {
          console.error("QR loading error:", error);
          return;
        }

        const foundQR = (data ?? []).find(
          (item: QRItem) => item.id === id
        );

        if (foundQR) {
          setQr(foundQR);
        }
      } catch (error) {
        console.error("QR management error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQR();
  }, [id]);

  const qrUrl = qr
    ? `https://vehix.co.in/qr/${qr.qr_code}`
    : "";

  const copyQRLink = async () => {
    if (!qrUrl) return;

    await navigator.clipboard.writeText(qrUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById("vehix-qr");

    if (!svg || !qr) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${qr.qr_code}.svg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const printQR = () => {
    window.print();
  };

  const markAsSold = async () => {
    if (!qr || selling) return;

    const confirmed = window.confirm(
      `Are you sure you want to mark ${qr.qr_code} as SOLD?\n\nOnly do this after you have sold or handed this physical Vehix sticker to the customer.`
    );

    if (!confirmed) return;

    setSelling(true);

    try {
      const { error } = await supabase.rpc(
        "mark_qr_sold",
        {
          p_qr_id: qr.id,
        }
      );

      if (error) {
        console.error("Mark QR sold error:", error);

        window.alert(
          `Could not mark QR as sold:\n${error.message}`
        );

        return;
      }

      setQr((current) =>
        current
          ? {
              ...current,
              status: "sold",
            }
          : current
      );

      window.alert(
        `${qr.qr_code} has been marked as SOLD successfully.`
      );
    } catch (error) {
      console.error("Mark QR sold error:", error);

      window.alert(
        "Something went wrong while marking the QR as sold."
      );
    } finally {
      setSelling(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="text-center">
          <QrCode
            size={48}
            className="mx-auto mb-4 animate-pulse text-blue-400"
          />

          <p className="text-zinc-400">
            Loading QR management...
          </p>
        </div>
      </main>
    );
  }

  if (!qr) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="text-center">
          <QrCode
            size={50}
            className="mx-auto mb-5 text-red-400"
          />

          <h1 className="text-3xl font-black">
            QR Not Found
          </h1>

          <p className="mt-3 text-zinc-400">
            This QR code could not be found in your inventory.
          </p>

          <button
            onClick={() => router.push("/admin")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500"
          >
            Back to Admin
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />

            Back to Admin
          </button>

          <div className="flex items-center gap-3">
            <ShieldCheck
              size={22}
              className="text-blue-400"
            />

            <div className="text-right">
              <p className="text-sm font-bold">
                Vehix Admin
              </p>

              <p className="text-xs text-zinc-500">
                QR Management
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            QR Management
          </p>

          <h1 className="text-4xl font-black tracking-tight">
            Manage QR Code
          </h1>

          <p className="mt-3 text-zinc-400">
            View, print and manage this Vehix QR before
            assigning it to a customer.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* QR PREVIEW */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  QR Preview
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Vehix Smart Identity
                </h2>
              </div>

              <QrCode
                size={24}
                className="text-blue-400"
              />
            </div>

            <div
              id="print-area"
              className="rounded-3xl bg-white p-8"
            >
              <QRCode
                id="vehix-qr"
                value={qrUrl}
                size={280}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
              />

              <p className="mt-6 text-center font-mono text-sm font-bold text-black">
                {qr.qr_code}
              </p>

              <p className="mt-2 text-center text-xs text-zinc-500">
                Scan to access Vehix Smart Identity
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={downloadQR}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold transition hover:bg-blue-500"
              >
                <Download size={17} />

                Download
              </button>

              <button
                onClick={printQR}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-white/10"
              >
                <Printer size={17} />

                Print
              </button>
            </div>
          </section>

          {/* INFORMATION */}
          <section className="space-y-6">
            {/* QR IDENTITY */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <QrCode
                    size={22}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    QR Code
                  </p>

                  <p className="font-mono text-lg font-bold">
                    {qr.qr_code}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* STATUS */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle2
                      size={17}
                      className={
                        qr.status === "activated"
                          ? "text-emerald-400"
                          : qr.status === "sold"
                          ? "text-purple-400"
                          : "text-blue-400"
                      }
                    />

                    <span className="text-sm font-bold capitalize">
                      {qr.status}
                    </span>
                  </div>
                </div>

                {/* CREATED */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">
                    Created
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {new Date(
                      qr.created_at
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* PRODUCT */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <h2 className="text-lg font-bold">
                Product Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">
                    Product
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {qr.product_name ?? "Not assigned"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">
                    Design
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {qr.design_name ?? "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* ASSIGNMENT */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <h2 className="text-lg font-bold">
                Assignment
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* CUSTOMER */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2">
                    <User
                      size={17}
                      className="text-cyan-400"
                    />

                    <p className="text-xs text-zinc-500">
                      Customer
                    </p>
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    {qr.assigned_user_id
                      ? "Customer Assigned"
                      : "Not assigned"}
                  </p>
                </div>

                {/* VEHICLE */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2">
                    <Car
                      size={17}
                      className="text-purple-400"
                    />

                    <p className="text-xs text-zinc-500">
                      Vehicle
                    </p>
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    {qr.vehicle_id
                      ? "Vehicle Assigned"
                      : "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* QR LINK */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <h2 className="text-lg font-bold">
                QR Destination
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                This is the secure URL encoded inside the
                QR code.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="truncate font-mono text-xs text-zinc-400">
                    {qrUrl}
                  </p>
                </div>

                <button
                  onClick={copyQRLink}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
                >
                  <Copy size={17} />

                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* QR SALES CONTROL */}
            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-7">
              <div className="flex items-start gap-4">
                <ShoppingBag
                  size={25}
                  className="mt-1 shrink-0 text-purple-400"
                />

                <div className="flex-1">
                  <h2 className="font-bold">
                    QR Sales Control
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Once you physically sell this Vehix QR
                    sticker, mark it as sold. The customer
                    will then be able to activate this exact
                    QR after receiving it.
                  </p>

                  {/* CURRENT STATUS */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        Current Status
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          qr.status === "available"
                            ? "bg-blue-500/10 text-blue-400"
                            : qr.status === "sold"
                            ? "bg-purple-500/10 text-purple-400"
                            : qr.status === "activated"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {qr.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* AVAILABLE */}
                  {qr.status === "available" && (
                    <button
                      onClick={markAsSold}
                      disabled={selling}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingBag size={18} />

                      {selling
                        ? "Marking as Sold..."
                        : "Mark QR as Sold"}
                    </button>
                  )}

                  {/* SOLD */}
                  {qr.status === "sold" && (
                    <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-center">
                      <p className="text-sm font-semibold text-purple-300">
                        This QR has been sold.
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Waiting for customer activation.
                      </p>
                    </div>
                  )}

                  {/* ACTIVATED */}
                  {qr.status === "activated" && (
                    <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                      <p className="text-sm font-semibold text-emerald-300">
                        This QR is activated.
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        It is already linked to a vehicle.
                      </p>
                    </div>
                  )}

                  {/* SUSPENDED */}
                  {qr.status === "suspended" && (
                    <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                      <p className="text-sm font-semibold text-red-300">
                        This QR is suspended.
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        The QR cannot currently be activated.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* VEHIX CONTROL */}
            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-7">
              <div className="flex items-start gap-4">
                <ShieldCheck
                  size={25}
                  className="mt-1 shrink-0 text-blue-400"
                />

                <div>
                  <h2 className="font-bold">
                    QR is controlled by Vehix
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    This QR belongs to your official Vehix
                    inventory. Customer assignment,
                    activation and ownership transfer will
                    be controlled from the admin panel.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #print-area,
          #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
        }
      `}</style>
    </main>
  );
}