import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  ChefHat,
  Clock,
  MessageSquare,
  Package,
  Phone,
  Star,
  Store,
  X,
} from "lucide-react";
import { NetworkLog } from "./delivery.index";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/delivery/track")({
  head: () => ({
    meta: [
      { title: "Live Tracking — DoorDash Delivery" },
      { name: "description", content: "Track your Dasher in real time." },
    ],
  }),
  component: TrackDelivery,
});

type StageKey = "placed" | "preparing" | "at_store" | "out" | "arrived";

const STAGES: { key: StageKey; label: string; icon: typeof ChefHat }[] = [
  { key: "placed", label: "Order Placed", icon: CheckCircle2 },
  { key: "preparing", label: "Food Preparing", icon: ChefHat },
  { key: "at_store", label: "Dasher at Store", icon: Store },
  { key: "out", label: "Out for Delivery", icon: Bike },
  { key: "arrived", label: "Arrived", icon: Package },
];

const now = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 8) + "." + String(d.getMilliseconds()).padStart(3, "0");
};

interface LogLine {
  id: number;
  ts: string;
  method: string;
  text: string;
  status?: string;
}

function TrackDelivery() {
  const navigate = useNavigate();
  const activeDelivery = useShop((s) => s.activeDelivery);
  const orderId = activeDelivery?.id ?? "PA-9F2K1H";
  const [stage, setStage] = useState<StageKey>("preparing");
  const [etaMin, setEtaMin] = useState(25);
  const [driverProgress, setDriverProgress] = useState(0); // 0..1 along path
  const [notif, setNotif] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 1, ts: now(), method: "GET", text: "/api/v1/deliveries/dlv_ax82nq", status: "200 OK" },
    { id: 2, ts: now(), method: "WS", text: "wss://track.doordash.mock/subscribe  dlv_ax82nq", status: "OPEN" },
  ]);
  const [logOpen, setLogOpen] = useState(true);
  const idRef = useRef(2);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const pushLog = (l: Omit<LogLine, "id" | "ts">) =>
    setLogs((prev) => [...prev, { ...l, id: ++idRef.current, ts: now() }]);

  // Countdown timer (before dasher is out, tick down slowly)
  useEffect(() => {
    if (stage === "arrived" || stage === "out") return;
    const t = setInterval(() => setEtaMin((m) => Math.max(1, m - 1)), 15000);
    return () => clearInterval(t);
  }, [stage]);

  // Automated scenario
  useEffect(() => {
    pushLog({ method: "GET", text: "/api/v1/deliveries/track  id=dlv_ax82nq", status: "200 OK" });

    const AT_STORE_AT = 12000;
    const OUT_AT = 24000;
    const ARRIVE_AT = 114000; // 90s of smooth driving
    const OUT_ETA = 9; // minutes shown when driver starts moving

    const t1 = setTimeout(() => {
      setStage("at_store");
      pushLog({ method: "WEBHOOK", text: "delivery.status.updated: dasher_at_store" });
    }, AT_STORE_AT);

    const t2 = setTimeout(() => {
      setStage("out");
      setEtaMin(OUT_ETA);
      pushLog({ method: "WEBHOOK", text: "delivery.status.updated: enroute_to_dropoff" });
      pushLog({ method: "GET", text: "/api/v1/deliveries/dlv_ax82nq/route", status: "200 OK" });
    }, OUT_AT);

    // Smooth driver animation across the whole "out for delivery" window.
    // rAF drives progress every frame; the marker has no CSS transition so it
    // moves seamlessly rather than easing in 1s hops.
    let raf = 0;
    const started = Date.now();
    // Ease-in-out so departure and arrival feel natural, mid-route stays steady.
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = () => {
      const elapsed = Date.now() - started;
      if (elapsed >= OUT_AT && elapsed <= ARRIVE_AT) {
        const raw = (elapsed - OUT_AT) / (ARRIVE_AT - OUT_AT);
        const eased = easeInOut(raw);
        setDriverProgress(eased);
        // Drive ETA continuously off progress so it ticks down as the bike moves.
        const remaining = Math.max(1, Math.ceil(OUT_ETA * (1 - eased)));
        setEtaMin(remaining);
      }
      if (elapsed < ARRIVE_AT) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t3 = setTimeout(() => {
      setStage("arrived");
      setEtaMin(0);
      setDriverProgress(1);
      pushLog({ method: "WEBHOOK", text: "delivery.status.updated: delivered" });
      setNotif("Alex has dropped off your order!");
      setTimeout(() => setNotif(null), 6000);
    }, ARRIVE_AT);

    // Periodic driver ping logs
    const pingInterval = setInterval(() => {
      pushLog({ method: "GET", text: "/api/v1/deliveries/dlv_ax82nq/location", status: "200 OK" });
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(raf);
      clearInterval(pingInterval);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const activeIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-40">
      {/* Notification banner */}
      <div
        className={`fixed left-1/2 top-4 z-50 w-[min(92vw,420px)] -translate-x-1/2 transition-all duration-500 ${
          notif ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF3008] text-white">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">DoorDash</div>
            <div className="truncate text-sm font-bold text-neutral-900">{notif}</div>
          </div>
          <button onClick={() => setNotif(null)} className="text-neutral-400 hover:text-neutral-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/delivery" })}
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            <ArrowLeft className="h-4 w-4" /> Order
          </button>
          <div className="text-xs font-semibold text-neutral-500">Order #{orderId}</div>
        </div>

        {/* Hero status */}
        <div className="animate-fade-in overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-2">
            {/* Map */}
            <MockMap driverProgress={driverProgress} stage={stage} />

            {/* Status side */}
            <div className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3008]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3008] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF3008]" />
                  </span>
                  Live tracking
                </div>
                <h1 key={stage} className="mt-2 animate-fade-in text-3xl font-black leading-tight text-neutral-900">
                  {stage === "arrived" ? "Delivered!" : STAGES[activeIndex].label}
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  {stage === "arrived"
                    ? "Enjoy your meal — bon appétit."
                    : stage === "out"
                      ? "Alex is on the way to you."
                      : stage === "at_store"
                        ? "Dasher just picked up your food."
                        : "Chef is plating your order."}
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between rounded-xl bg-[#FFF1EE] p-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF3008]">Estimated arrival</div>
                  <div className="flex items-baseline gap-1">
                    <span key={etaMin} className="animate-fade-in text-4xl font-black text-neutral-900">
                      {etaMin}
                    </span>
                    <span className="text-sm font-bold text-neutral-700">min</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-[#FF3008]/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Delivery progress</h2>
          <ol className="mt-5 relative flex justify-between">
            <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-[#FF3008] transition-all duration-1000 ease-out"
                style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
              />
            </div>
            {STAGES.map((s, i) => {
              const done = i <= activeIndex;
              const current = i === activeIndex && stage !== "arrived";
              const Icon = s.icon;
              return (
                <li key={s.key} className="relative z-10 flex flex-col items-center gap-2" style={{ width: 80 }}>
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full border-2 transition-all duration-500 ${
                      done
                        ? "border-[#FF3008] bg-[#FF3008] text-white shadow-lg shadow-[#FF3008]/30"
                        : "border-neutral-200 bg-white text-neutral-400"
                    } ${current ? "scale-110 ring-4 ring-[#FF3008]/20" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`text-center text-[11px] font-semibold leading-tight ${
                      done ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Dasher card */}
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#FF3008] to-[#B71C00] text-2xl font-black text-white shadow-md">
                A
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-neutral-900">Alex M.</h3>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Your Dasher
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-sm text-neutral-600">
                <span className="flex items-center gap-1 font-bold text-neutral-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9
                </span>
                <span className="text-neutral-300">·</span>
                <span>1,284 deliveries</span>
                <span className="text-neutral-300">·</span>
                <span>Silver Honda Civic</span>
              </div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <IconButton icon={Phone} label="Call" />
              <IconButton icon={MessageSquare} label="Text" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
            <IconButton icon={Phone} label="Call" full />
            <IconButton icon={MessageSquare} label="Text" full />
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/delivery" className="text-xs font-semibold text-neutral-500 hover:text-[#FF3008]">
            View order details
          </Link>
        </div>
      </div>

      <NetworkLog logs={logs} open={logOpen} setOpen={setLogOpen} scrollRef={scrollRef} />
    </div>
  );
}

function IconButton({
  icon: Icon,
  label,
  full,
}: {
  icon: typeof Phone;
  label: string;
  full?: boolean;
}) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-800 shadow-sm transition-all hover:border-[#FF3008] hover:text-[#FF3008] ${
        full ? "w-full" : ""
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

/* -------------------- Mock Map -------------------- */

function MockMap({ driverProgress, stage }: { driverProgress: number; stage: StageKey }) {
  // Path follows the road grid: east along y=220, north along x=300, east along y=90.
  // Small arc radii at corners so the bike turns naturally rather than teleporting.
  const path = "M 80 220 L 292 220 A 8 8 0 0 0 300 212 L 300 98 A 8 8 0 0 1 308 90 L 340 90";
  const pathLen = useMemo(() => {
    if (typeof document === "undefined") return 0;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    return p.getTotalLength();
  }, [path]);
  const pt = useMemo(() => pointOnPath(path, driverProgress), [driverProgress]);

  const showDriver = stage !== "placed" && stage !== "preparing";
  const arrived = stage === "arrived";

  return (
    <div className="relative min-h-[320px] overflow-hidden bg-[#E8EEF3] md:min-h-[420px]">
      {/* Base */}
      <svg viewBox="0 0 420 320" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D6DFE6" strokeWidth="0.6" />
          </pattern>
          <linearGradient id="park" x1="0" x2="1">
            <stop offset="0%" stopColor="#C9E4C5" />
            <stop offset="100%" stopColor="#B5D8B0" />
          </linearGradient>
        </defs>
        <rect width="420" height="320" fill="#EEF3F7" />
        <rect width="420" height="320" fill="url(#grid)" />

        {/* Park */}
        <path d="M 40 40 Q 120 20 180 60 Q 200 120 130 140 Q 60 150 40 100 Z" fill="url(#park)" opacity="0.9" />
        {/* Water */}
        <path d="M 260 240 Q 320 220 400 240 L 420 320 L 240 320 Z" fill="#BFD9E8" opacity="0.85" />

        {/* Roads */}
        <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
          <path d="M 0 220 L 420 220" strokeWidth="14" />
          <path d="M 0 90 L 420 90" strokeWidth="10" />
          <path d="M 140 0 L 140 320" strokeWidth="10" />
          <path d="M 300 0 L 300 320" strokeWidth="10" />
          <path d="M 60 0 L 60 320" strokeWidth="6" opacity="0.85" />
        </g>
        <g stroke="#E9EEF2" strokeDasharray="4 6" fill="none">
          <path d="M 0 220 L 420 220" strokeWidth="1.5" />
          <path d="M 140 0 L 140 320" strokeWidth="1.5" />
        </g>

        {/* Buildings hint */}
        <g fill="#DDE4EA">
          <rect x="160" y="100" width="26" height="26" rx="2" />
          <rect x="200" y="110" width="20" height="30" rx="2" />
          <rect x="240" y="100" width="30" height="20" rx="2" />
          <rect x="170" y="150" width="18" height="18" rx="2" />
        </g>

        {/* Route path */}
        <path d={path} stroke="#FF3008" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="8 6" opacity="0.35" />
        <path
          d={path}
          stroke="#FF3008"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={1000 - driverProgress * 1000}
        />
      </svg>

      {/* Restaurant marker */}
      <MapPin x={80} y={220} color="#111827" label="Gourmet Burger Joint" iconChar="🍔" />

      {/* Home marker */}
      <MapPin x={340} y={90} color="#FF3008" label="Your address" iconChar="🏠" pulse={arrived} />

      {/* Driver marker */}
      {showDriver && (
        <div
          className="absolute z-20"
          style={{
            left: `${(pt.x / 420) * 100}%`,
            top: `${(pt.y / 320) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-[#FF3008]/30" />
            <div className="relative grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-[#FF3008] text-white shadow-xl">
              <Bike className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay chip */}
      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-neutral-700 shadow">
        {arrived ? "At your door" : stage === "out" ? "Dasher en route" : "Route ready"}
      </div>
    </div>
  );
}

function MapPin({
  x,
  y,
  color,
  label,
  iconChar,
  pulse,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  iconChar: string;
  pulse?: boolean;
}) {
  return (
    <div
      className="absolute z-10"
      style={{ left: `${(x / 420) * 100}%`, top: `${(y / 320) * 100}%`, transform: "translate(-50%, -100%)" }}
    >
      <div className="flex flex-col items-center">
        <div className="whitespace-nowrap rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-800 shadow">
          {label}
        </div>
        <div className="relative mt-1">
          {pulse && <span className="absolute inset-0 animate-ping rounded-full" style={{ background: `${color}55` }} />}
          <div
            className="relative grid h-8 w-8 place-items-center rounded-full border-2 border-white text-sm shadow-lg"
            style={{ background: color, color: "white" }}
          >
            {iconChar}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compute point along an SVG path string by sampling.
function pointOnPath(d: string, t: number) {
  if (typeof document === "undefined") return { x: 0, y: 0 };
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  const len = p.getTotalLength();
  const pt = p.getPointAtLength(Math.max(0, Math.min(1, t)) * len);
  return { x: pt.x, y: pt.y };
}
