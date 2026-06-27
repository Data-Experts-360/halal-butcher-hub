import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useShop, type Order } from "@/lib/store";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES: Order["status"][] = ["pending", "ready", "completed", "cancelled"];

function AdminOrders() {
  const orders = useShop((s) => s.orders);
  const updateOrderStatus = useShop((s) => s.updateOrderStatus);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchQ =
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(query.toLowerCase());
    const matchS = filter === "all" || o.status === filter;
    return matchQ && matchS;
  });

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
                {s}
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
                        toast.success(`Order ${o.id} → ${e.target.value}`);
                      }}
                      className="rounded-md border border-border bg-white px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-ink focus:outline-none focus:ring-2 focus:ring-meat"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
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
    </div>
  );
}
