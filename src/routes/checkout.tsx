import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { AccentHeading } from "@/components/AccentHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop, cartTotal } from "@/lib/store";
import { Beef, CalendarDays, Clock, CreditCard, Lock, Minus, Plus, Sparkles, Trash2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PA Halal Butcher & Grocer" },
      { name: "description", content: "Review your order, schedule pickup, and pay securely." },
    ],
  }),
  component: Checkout,
});

const PICKUP_TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

function Checkout() {
  const navigate = useNavigate();
  const cart = useShop((s) => s.cart);
  const user = useShop((s) => s.user);
  const updateQty = useShop((s) => s.updateQty);
  const removeFromCart = useShop((s) => s.removeFromCart);
  const clearCart = useShop((s) => s.clearCart);
  const addPoints = useShop((s) => s.addPoints);

  const dates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const [date, setDate] = useState<Date>(dates[0]);
  const [time, setTime] = useState<string>(PICKUP_TIMES[2]);

  const [card, setCard] = useState({ name: user?.name ?? "", number: "4242 4242 4242 4242", exp: "12/28", cvc: "123" });
  const [processing, setProcessing] = useState(false);

  const subtotal = cartTotal(cart);
  const tax = subtotal * 0.06;
  const total = subtotal + tax;
  const pointsEarned = Math.floor(total);

  const fmtQty = (q: number, unit: string) =>
    unit === "lb" ? `${q} lb` : `${q} × ${unit}`;

  const handlePay = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));

    const orderId = `PA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const order = {
      id: orderId,
      total,
      pointsEarned,
      pickup: `${format(date, "EEE, MMM d")} · ${time}`,
      items: cart.map((c) => ({ name: c.name, qty: c.quantity, unit: c.unit, price: c.price, prep: c.preparation })),
    };
    if (typeof window !== "undefined") sessionStorage.setItem("pa-last-order", JSON.stringify(order));

    if (user) addPoints(pointsEarned);
    clearCart();
    toast.success("Payment successful");
    navigate({ to: "/success" });
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Beef className="mx-auto h-12 w-12 text-meat" />
        <AccentHeading as="h1" text="Your cart is empty" accentIndex={3} className="mt-6 text-4xl sm:text-5xl" />
        <p className="mt-4 text-muted-foreground">Start with some fresh cuts or pantry essentials.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => navigate({ to: "/shop-meat" })} className="bg-meat text-white hover:bg-meat-dark">Shop Meat</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/grocery" })}>Browse Grocery</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <AccentHeading as="h1" text="Review and checkout" accentIndex={2} className="text-4xl sm:text-5xl" />
      <p className="mt-3 text-muted-foreground">Confirm your order, pick a time, and pay securely.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* LEFT: cart + pickup + payment */}
        <div className="space-y-8">
          {/* Cart */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4 font-bold text-ink">Your cart ({cart.length})</div>
            <ul className="divide-y divide-border">
              {cart.map((c) => (
                <li key={`${c.productId}-${c.preparation ?? ""}`} className="flex items-center gap-4 p-4 sm:p-5">
                  <img src={c.image} alt={c.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-ink">{c.name}</div>
                    {c.preparation && (
                      <div className="text-xs text-muted-foreground">Prep: {c.preparation}</div>
                    )}
                    <div className="mt-1 text-sm font-bold text-meat">${c.price.toFixed(2)} <span className="text-xs font-medium text-muted-foreground">/ {c.unit}</span></div>
                  </div>
                  <div className="flex items-center gap-1 rounded-md border border-border bg-background">
                    <button className="p-2 hover:text-meat" onClick={() => updateQty(c.productId, Math.max(0.25, c.quantity - (c.unit === "lb" ? 0.5 : 1)), c.preparation)}>
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-12 text-center text-sm font-semibold">{fmtQty(c.quantity, c.unit)}</span>
                    <button className="p-2 hover:text-meat" onClick={() => updateQty(c.productId, c.quantity + (c.unit === "lb" ? 0.5 : 1), c.preparation)}>
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(c.productId, c.preparation)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-meat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pickup */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <CalendarDays className="h-4 w-4 text-meat" />
              <span className="font-bold text-ink">Choose pickup time</span>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dates.map((d) => {
                    const active = format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => setDate(d)}
                        className={`flex min-w-20 flex-col rounded-xl border px-4 py-3 text-left transition-colors ${
                          active ? "border-meat bg-meat text-white" : "border-border bg-background hover:border-meat/50"
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{format(d, "EEE")}</span>
                        <span className="text-lg font-black">{format(d, "d")}</span>
                        <span className="text-[10px] opacity-80">{format(d, "MMM")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time window</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PICKUP_TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                        time === t ? "border-meat bg-meat text-white" : "border-border bg-background text-ink hover:border-meat/50"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" /> {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="relative rounded-2xl border-2 border-meat/30 bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-meat" />
                <span className="font-bold text-ink">Secure payment</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Lock className="h-3 w-3" /> Stripe encrypted
              </span>
            </div>

            {/* Cattle silhouette accent */}
            <svg className="pointer-events-none absolute right-4 top-16 h-24 w-24 text-meat/5" viewBox="0 0 64 64" fill="currentColor">
              <path d="M12 30c-3 0-5 2-5 5s2 5 5 5h2v8h6v-8h24v8h6v-8h2c3 0 5-2 5-5s-2-5-5-5h-2v-6c0-6-5-11-11-11h-2l-2-4h-12l-2 4h-2c-6 0-11 5-11 11v6h-2z" />
            </svg>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name on card</Label>
                <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="mt-2 focus-visible:ring-meat" placeholder="Aisha Khan" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Card number</Label>
                <Input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className="mt-2 font-mono focus-visible:ring-meat" />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expiry</Label>
                <Input value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className="mt-2 font-mono focus-visible:ring-meat" />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CVC</Label>
                <Input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} className="mt-2 font-mono focus-visible:ring-meat" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: summary */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-ink">Order summary</h2>
          <div className="space-y-2 border-y border-border py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-ink">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (6%)</span>
              <span className="font-semibold text-ink">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup</span>
              <span className="font-semibold text-ink">Free</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-ink">Total</span>
            <span className="text-3xl font-black text-meat">${total.toFixed(2)}</span>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-meat/30 bg-accent p-3 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-meat" />
            <div>
              <span className="font-bold text-meat-dark">You'll earn {pointsEarned} points</span>
              <p className="text-xs text-meat-dark/80">
                {user ? `Current balance: ${user.points} pts` : <>Sign in to start earning rewards.</>}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-background p-3 text-sm">
            <div className="font-semibold text-ink">Pickup window</div>
            <div className="text-muted-foreground">{format(date, "EEEE, MMMM d")} · {time}</div>
          </div>

          <Button
            disabled={processing}
            onClick={handlePay}
            className="w-full bg-meat py-6 text-base font-bold text-white hover:bg-meat-dark"
          >
            {processing ? "Processing…" : `Pay $${total.toFixed(2)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By paying you agree to our pickup terms.
          </p>
        </aside>
      </div>
    </div>
  );
}
