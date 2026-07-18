import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { AccentHeading } from "@/components/AccentHeading";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import aboutVideoAsset from "@/assets/about-video.mp4.asset.json";
import aboutPosterAsset from "@/assets/about-poster.jpg.asset.json";
import { BadgeCheck, Beef, ChevronLeft, ChevronRight, Clock, CreditCard, Leaf, MapPin, Phone, Quote, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

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

function AboutVideo() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="clay-image-frame relative overflow-hidden">
        <video
          src={aboutVideoAsset.url}
          poster={aboutPosterAsset.url}
          className="aspect-[9/16] w-full max-h-[580px] rounded-[1.5rem] object-cover sm:aspect-[4/5]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className="absolute -bottom-5 -right-3 clay-surface flex items-center gap-3 p-4 sm:-right-5">
        <div className="clay-meat flex h-11 w-11 items-center justify-center">
          <BadgeCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">HMS Certified</div>
          <div className="text-sm font-extrabold text-ink">Since 1996</div>
        </div>
      </div>
    </div>
  );
}

function GroceryPicksRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const grocery = PRODUCTS.filter((p) => p.group === "grocery");
  const picks = Array.from(new Map(grocery.map((p) => [p.subcategory, p])).values());

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-clay-canvas py-20">
      <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-meat/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 clay-pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-meat">
              <Leaf className="h-3.5 w-3.5" /> Pantry
            </span>
            <AccentHeading
              as="h2"
              text="One row of every aisle"
              accentIndex={3}
              className="mt-4 text-4xl sm:text-5xl"
            />
          </div>
          <Link to="/grocery" className="text-sm font-bold text-meat hover:text-meat-dark">
            Shop all grocery →
          </Link>
        </div>

        <div className="mt-10 flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="clay-meat flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {picks.map((p) => (
              <div key={p.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="clay-meat flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const featured = PRODUCTS.filter((p) =>
    ["beef-ribeye", "beef-tbone", "lamb-chops", "chicken-thigh", "beef-shortrib", "goat-curry", "lamb-leg", "chicken-whole"].includes(p.id),
  );

  return (
    <div>
      {/* HERO — Claymorphism */}
      <section className="relative overflow-hidden bg-clay-canvas">
        {/* floating decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-20 h-96 w-96 rounded-full bg-meat/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            {/* LEFT: copy */}
            <div>
              <div className="inline-flex items-center gap-2 clay-pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-meat">
                <BadgeCheck className="h-4 w-4 text-meat" />
                100% Zabiha Halal · Hand-Slaughtered
              </div>

              <h1 className="mt-7 text-5xl text-balance text-ink sm:text-6xl lg:text-7xl">
                <span className="block">Premium halal,</span>
                <span className="block">
                  <span className="text-meat">cut</span>{" "}
                  <span>to order.</span>
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Family-owned butcher and grocer in Philadelphia. Pasture-raised meats,
                hand-blended spices, and a pantry stocked with the staples your kitchen
                actually uses.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/shop-meat">
                  <button className="clay-btn-meat clay-btn-meat-hover inline-flex h-14 items-center px-8 text-base font-black tracking-wide">
                    <Beef className="mr-2 h-5 w-5" /> Shop Meat
                  </button>
                </Link>
                <Link to="/grocery">
                  <button className="clay-btn-light clay-btn-light-hover inline-flex h-14 items-center px-8 text-base font-black tracking-wide text-ink">
                    Browse Grocery
                  </button>
                </Link>
              </div>

              <div className="mt-12 grid max-w-md grid-cols-3 gap-4">
                {[
                  { n: "30+", l: "Years cutting" },
                  { n: "100%", l: "Zabiha halal" },
                  { n: "4.9★", l: "1.2k reviews" },
                ].map((s) => (
                  <div key={s.l} className="clay-stat p-4 text-center">
                    <div className="text-2xl font-black text-meat">{s.n}</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: floating clay image */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="clay-image-frame animate-clay-float-slow">
                <img
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80"
                  alt="Premium halal meat cuts"
                  className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                />
              </div>

              {/* floating clay badges */}
              <div className="absolute -left-4 top-10 clay-surface flex items-center gap-3 p-4 sm:-left-8">
                <div className="clay-meat flex h-12 w-12 items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Certified</div>
                  <div className="text-sm font-extrabold text-ink">HMS Halal</div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-12 clay-surface flex items-center gap-3 p-4 sm:-right-6">
                <div className="clay-meat flex h-12 w-12 items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ready in</div>
                  <div className="text-sm font-extrabold text-ink">30 min</div>
                </div>
              </div>
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
      <section className="relative overflow-hidden bg-cattle-pattern py-20 lg:py-28">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-meat/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <AboutVideo />
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
        </div>
      </section>

      {/* POLAROID STRIP — Moments from the shop */}
      <section className="relative overflow-hidden bg-clay-canvas py-20">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-meat/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full clay-number px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-meat">
              Snapshots
            </span>
            <AccentHeading
              as="h2"
              text="Moments from the shop"
              accentIndex={2}
              className="mt-5 text-4xl sm:text-5xl"
            />
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {[
              { src: "/gmb-images/pa-butcherand-gorcers1.webp", cap: "Morning cut", rot: -6, mt: 0 },
              { src: "/gmb-images/pa-butcherand-gorcers9.webp", cap: "Fresh in", rot: 4, mt: 24 },
              { src: "/gmb-images/pa-butcherand-gorcers16.webp", cap: "House blend", rot: -3, mt: -12 },
              { src: "/gmb-images/pa-butcherand-gorcers25.webp", cap: "Counter classics", rot: 6, mt: 18 },
              { src: "/gmb-images/pa-butcherand-gorcers33.webp", cap: "Weekend prep", rot: -5, mt: -6 },
            ].map((p) => (
              <div
                key={p.src}
                style={{ transform: `rotate(${p.rot}deg)`, marginTop: p.mt }}
                className="group relative w-40 rounded-lg bg-white p-2.5 pb-9 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:!rotate-0 hover:-translate-y-1 sm:w-48"
              >
                <img
                  src={p.src}
                  alt={p.cap}
                  loading="lazy"
                  className="aspect-square w-full rounded-sm object-cover"
                />
                <span className="absolute inset-x-0 bottom-2 text-center font-[cursive] text-sm text-ink/80">
                  {p.cap}
                </span>
              </div>
            ))}
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

      {/* GROCERY PICKS — One from every aisle */}
      <GroceryPicksRow />

      {/* AD BANNER — Weekly special split */}
      <section className="bg-background pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white shadow-xl">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
              {/* copy */}
              <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-meat/20 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-meat">
                  <Sparkles className="h-3.5 w-3.5" /> This week at the counter
                </span>
                <h2 className="mt-5 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
                  Whole lamb, <span className="text-meat">custom cut</span> — free of charge.
                </h2>
                <p className="mt-5 max-w-md text-white/70">
                  Order a whole or half lamb this week and we'll break it down exactly the way your kitchen needs — chops, mince, curry cut, roast — at no extra cost.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/shop-meat">
                    <Button size="lg" className="bg-meat text-white hover:bg-meat-dark">
                      Reserve your lamb
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <BadgeCheck className="h-5 w-5 text-meat" />
                    Cut fresh, packed clean
                  </div>
                </div>
              </div>

              {/* framed image collage */}
              <div className="relative min-h-[320px] lg:min-h-[520px]">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent lg:from-ink/80 lg:via-transparent" />
                <img
                  src="/gmb-images/pa-butcherand-gorcers5.webp"
                  alt="Butcher preparing lamb"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* floating framed thumbs */}
                <div className="absolute bottom-6 right-6 hidden gap-3 sm:flex">
                  {["/gmb-images/pa-butcherand-gorcers14.webp", "/gmb-images/pa-butcherand-gorcers23.webp"].map((s, i) => (
                    <div
                      key={s}
                      className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/90 shadow-2xl"
                      style={{ transform: `rotate(${i === 0 ? -6 : 5}deg)` }}
                    >
                      <img src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                {/* price tag */}
                <div className="absolute left-6 top-6 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 text-ink shadow-2xl backdrop-blur">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-meat text-white">
                    <Beef className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Save</div>
                    <div className="text-base font-black leading-tight">Up to $40 in cutting fees</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* HOW IT WORKS — Claymorphism */}
      <section className="relative overflow-hidden bg-clay-canvas py-24">
        {/* floating blobs */}
        <div aria-hidden className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-meat/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full clay-number px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-meat">
              How it works
            </span>
            <AccentHeading
              as="h2"
              text="From counter to kitchen"
              accentIndex={3}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl"
            />
            <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
              Four simple, tactile steps. No subscriptions. No waiting around.
              Your order is hand-prepared and ready when you arrive.
            </p>
          </div>

          <ol className="mt-16 grid gap-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Beef, n: "01", t: "Choose your cut", d: "Browse beef, lamb, goat, chicken — or stock the pantry in one go." },
              { i: BadgeCheck, n: "02", t: "Custom prep", d: "Cubed, minced, sliced, bone-in. Tell us exactly how you cook it." },
              { i: Clock, n: "03", t: "Pick a window", d: "Reserve a 30-minute slot. We start prepping right before you arrive." },
              { i: CreditCard, n: "04", t: "Pay & earn", d: "Secure checkout with Stripe. Earn loyalty points on every order." },
            ].map(({ i: Icon, n, t, d }, idx) => (
              <li
                key={n}
                className="group relative clay-surface p-7 pt-12 text-center transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-1deg]"
                style={{ animationDelay: `${idx * 0.4}s` }}
              >
                {/* step number badge */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 clay-number flex h-12 min-w-12 items-center justify-center px-4 text-sm font-black text-ink">
                  {n}
                </span>

                {/* big clay icon */}
                <div className="mx-auto flex h-28 w-28 items-center justify-center clay-meat animate-clay-float group-hover:[animation-play-state:paused]">
                  <Icon className="h-14 w-14 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" strokeWidth={2.25} />
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-ink">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>

                {/* dotted connector to next card */}
                {idx < 3 && (
                  <svg
                    aria-hidden
                    className="hidden lg:block absolute top-24 -right-8 z-10 h-6 w-16 text-meat/40"
                    viewBox="0 0 64 24"
                    fill="none"
                  >
                    <path
                      d="M2 12 H56"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="2 7"
                    />
                    <path
                      d="M50 5 L60 12 L50 19"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-14 flex justify-center">
            <Link to="/shop-meat">
              <Button size="lg" className="h-12 bg-meat px-8 text-base font-bold text-white hover:bg-meat-dark shadow-lg shadow-meat/30">
                Start your order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* MASONRY GALLERY — Straight from our counter */}
      <section className="relative overflow-hidden bg-background py-24">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-meat/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-meat">Straight from our counter</span>
              <AccentHeading
                as="h2"
                text="A peek inside the shop"
                accentIndex={2}
                className="mt-3 text-4xl sm:text-5xl"
              />
              <p className="mt-4 text-muted-foreground">
                Real cuts, real people, real Zabiha. Every photo is from our own counter — no stock, no filters.
              </p>
            </div>
            <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-meat" /> Updated weekly
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {[
              { src: "/gmb-images/pa-butcherand-gorcers3.webp", cls: "row-span-2 aspect-[3/5]", tag: "Beef" },
              { src: "/gmb-images/pa-butcherand-gorcers12.webp", cls: "aspect-square", tag: "Lamb" },
              { src: "/gmb-images/pa-butcherand-gorcers21.webp", cls: "aspect-square", tag: "Prep" },
              { src: "/gmb-images/pa-butcherand-gorcers7.webp", cls: "row-span-2 aspect-[3/5]", tag: "BBQ" },
              { src: "/gmb-images/pa-butcherand-gorcers18.webp", cls: "aspect-square", tag: "Fresh" },
              { src: "/gmb-images/pa-butcherand-gorcers29.webp", cls: "aspect-square", tag: "Counter" },
            ].map((im) => (
              <div key={im.src} className={`group relative overflow-hidden rounded-3xl border border-border bg-muted shadow-sm ${im.cls}`}>
                <img src={im.src} alt={im.tag} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-ink shadow-sm">
                  {im.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden bg-clay-canvas py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-meat/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 clay-pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-meat">
              <Star className="h-3.5 w-3.5 fill-meat text-meat" />
              Loved by Brisbane
            </span>
            <AccentHeading
              as="h2"
              text="What our customers say"
              accentIndex={3}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl"
            />

            {/* rating summary */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 clay-surface px-8 py-5">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-meat text-meat" />
                  ))}
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rated by 500+ happy customers
                </p>
              </div>
              <div className="hidden h-10 w-px bg-border sm:block" />
              <div className="text-left">
                <p className="text-3xl font-black text-ink">4.9<span className="text-lg text-muted-foreground">/5</span></p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Average rating
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Freshest lamb chops in Brisbane, hands down. The team even trimmed and frenched them exactly how I asked. Weekly stop for our family now.",
                name: "Aisha K.",
                role: "Verified customer",
                initials: "AK",
                stars: 5,
              },
              {
                quote:
                  "I order Shan Nihari and their beef every Friday. Meat is always fresh, prices are fair, and the guys behind the counter are so welcoming.",
                name: "Yusuf M.",
                role: "Verified customer",
                initials: "YM",
                stars: 5,
              },
              {
                quote:
                  "One-stop shop — halal chicken, biryani masala, basmati, ghee. Pickup was ready exactly on time. Cannot recommend PA Halal enough.",
                name: "Fatima R.",
                role: "Verified customer",
                initials: "FR",
                stars: 5,
              },
              {
                quote:
                  "The tandoori marinade with their chicken thighs = restaurant-quality kebabs at home. Kids devour them. Zabiha certified is a huge plus.",
                name: "Omar S.",
                role: "Verified customer",
                initials: "OS",
                stars: 5,
              },
              {
                quote:
                  "Ordered a whole goat curry cut for Eid — perfectly portioned, delivered on the pickup slot. Professional and truly halal. Thank you PA Halal!",
                name: "Sana H.",
                role: "Verified customer",
                initials: "SH",
                stars: 5,
              },
              {
                quote:
                  "Best butcher we've found since moving to Woolloongabba. Ground beef is genuinely lean, and the Shan masala range is fully stocked.",
                name: "Bilal A.",
                role: "Verified customer",
                initials: "BA",
                stars: 4,
              },
            ].map((t, i) => (
              <article
                key={i}
                className="group relative clay-surface flex flex-col p-7 transition-transform duration-500 hover:-translate-y-1"
              >
                <Quote
                  aria-hidden
                  className="absolute right-5 top-5 h-10 w-10 text-meat/15"
                  strokeWidth={2.5}
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s < t.stars ? "fill-meat text-meat" : "text-ink/15"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/85">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                  <div className="grid h-11 w-11 place-items-center rounded-full clay-meat text-sm font-black text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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

      {/* VISIT US — Map */}
      <section className="relative overflow-hidden bg-clay-canvas py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-meat/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full clay-number px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-meat">
              Visit us
            </span>
            <AccentHeading
              as="h2"
              text="Find us on the map"
              accentIndex={3}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl"
            />
            <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
              Swing by the shop for same-day pickup, custom cuts, or a chat with our butchers.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">
            {/* Store details card */}
            <div className="clay-surface flex flex-col justify-center p-8 sm:p-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center clay-meat">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-ink">PA Halal Butcher & Grocer</h3>
                  <p className="text-sm text-muted-foreground">Shop 6, 429 Logan Road, Greenslopes QLD 4120</p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-meat" />
                  <div>
                    <p className="font-semibold text-ink">Open today</p>
                    <p className="text-sm text-muted-foreground">8:00 AM – 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-meat" />
                  <div>
                    <p className="font-semibold text-ink">Call ahead</p>
                    <p className="text-sm text-muted-foreground">(07) 3397 1234</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://www.google.com/maps/dir//PA+Halal+Butcher+%26+Grocer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full bg-meat text-white hover:bg-meat-dark sm:w-auto">
                    Get directions
                  </Button>
                </a>
              </div>
            </div>

            {/* Map embed */}
            <div className="clay-image-frame min-h-[360px] overflow-hidden sm:min-h-[420px] lg:min-h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.0240948924547!2d153.0357803!3d-27.4996261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b915a67a4a6fd1b%3A0xdf7bd22deea2032a!2sPA%20Halal%20Butcher%20%26%20Grocer!5e0!3m2!1sen!2s!4v1784191899320!5m2!1sen!2s"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="PA Halal Butcher & Grocer location"
                className="block h-full min-h-[360px] w-full rounded-3xl sm:min-h-[420px] lg:min-h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
