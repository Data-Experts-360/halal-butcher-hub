import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Package, DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const orders = useShop((s) => s.orders);
  const products = useShop((s) => s.adminProducts);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const readyOrders = orders.filter((o) => o.status === "ready").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const lowStock = products.filter((p) => p.stock <= 5).length;

  const stats = [
    {
      label: "Total revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Orders",
      value: orders.length,
      icon: ShoppingBag,
      tone: "text-meat bg-rose-50",
    },
    {
      label: "Products",
      value: products.length,
      icon: Package,
      tone: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Pending pickup",
      value: pendingOrders,
      icon: Clock,
      tone: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink">Dashboard overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A real-time snapshot of your storefront.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 text-2xl font-black text-ink">{s.value}</div>
            </div>
            <div className={`grid h-11 w-11 place-items-center rounded-lg ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Status tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Clock className="h-3.5 w-3.5" /> Pending
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{pendingOrders}</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <TrendingUp className="h-3.5 w-3.5" /> Ready for pickup
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{readyOrders}</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{completedOrders}</div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-bold text-ink">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-meat hover:text-meat-dark">
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No orders yet. Customer orders will appear here.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <div className="font-mono text-sm font-bold text-ink">{o.id}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {o.customerName} · {o.pickup}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      o.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : o.status === "ready"
                        ? "bg-blue-50 text-blue-700"
                        : o.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="font-bold text-meat">${o.total.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lowStock > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span className="font-bold">Heads up:</span> {lowStock} product
          {lowStock === 1 ? " is" : "s are"} running low on stock.{" "}
          <Link to="/admin/products" className="font-semibold underline">
            Manage inventory
          </Link>
        </div>
      )}
    </div>
  );
}
