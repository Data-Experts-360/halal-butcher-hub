import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { AccentHeading } from "@/components/AccentHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop, cartTotal } from "@/lib/store";
import { Beef, Bike, CalendarDays, Clock, CreditCard, Gift, Lock, MapPin, Minus, Package, Plus, Sparkles, Trash2, X } from "lucide-react";

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
  const addOrder = useShop((s) => s.addOrder);
  const setActiveDelivery = useShop((s) => s.setActiveDelivery);

  const dates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const [date, setDate] = useState<Date>(dates[0]);
  const [time, setTime] = useState<string>(PICKUP_TIMES[2]);

  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");

  const [card, setCard] = useState({ name: user?.name ?? "", number: "4242 4242 4242 4242", exp: "12/28", cvc: "123" });
  const [processing, setProcessing] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const POINTS_PER_DOLLAR = 5; // 50 pts = $10 → 5 pts = $1
  const subtotal = cartTotal(cart);
  const tax = subtotal * 0.06;
  const deliveryFee = fulfillment === "delivery" ? 4.99 : 0;
  const preDiscountTotal = subtotal + tax + deliveryFee;
  const maxRedeemable = user
    ? Math.min(user.points, Math.floor(preDiscountTotal * POINTS_PER_DOLLAR))
    : 0;
  const clampedPoints = Math.max(0, Math.min(pointsToRedeem, maxRedeemable));
  const discount = clampedPoints / POINTS_PER_DOLLAR;
  const total = Math.max(0, preDiscountTotal - discount);
  // Earn 5 points per full $100 spent
  const pointsEarned = Math.floor(total / 100) * 5;

  const fmtQty = (q: number, unit: string) =>
    unit === "lb" ? `${q} lb` : `${q} × ${unit}`;

  const handlePay = async () => {
    if (cart.length === 0) return;
    if (!user) {
      toast.error("Please sign in to place your order");
      navigate({ to: "/signin" });
      return;
    }
    if (fulfillment === "delivery" && address.trim().length < 5) {
      toast.error("Please enter a delivery address");
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));

    const orderId = `PA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const pickupLabel =
      fulfillment === "delivery"
        ? `Delivery · ${address}`
        : `${format(date, "EEE, MMM d")} · ${time}`;
    const order = {
      id: orderId,
      customerName: user.name,
      customerEmail: user.email,
      total,
      pointsEarned,
      pickup: pickupLabel,
      items: cart.map((c) => ({ name: c.name, qty: c.quantity, unit: c.unit, price: c.price, prep: c.preparation })),
      status: "pending" as const,
      createdAt: Date.now(),
    };
    if (typeof window !== "undefined") sessionStorage.setItem("pa-last-order", JSON.stringify(order));
    addOrder(order);

    if (user) {
      if (clampedPoints > 0) addPoints(-clampedPoints);
      addPoints(pointsEarned);
    }

    if (fulfillment === "delivery") {
      setActiveDelivery({
        id: orderId,
        items: [...cart],
        subtotal,
        tax,
        fee: deliveryFee,
        total,
        address,
        customerName: user.name,
        createdAt: Date.now(),
      });
      clearCart();
      toast.success("Delivery on the way");
      navigate({ to: "/delivery" });
      return;
    }

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

          {/* Fulfillment method */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4 font-bold text-ink">How would you like your order?</div>
            <div className="grid gap-3 p-6 sm:grid-cols-2">
              <button
                onClick={() => setFulfillment("pickup")}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  fulfillment === "pickup" ? "border-meat bg-meat/5 shadow-sm" : "border-border bg-background hover:border-meat/50"
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${fulfillment === "pickup" ? "bg-meat text-white" : "bg-muted text-ink"}`}>
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-ink">In-store pickup</div>
                  <div className="text-xs text-muted-foreground">Free · Scan QR at counter</div>
                </div>
              </button>
              <button
                onClick={() => setFulfillment("delivery")}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  fulfillment === "delivery" ? "border-meat bg-meat/5 shadow-sm" : "border-border bg-background hover:border-meat/50"
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${fulfillment === "delivery" ? "bg-meat text-white" : "bg-muted text-ink"}`}>
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-ink">DoorDash delivery</div>
                  <div className="text-xs text-muted-foreground">$4.99 · Live tracking</div>
                </div>
              </button>
            </div>
          </div>

          {fulfillment === "pickup" ? (
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
          ) : (
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-6 py-4">
                <MapPin className="h-4 w-4 text-meat" />
                <span className="font-bold text-ink">Delivery address</span>
              </div>
              <div className="space-y-3 p-6">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street address</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="1600 Market St, Brisbane QLD"
                  className="focus-visible:ring-meat"
                />
                <p className="text-xs text-muted-foreground">
                  A DoorDash Dasher will pick up your order and deliver it in ~25 min. You'll be able to track it live.
                </p>
              </div>
            </div>
          )}

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
              <span className="text-muted-foreground">{fulfillment === "delivery" ? "Delivery fee" : "Pickup"}</span>
              <span className="font-semibold text-ink">{fulfillment === "delivery" ? `$${deliveryFee.toFixed(2)}` : "Free"}</span>
            </div>
            {clampedPoints > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points discount</span>
                <span className="font-semibold text-meat">−${discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {user && user.points > 0 && (
            <div className="rounded-xl border border-meat/30 bg-accent/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-meat" />
                  <span className="text-sm font-bold text-ink">Use your points</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {user.points} pts available
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                50 pts = $10 off · up to ${(maxRedeemable / POINTS_PER_DOLLAR).toFixed(2)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={maxRedeemable}
                  step={50}
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(Number(e.target.value) || 0)}
                  className="h-9 focus-visible:ring-meat"
                  placeholder="0"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPointsToRedeem(maxRedeemable)}
                  className="h-9 bg-meat text-white hover:bg-meat-dark"
                >
                  Max
                </Button>
                {clampedPoints > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPointsToRedeem(0)}
                    className="h-9"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              {clampedPoints > 0 && (
                <p className="mt-2 text-xs font-semibold text-meat-dark">
                  Redeeming {clampedPoints} pts for ${discount.toFixed(2)} off
                </p>
              )}
            </div>
          )}

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

          {user ? (
            <Button
              disabled={processing}
              onClick={handlePay}
              className="w-full bg-meat py-6 text-base font-bold text-white hover:bg-meat-dark"
            >
              {processing ? "Processing…" : `Pay $${total.toFixed(2)}`}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="rounded-xl border border-meat/30 bg-accent p-3 text-sm font-semibold text-meat-dark">
                Sign in required to place your order.
              </div>
              <Button
                onClick={() => navigate({ to: "/signin" })}
                className="w-full bg-meat py-6 text-base font-bold text-white hover:bg-meat-dark"
              >
                Sign in to continue
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/signup" })}
                className="w-full py-6 text-base font-bold"
              >
                Create an account
              </Button>
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground">
            By paying you agree to our pickup terms.
          </p>
        </aside>
      </div>
    </div>
  );
}
