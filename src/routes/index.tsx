import { createFileRoute, Link } from "@tanstack/react-router";
import { AccentHeading } from "@/components/AccentHeading";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Beef, Clock, CreditCard, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PA Halal Butcher & Grocer — Fresh Halal Meat & Pantry" },
      { name: "description", content: "Premium 100% halal-certified meat cut to order. Pantry staples, spices, dairy. Pickup in-store." },
      { property: "og:title", content: "PA Halal Butcher & Grocer" },
      { property: "og:description", content: "Premium halal meat, custom cut. Pantry staples, spices, and marinades." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.filter((p) =>
    ["beef-ribeye", "beef-tbone", "lamb-chops", "chicken-thigh", "beef-shortrib", "goat-curry", "lamb-leg", "chicken-whole"].includes(p.id),
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5 text-meat" />
              100% Zabiha Halal · Hand-Slaughtered
            </div>

            <h1 className="mt-6 text-5xl text-balance sm:text-6xl lg:text-7xl">
              <span className="block text-white">Premium halal,</span>
              <span className="block">
                <span className="text-meat">cut</span>{" "}
                <span className="text-white">to order.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/80">
              Family-owned butcher and grocer in Philadelphia. Pasture-raised meats,
              hand-blended spices, and a pantry stocked with the staples your kitchen
              actually uses.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop-meat">
                <Button size="lg" className="h-12 bg-meat px-7 text-base font-bold text-white hover:bg-meat-dark">
                  <Beef className="mr-2 h-5 w-5" /> Shop Meat
                </Button>
              </Link>
              <Link to="/grocery">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/30 bg-white/5 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/10 hover:text-white"
                >
                  Browse Grocery
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: "30+", l: "Years cutting" },
                { n: "100%", l: "Zabiha halal" },
                { n: "4.9★", l: "1.2k reviews" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-black text-meat">{s.n}</div>
                  <div className="text-xs text-white/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 text-sm sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { i: ShieldCheck, t: "Certified Halal" },
            { i: Leaf, t: "Pasture-Raised" },
            { i: Truck, t: "Same-day Pickup" },
            { i: Sparkles, t: "Loyalty Rewards" },
          ].map(({ i: Icon, t }) => (
            <div key={t} className="flex items-center gap-2.5">
              <Icon className="h-5 w-5 text-meat" />
              <span className="font-semibold text-ink">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative bg-cattle-pattern py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?auto=format&fit=crop&w=1200&q=80"
              alt="Butcher at work"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-4 rounded-2xl border border-border bg-card p-5 shadow-xl sm:-right-6">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-10 w-10 text-meat" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">HMS Certified</div>
                  <div className="text-base font-bold text-ink">Since 1996</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-meat">About PA Halal</span>
            <AccentHeading
              as="h2"
              text="Three generations. One standard."
              accentIndex={1}
              className="mt-3 text-4xl sm:text-5xl"
            />
            <p className="mt-6 text-lg text-muted-foreground">
              We started as a single counter on Market Street in 1996. Three decades
              later, we still butcher in-house, by hand, with the same care our
              grandfather insisted on. Every animal is traceable, every cut is
              certified Zabiha halal, and every order leaves our shop the same day
              it's prepared.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Whole-animal, in-house butchery — nothing pre-packed",
                "Sourced from Amish and Mennonite family farms in PA",
                "Custom cuts, mincing, and marinating at no extra charge",
                "Hand-blended spice mixes pounded weekly",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-meat" />
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-meat">The Counter</span>
              <AccentHeading
                as="h2"
                text="Today's freshest cuts"
                accentIndex={2}
                className="mt-3 text-4xl sm:text-5xl"
              />
            </div>
            <Link to="/shop-meat" className="text-sm font-bold text-meat hover:text-meat-dark">
              See all meat →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0 bg-meat-grain opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-meat">How it works</span>
            <AccentHeading
              as="h2"
              text="Four steps to your order"
              accentIndex={3}
              className="mt-3 text-4xl sm:text-5xl text-white [&_span:not(.text-meat)]:text-white"
            />
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              From counter to kitchen in under an hour. No subscriptions, no waiting.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Beef, n: "01", t: "Choose your cut", d: "Pick from beef, lamb, goat, chicken — or stock your pantry." },
              { i: BadgeCheck, n: "02", t: "Custom prep", d: "Cubed, minced, sliced, bone-in. Tell us how you cook it." },
              { i: Clock, n: "03", t: "Pickup window", d: "Reserve a 30-minute slot. Your order is fresh when you arrive." },
              { i: CreditCard, n: "04", t: "Secure checkout", d: "Pay safely with Stripe. Earn loyalty points on every order." },
            ].map(({ i: Icon, n, t, d }, idx, arr) => (
              <li key={n} className="relative">
                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-meat/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-meat">{n}</span>
                    <Icon className="h-6 w-6 text-meat" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-white">{t}</h3>
                  <p className="mt-2 text-sm text-white/70">{d}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 h-px w-6 bg-meat/40" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm sm:p-14">
          <Sparkles className="mx-auto h-10 w-10 text-meat" />
          <AccentHeading
            as="h2"
            text="Join PA Halal Rewards"
            accentIndex={2}
            className="mt-4 text-4xl sm:text-5xl"
          />
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sign up and we'll add <span className="font-bold text-meat">50 points</span> to
            your account instantly. Earn 1 point per $1 spent — redeem on any
            future order.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" className="bg-meat text-white hover:bg-meat-dark">Create free account</Button>
            </Link>
            <Link to="/shop-meat">
              <Button size="lg" variant="outline">Start shopping</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
