import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Search, ChevronDown, ChevronUp, QrCode, X, ScanLine, PackageCheck, Clock, Sparkles } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useShop, type Order } from "@/lib/store";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES: Order["status"][] = ["pending", "ready", "handed_over", "completed", "cancelled"];

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pending",
  ready: "Ready",
  handed_over: "Handed over",
  completed: "Completed",
  cancelled: "Cancelled",
};

function AdminOrders() {
  const orders = useShop((s) => s.orders);
  const updateOrderStatus = useShop((s) => s.updateOrderStatus);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchQ =
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(query.toLowerCase());
    const matchS = filter === "all" || o.status === filter;
    return matchQ && matchS;
  });

  const handleScanned = (raw: string) => {
    const id = raw.startsWith("PAHALAL:") ? raw.slice("PAHALAL:".length) : raw.trim();
    const order = orders.find((o) => o.id === id);
    if (!order) {
      toast.error(`No order found for code "${id}"`);
      return;
    }
    setScannedOrder(order);
    setScannerOpen(false);
    toast.success(`Order ${order.id} loaded`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and update every customer pickup order.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setScannerOpen(true)}
            className="bg-meat text-white hover:bg-meat-dark"
          >
            <QrCode className="mr-2 h-4 w-4" /> Scan QR code
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, name, email"
              className="w-64 pl-9 focus-visible:ring-meat"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === s ? "bg-meat text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s === "all" ? "all" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No orders match your filters.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((o) => {
              const isOpen = expanded === o.id;
              return (
                <li key={o.id}>
                  <div className="grid grid-cols-2 items-center gap-3 px-4 py-4 sm:grid-cols-[1fr_1.5fr_auto_auto_auto] sm:px-6">
                    <div>
                      <div className="font-mono text-sm font-bold text-ink">{o.id}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-ink">{o.customerName}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {o.customerEmail} · {o.pickup}
                      </div>
                    </div>
                    <div className="font-bold text-meat">${o.total.toFixed(2)}</div>
                    <select
                      value={o.status}
                      onChange={(e) => {
                        updateOrderStatus(o.id, e.target.value as Order["status"]);
                        toast.success(`Order ${o.id} → ${STATUS_LABEL[e.target.value as Order["status"]]}`);
                      }}
                      className="rounded-md border border-border bg-white px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-ink focus:outline-none focus:ring-2 focus:ring-meat"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setExpanded(isOpen ? null : o.id)}
                      className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
                    >
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="border-t border-border bg-slate-50 px-6 py-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Items
                      </div>
                      <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-white">
                        {o.items.map((it, i) => (
                          <li key={i} className="flex justify-between px-4 py-2 text-sm">
                            <div>
                              <div className="font-semibold text-ink">{it.name}</div>
                              {it.prep && (
                                <div className="text-xs text-muted-foreground">Prep: {it.prep}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-ink">
                                ${(it.price * it.qty).toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {it.qty} × {it.unit}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Points earned: <span className="font-semibold text-ink">{o.pointsEarned}</span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {scannerOpen && (
        <ScannerModal
          onClose={() => setScannerOpen(false)}
          onScan={handleScanned}
        />
      )}

      {scannedOrder && (
        <ScannedOrderModal
          order={orders.find((o) => o.id === scannedOrder.id) ?? scannedOrder}
          onClose={() => setScannedOrder(null)}
          onUpdate={(s) => {
            updateOrderStatus(scannedOrder.id, s);
            toast.success(`Order ${scannedOrder.id} → ${STATUS_LABEL[s]}`);
          }}
        />
      )}
    </div>
  );
}

function ScannerModal({
  onClose,
  onScan,
}: {
  onClose: () => void;
  onScan: (text: string) => void;
}) {
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);
  const containerId = "admin-qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;
    let stopped = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          if (stopped) return;
          stopped = true;
          scanner.stop().finally(() => onScan(decoded));
        },
        () => {},
      )
      .catch((e) => {
        setError(
          typeof e === "string"
            ? e
            : "Could not access camera. Enter the order ID manually below.",
        );
      });

    return () => {
      stopped = true;
      if (scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
      scanner.clear();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-meat" />
            <h2 className="text-lg font-bold text-ink">Scan receipt QR</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Point the camera at the QR code on the customer's receipt.
        </p>

        <div
          id={containerId}
          className="mt-4 aspect-square w-full overflow-hidden rounded-xl border border-border bg-slate-900"
        />

        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Or enter order ID
          </label>
          <div className="mt-1.5 flex gap-2">
            <Input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="PA-XXXXXX"
              className="focus-visible:ring-meat"
            />
            <Button
              onClick={() => manual.trim() && onScan(manual.trim())}
              className="bg-meat text-white hover:bg-meat-dark"
            >
              Look up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScannedOrderModal({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (status: Order["status"]) => void;
}) {
  const badge = (s: Order["status"]) => {
    const map: Record<Order["status"], string> = {
      pending: "bg-amber-100 text-amber-800",
      ready: "bg-blue-100 text-blue-800",
      handed_over: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[s];
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-meat" />
            <h2 className="text-lg font-bold text-ink">Scanned order</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Order #
              </div>
              <div className="font-mono text-lg font-bold text-ink">{order.id}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badge(order.status)}`}
            >
              {STATUS_LABEL[order.status]}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer
              </div>
              <div className="mt-1 font-semibold text-ink">{order.customerName}</div>
              <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-meat">
                <Clock className="h-3.5 w-3.5" /> Pickup
              </div>
              <div className="mt-1 font-semibold text-ink">{order.pickup}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Items
            </div>
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
              {order.items.map((it, i) => (
                <li key={i} className="flex justify-between px-4 py-3 text-sm">
                  <div>
                    <div className="font-semibold text-ink">{it.name}</div>
                    {it.prep && (
                      <div className="text-xs text-muted-foreground">Prep: {it.prep}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-ink">
                      ${(it.price * it.qty).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {it.qty} × {it.unit}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-meat" />
                +{order.pointsEarned} points earned
              </div>
              <div className="text-xl font-black text-meat">${order.total.toFixed(2)}</div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-slate-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Update status
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate(s)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    order.status === s
                      ? "bg-meat text-white shadow"
                      : "border border-border bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => onUpdate("handed_over")}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Mark handed over
              </Button>
              <Button
                onClick={() => onUpdate("completed")}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Mark completed
              </Button>
              <Button variant="outline" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
