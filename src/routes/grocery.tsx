import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AccentHeading } from "@/components/AccentHeading";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { Search, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/grocery")({
  head: () => ({
    meta: [
      { title: "Grocery & Pantry — PA Halal Butcher & Grocer" },
      { name: "description", content: "Spices, rice, lentils, halal marinades, sauces, and dairy." },
      { property: "og:title", content: "Grocery — PA Halal" },
      { property: "og:description", content: "Pantry staples and halal essentials, in one place." },
    ],
  }),
  component: Grocery,
});

function Grocery() {
  const items = useMemo(() => PRODUCTS.filter((p) => p.group === "grocery"), []);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const cats = ["all", ...Array.from(new Set(items.map((i) => i.subcategory)))];
  const filtered = items.filter(
    (i) =>
      (cat === "all" || i.subcategory === cat) &&
      (!q || `${i.name} ${i.description}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <section className="relative border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-meat/30 bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-meat-dark">
            <Leaf className="h-3.5 w-3.5" /> Pantry
          </div>
          <AccentHeading
            as="h1"
            text="Spices, staples, essentials"
            accentIndex={2}
            className="mt-4 max-w-3xl text-5xl sm:text-6xl"
          />
          <p className="mt-4 max-w-xl text-muted-foreground">
            Aged basmati, hand-blended masalas, marinades that actually marinate,
            and dairy from local farms.
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pantry…" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={cat === c ? "default" : "outline"}
                onClick={() => setCat(c)}
                className={cat === c ? "bg-meat text-white hover:bg-meat-dark" : ""}
              >
                {c === "all" ? "All" : c}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No items match.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
