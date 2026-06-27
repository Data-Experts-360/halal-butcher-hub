import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Mail, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

interface Customer {
  email: string;
  name: string;
  orders: number;
  totalSpent: number;
  lastOrder: number;
}

function AdminCustomers() {
  const orders = useShop((s) => s.orders);
  const [query, setQuery] = useState("");

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    for (const o of orders) {
      const k = o.customerEmail.toLowerCase();
      const c = map.get(k);
      if (c) {
        c.orders += 1;
        c.totalSpent += o.total;
        c.lastOrder = Math.max(c.lastOrder, o.createdAt);
      } else {
        map.set(k, {
          email: o.customerEmail,
          name: o.customerName,
          orders: 1,
          totalSpent: o.total,
          lastOrder: o.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everyone who has placed an order with you.
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers"
            className="w-64 pl-9 focus-visible:ring-meat"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No customers yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total spent</th>
                <th className="px-4 py-3">Last order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.email} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-meat/10 text-sm font-bold text-meat">
                        {c.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink">{c.name}</div>
                        <div className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {c.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{c.orders}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-meat">${c.totalSpent.toFixed(2)}</span>
                    {c.totalSpent > 200 && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Sparkles className="h-3 w-3" /> VIP
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(c.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
