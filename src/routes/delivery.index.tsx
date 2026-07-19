import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Package, Terminal, Truck, CheckCircle2, Clock } from "lucide-react";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/delivery/")({
  head: () => ({
    meta: [
      { title: "Order Confirmation — DoorDash Delivery" },
      { name: "description", content: "Your DoorDash order has been placed. Track it live." },
    ],
  }),
  component: DeliveryConfirmation,
});

interface LogLine {
  id: number;
  ts: string;
  method: string;
  text: string;
  status?: string;
}

const now = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 8) + "." + String(d.getMilliseconds()).padStart(3, "0");
};

function DeliveryConfirmation() {
  const activeDelivery = useShop((s) => s.activeDelivery);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [logOpen, setLogOpen] = useState(true);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const pushLog = (l: Omit<LogLine, "id" | "ts">) =>
    setLogs((prev) => [...prev, { ...l, id: ++idRef.current, ts: now() }]);

  useEffect(() => {
    const addr = activeDelivery?.address ?? "1600 Market St";
    const seq: Array<[number, Omit<LogLine, "id" | "ts">]> = [
      [200, { method: "POST", text: "/api/v1/orders/create", status: "201 Created" }],
      [900, { method: "POST", text: `/api/v1/payments/charge  amount=${(activeDelivery?.total ?? 0).toFixed(2)}`, status: "200 OK" }],
      [1700, { method: "GET", text: "/api/v1/merchants/pa-halal-butcher", status: "200 OK" }],
      [2600, { method: "POST", text: `/api/v1/deliveries/quote  dropoff=${addr}`, status: "200 OK" }],
      [3600, { method: "POST", text: `/api/v1/deliveries/create  external_id=${activeDelivery?.id ?? "ord_9F2K1H"}`, status: "201 Created" }],
      [4600, { method: "GET", text: "/api/v1/deliveries/track  id=dlv_ax82nq", status: "200 OK" }],
      [5800, { method: "WEBHOOK", text: "delivery.status.updated: preparing" }],
    ];
    const timers = seq.map(([d, l]) => setTimeout(() => pushLog(l), d));
    return () => timers.forEach(clearTimeout);
  }, [activeDelivery]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const fallbackItems = [
    { name: "Truffle Burger", qty: 2, unit: "unit", price: 15.5, image: "" },
    { name: "Hand-Cut Fries", qty: 1, unit: "unit", price: 6.0, image: "" },
  ];
  const items = activeDelivery
    ? activeDelivery.items.map((c) => ({ name: c.name, qty: c.quantity, unit: c.unit, price: c.price, image: c.image, prep: c.preparation }))
    : fallbackItems.map((f) => ({ ...f, prep: undefined as string | undefined }));
  const subtotal = activeDelivery?.subtotal ?? items.reduce((s, i) => s + i.qty * i.price, 0);
  const delivery = activeDelivery?.fee ?? 2.99;
  const tax = activeDelivery?.tax ?? subtotal * 0.06;
  const total = activeDelivery?.total ?? subtotal + delivery + tax;
  const orderId = activeDelivery?.id ?? "PA-9F2K1H";
  const address = activeDelivery?.address ?? "1600 Market St";

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-40">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FF3008] text-white shadow-md">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">DoorDash · Order confirmed</div>
            <div className="text-lg font-bold text-neutral-900">Order #{orderId}</div>
          </div>
        </div>

        {/* Status card */}
        <div className="animate-fade-in rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3008]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3008] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF3008]" />
                </span>
                Live
              </div>
              <h1 className="mt-1 text-2xl font-black text-neutral-900">Preparing your order…</h1>
              <p className="mt-1 text-sm text-neutral-600">PA Halal Butcher &amp; Grocer · 1.2 mi away</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                <MapPin className="h-3.5 w-3.5 text-[#FF3008]" /> {address}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">ETA</div>
              <div className="flex items-center gap-1 text-2xl font-black text-neutral-900">
                <Clock className="h-5 w-5 text-[#FF3008]" /> 25 min
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/delivery/track"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3008] px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#E52B06] hover:shadow-lg"
            >
              <Truck className="h-5 w-5" /> Track Delivery
            </Link>
          </div>
        </div>

        {/* Items */}
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">Your order</h2>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">
              {items.reduce((s, i) => s + i.qty, 0)} items
            </span>
          </div>
          <ul className="mt-4 divide-y divide-neutral-100">
            {items.map((it) => (
              <li key={it.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FFF1EE] text-sm font-bold text-[#FF3008]">
                    {it.qty}×
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">{it.name}</span>
                </div>
                <span className="text-sm font-bold text-neutral-900">${(it.price * it.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4 text-sm">
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row label="Delivery fee" value={`$${delivery.toFixed(2)}`} />
            <Row label="Tax" value={`$${tax.toFixed(2)}`} />
            <div className="flex items-center justify-between pt-2 text-base">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="font-black text-neutral-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Payment authorized on Visa •••• 4242. A receipt was emailed to you.</span>
        </div>
      </div>

      {/* Network log */}
      <NetworkLog logs={logs} open={logOpen} setOpen={setLogOpen} scrollRef={scrollRef} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-800">{value}</span>
    </div>
  );
}

export function NetworkLog({
  logs,
  open,
  setOpen,
  scrollRef,
}: {
  logs: LogLine[];
  open: boolean;
  setOpen: (b: boolean) => void;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-[#0B0B0F] text-neutral-200 shadow-2xl">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-2.5 font-mono text-xs"
      >
        <span className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-bold text-emerald-400">network_activity.log</span>
          <span className="text-neutral-500">— {logs.length} requests</span>
        </span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      {open && (
        <div
          ref={scrollRef}
          className="max-h-56 overflow-y-auto border-t border-neutral-800 px-5 py-3 font-mono text-[11px] leading-relaxed"
        >
          {logs.length === 0 && <div className="text-neutral-500">$ awaiting requests…</div>}
          {logs.map((l) => (
            <div key={l.id} className="animate-fade-in whitespace-nowrap">
              <span className="text-neutral-500">{l.ts}</span>{" "}
              <span
                className={
                  l.method === "POST"
                    ? "text-amber-400"
                    : l.method === "GET"
                      ? "text-sky-400"
                      : l.method === "WEBHOOK"
                        ? "text-fuchsia-400"
                        : "text-emerald-400"
                }
              >
                [{l.method}]
              </span>{" "}
              <span className="text-neutral-100">{l.text}</span>{" "}
              {l.status && <span className="text-emerald-400">→ {l.status}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
