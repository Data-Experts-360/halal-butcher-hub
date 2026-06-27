import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { AccentHeading } from "@/components/AccentHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/success")({
  head: () => ({ meta: [{ title: "Order confirmed — PA Halal" }] }),
  component: Success,
});

interface OrderItem { name: string; qty: number; unit: string; price: number; prep?: string }
interface Order { id: string; total: number; pointsEarned: number; pickup: string; items: OrderItem[] }

function Success() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("pa-last-order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">No recent order found.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-meat">Go home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-accent">
            <CheckCircle2 className="h-9 w-9 text-meat" />
          </div>
        </div>
        <AccentHeading as="h1" text="Order confirmed!" accentIndex={1} className="mt-6 text-center text-4xl sm:text-5xl" />
        <p className="mt-3 text-center text-muted-foreground">
          Thanks for your order. We'll have it ready at the counter.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order #</div>
              <div className="font-mono text-lg font-bold text-ink">{order.id}</div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-meat">
                <Clock className="h-3.5 w-3.5" /> Pickup window
              </div>
              <div className="mt-1 font-bold text-ink">{order.pickup}</div>
              <div className="text-xs text-muted-foreground">2410 Market St, Philadelphia</div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-meat/30 bg-accent p-4 text-sm">
              <Sparkles className="h-4 w-4 text-meat" />
              <span className="font-bold text-meat-dark">+{order.pointsEarned} loyalty points earned</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-4">
            <QRCodeSVG value={`PAHALAL:${order.id}`} size={148} fgColor="#B91C1C" />
            <span className="text-xs font-semibold text-muted-foreground">Show at pickup</span>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Items</h3>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-ink">{it.name}</div>
                  {it.prep && <div className="text-xs text-muted-foreground">Prep: {it.prep}</div>}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-ink">${(it.price * it.qty).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{it.qty} × {it.unit}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-bold uppercase tracking-wider text-ink">Total paid</span>
            <span className="text-2xl font-black text-meat">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/"><Button variant="outline">Back home</Button></Link>
          <Link to="/shop-meat"><Button className="bg-meat text-white hover:bg-meat-dark">Shop again</Button></Link>
        </div>
      </div>
    </div>
  );
}
