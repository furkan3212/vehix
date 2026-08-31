"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  ShoppingCart,
  CheckCircle2,
  Clock3,
  XCircle,
  QrCode,
  X,
  ExternalLink,
  Copy,
  Download,
  Printer,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string | null;
  product: string | null;
  quantity: number | null;
  unit_price: number | null;
  total_amount: number | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  shape: string | null;
  color: string | null;
  finish: string | null;
  payment_status: string | null;
  order_status: string | null;
  payment_id: string | null;
  razorpay_order_id: string | null;
  qr_inventory_id: string | null;
  user_id: string | null;
  vehicle_id: string | null;
  created_at: string;
  qr_status?: string | null;
  qr_code?: string | null;
};

type QRInventoryRow = {
  id: string;
  status: string | null;
  qr_code: string | null;
};

type QRModalData = {
  qrCode: string;
  orderNumber: string;
  customerName: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<QRModalData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  async function checkAdmin() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: adminError } =
        await supabase.rpc("is_admin");

      if (adminError || !data) {
        console.error("Admin check failed:", adminError);
        router.replace("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (err) {
      console.error("Admin authentication error:", err);
      router.replace("/dashboard");
    } finally {
      setChecking(false);
    }
  }

  async function loadOrders() {
    setLoading(true);
    setError(null);

    try {
      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          product,
          quantity,
          unit_price,
          total_amount,
          full_name,
          email,
          phone,
          address,
          city,
          state,
          pincode,
          shape,
          color,
          finish,
          payment_status,
          order_status,
          payment_id,
          razorpay_order_id,
          qr_inventory_id,
          user_id,
          vehicle_id,
          created_at
          `
        )
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders loading error:", ordersError);
        setError(ordersError.message);
        setOrders([]);
        return;
      }

      const loadedOrders = (data ?? []) as Order[];

      const qrIds = loadedOrders
        .map((order) => order.qr_inventory_id)
        .filter((id): id is string => Boolean(id));

      if (qrIds.length === 0) {
        setOrders(loadedOrders);
        return;
      }

      const { data: qrData, error: qrError } = await supabase
        .from("qr_inventory")
        .select("id, status, qr_code")
        .in("id", qrIds);

      if (qrError) {
        console.error("QR status loading error:", qrError);
        setOrders(loadedOrders);
        setError(
          `Orders loaded, but QR status could not be loaded: ${qrError.message}`
        );
        return;
      }

      const qrMap = new Map<string, QRInventoryRow>();

      for (const row of (qrData ?? []) as QRInventoryRow[]) {
        qrMap.set(row.id, row);
      }

      setOrders(
        loadedOrders.map((order) => {
          if (!order.qr_inventory_id) {
            return {
              ...order,
              qr_status: null,
              qr_code: null,
            };
          }

          const qr = qrMap.get(order.qr_inventory_id);

          return {
            ...order,
            qr_status: qr?.status ?? null,
            qr_code: qr?.qr_code ?? null,
          };
        })
      );
    } catch (err) {
      console.error("Orders loading error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load orders."
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleActivateQR(order: Order) {
    if (!order.qr_inventory_id) {
      setError("No QR is assigned to this order.");
      return;
    }

    if (!isPaid(order.payment_status)) {
      setError("This order has not been successfully paid.");
      return;
    }

    if (order.qr_status?.toLowerCase() === "activated") {
      if (order.qr_code) {
        openQRModal(order);
      } else {
        setError("QR is activated, but its QR code could not be loaded.");
      }
      return;
    }

    if (
      order.qr_status &&
      order.qr_status.toLowerCase() !== "sold"
    ) {
      setError(
        `This QR cannot be activated. Current status: ${order.qr_status}.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Activate this Vehix QR?\n\nCustomer: ${
        order.full_name ?? "this customer"
      }\nOrder: ${order.order_number ?? order.id.slice(0, 8)}\n\nAfter activation, the customer will be able to see the QR.`
    );

    if (!confirmed) return;

    try {
      setActivatingId(order.id);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc(
        "admin_activate_vehix_qr",
        {
          p_qr_id: order.qr_inventory_id,
        }
      );

      if (rpcError) {
        console.error("QR activation RPC error:", rpcError);
        throw new Error(rpcError.message);
      }

      const result = data as
        | {
            success?: boolean;
            qr_id?: string;
            qr_code?: string;
            user_id?: string;
            vehicle_id?: string;
            status?: string;
            error?: string;
          }
        | null;

      if (!result?.success) {
        throw new Error(result?.error ?? "Unable to activate QR.");
      }

      // Refresh from Supabase so the admin page reflects the real DB state.
      await loadOrders();

      // Prefer the QR code returned by the RPC; otherwise use the refreshed order.
      let finalQrCode = result.qr_code ?? null;

      if (!finalQrCode) {
        const { data: qrRow, error: qrLookupError } = await supabase
          .from("qr_inventory")
          .select("qr_code, status")
          .eq("id", order.qr_inventory_id)
          .maybeSingle();

        if (!qrLookupError) {
          finalQrCode = qrRow?.qr_code ?? null;
        }
      }

      if (!finalQrCode) {
        throw new Error(
          "QR was activated, but the QR code could not be loaded."
        );
      }

      setQrModal({
        qrCode: finalQrCode,
        orderNumber: order.order_number ?? order.id.slice(0, 8),
        customerName: order.full_name ?? "Customer",
      });
    } catch (err) {
      console.error("QR activation error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to activate QR."
      );
    } finally {
      setActivatingId(null);
    }
  }

  function openQRModal(order: Order) {
    if (!order.qr_code) {
      setError("QR code is not available for this order.");
      return;
    }

    setCopied(false);
    setQrModal({
      qrCode: order.qr_code,
      orderNumber: order.order_number ?? order.id.slice(0, 8),
      customerName: order.full_name ?? "Customer",
    });
  }

  function getProductionQRUrl(qrCode: string) {
    return `https://vehix.co.in/qr/${encodeURIComponent(qrCode)}`;
  }

  function getTestQRUrl(qrCode: string) {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/qr/${encodeURIComponent(qrCode)}`;
  }

  async function copyQRLink() {
    if (!qrModal) return;

    const url = getProductionQRUrl(qrModal.qrCode);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy QR link error:", err);
      setError("Unable to copy the QR link.");
    }
  }

  function downloadQR() {
    if (!qrModal) return;

    const svg = document.getElementById("vehix-admin-qr");

    if (!svg) {
      setError("QR image is not ready yet.");
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${qrModal.qrCode}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function printQR() {
    window.print();
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function isPaid(status: string | null) {
    const value = String(status ?? "").toLowerCase();

    return (
      value === "paid" ||
      value === "captured" ||
      value === "success"
    );
  }

  function getPaymentIcon(status: string | null) {
    const value = String(status ?? "").toLowerCase();

    if (isPaid(status)) {
      return (
        <CheckCircle2 size={16} className="text-emerald-400" />
      );
    }

    if (value === "pending") {
      return <Clock3 size={16} className="text-amber-400" />;
    }

    return <XCircle size={16} className="text-red-400" />;
  }

  function renderQRStatus(order: Order) {
    const status = String(order.qr_status ?? "").toLowerCase();

    if (status === "activated") {
      return (
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 size={14} />
            Activated
          </span>

          <button
            type="button"
            onClick={() => openQRModal(order)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            <QrCode size={14} />
            View QR
          </button>

          {order.qr_code && (
            <p className="font-mono text-[10px] text-zinc-500">
              {order.qr_code}
            </p>
          )}
        </div>
      );
    }

    if (status === "sold" && order.qr_inventory_id) {
      if (!isPaid(order.payment_status)) {
        return (
          <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
            Payment Pending
          </span>
        );
      }

      return (
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
            <Clock3 size={14} />
            Activation Pending
          </span>

          <button
            type="button"
            onClick={() => handleActivateQR(order)}
            disabled={activatingId === order.id}
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activatingId === order.id ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <QrCode size={14} />
                Activate QR
              </>
            )}
          </button>

          {order.qr_code && (
            <p className="font-mono text-[10px] text-zinc-600">
              {order.qr_code}
            </p>
          )}
        </div>
      );
    }

    if (!order.qr_inventory_id) {
      return (
        <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400">
          QR Not Assigned
        </span>
      );
    }

    if (status === "available") {
      return (
        <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
          QR Available
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full bg-zinc-500/10 px-3 py-1.5 text-xs font-bold text-zinc-400">
        {order.qr_status ?? "Unknown"}
      </span>
    );
  }

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

  if (!isAdmin) return null;

  const paidOrders = orders.filter((order) =>
    isPaid(order.payment_status)
  );

  const assignedOrders = orders.filter((order) =>
    Boolean(order.qr_inventory_id)
  );

  const activatedOrders = orders.filter(
    (order) =>
      String(order.qr_status ?? "").toLowerCase() === "activated"
  );

  const pendingActivationOrders = orders.filter(
    (order) =>
      isPaid(order.payment_status) &&
      String(order.qr_status ?? "").toLowerCase() === "sold"
  );

  const productionQRUrl = qrModal
    ? getProductionQRUrl(qrModal.qrCode)
    : "";

  const testQRUrl = qrModal
    ? getTestQRUrl(qrModal.qrCode)
    : "";

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ShoppingCart size={22} className="text-blue-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Vehix Orders</h1>
              <p className="text-xs text-zinc-500">
                Customer orders and payments
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 print:hidden">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Orders
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Customer Orders
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            View every Vehix QR order, payment and customer information.
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-zinc-500">Total Orders</p>
            <p className="mt-2 text-3xl font-black">{orders.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-zinc-500">Paid Orders</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">
              {paidOrders.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-zinc-500">Activation Pending</p>
            <p className="mt-2 text-3xl font-black text-amber-400">
              {pendingActivationOrders.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-zinc-500">QR Activated</p>
            <p className="mt-2 text-3xl font-black text-blue-400">
              {activatedOrders.length}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              {assignedOrders.length} QR assigned
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div>
              <p className="font-semibold text-red-400">
                Something went wrong
              </p>
              <p className="mt-1 text-sm text-zinc-500">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-semibold text-zinc-500 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <RefreshCw
              size={38}
              className="mx-auto mb-4 animate-spin text-blue-400"
            />
            <p className="font-semibold text-zinc-400">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-14 text-center">
            <ShoppingCart
              size={42}
              className="mx-auto mb-4 text-zinc-600"
            />
            <p className="font-semibold text-zinc-400">No orders yet</p>
            <p className="mt-2 text-sm text-zinc-600">
              New successful Vehix QR purchases will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1650px] text-left">
                <thead className="border-b border-white/10 bg-white/[0.03]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Order
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Product
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Design
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Amount
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Payment
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      QR
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-5">
                        <p className="font-mono text-sm font-bold text-white">
                          {order.order_number ?? order.id.slice(0, 8)}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-600">
                          {order.id}
                        </p>
                        {order.razorpay_order_id && (
                          <p className="mt-1 max-w-[180px] truncate font-mono text-[10px] text-zinc-700">
                            {order.razorpay_order_id}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-semibold text-white">
                          {order.full_name ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {order.email ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          {order.phone ?? "—"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-semibold text-white">
                          {order.product ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          Qty: {order.quantity ?? 1}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm text-zinc-300">
                          {order.shape ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {order.color ?? "—"} • {order.finish ?? "—"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-bold text-white">
                          ₹
                          {Number(order.total_amount ?? 0).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          {getPaymentIcon(order.payment_status)}
                          <span className="text-xs font-bold uppercase">
                            {order.payment_status ?? "—"}
                          </span>
                        </div>
                        <p className="mt-2 max-w-[180px] truncate font-mono text-[10px] text-zinc-600">
                          {order.payment_id ?? "No payment ID"}
                        </p>
                      </td>

                      <td className="px-5 py-5">{renderQRStatus(order)}</td>

                      <td className="px-5 py-5 text-sm text-zinc-500">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR PREVIEW / TEST MODAL */}
      {qrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-[32px] border border-white/10 bg-[#070a0f] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setQrModal(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close QR preview"
            >
              <X size={18} />
            </button>

            <div className="pr-12">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2
                    size={25}
                    className="text-emerald-400"
                  />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                    QR Activated
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Vehix QR Preview
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-bold text-zinc-200">
                    {qrModal.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    Order
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-zinc-200">
                    {qrModal.orderNumber}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center rounded-3xl bg-white p-6 sm:p-10">
                <div className="w-full max-w-[300px]">
                  <QRCode
                    id="vehix-admin-qr"
                    value={productionQRUrl}
                    size={300}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <QrCode
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />
                  <div>
                    <p className="font-bold text-blue-300">
                      This is the actual QR identity
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      The QR encodes the Vehix public identity URL for this
                      QR code. Scanning it opens the vehicle identity page.
                    </p>
                    <p className="mt-2 break-all font-mono text-[11px] text-zinc-600">
                      {productionQRUrl}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    if (testQRUrl) {
                      window.open(testQRUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-400"
                >
                  <ExternalLink size={17} />
                  Test QR Page
                </button>

                <button
                  type="button"
                  onClick={copyQRLink}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10"
                >
                  {copied ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Copy size={17} />
                  )}
                  {copied ? "Copied" : "Copy QR Link"}
                </button>

                <button
                  type="button"
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10"
                >
                  <Download size={17} />
                  Download QR
                </button>

                <button
                  type="button"
                  onClick={printQR}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10"
                >
                  <Printer size={17} />
                  Print QR
                </button>
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-zinc-600">
                For local testing, “Test QR Page” opens the QR page on your
                current Vehix server. The printed QR uses the production
                Vehix URL.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
