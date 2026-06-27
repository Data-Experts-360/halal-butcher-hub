import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AccentHeading } from "@/components/AccentHeading";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Beef, Search } from "lucide-react";

export const Route = createFileRoute("/shop-meat")({
  head: () => ({
    meta: [
      { title: "Meat Shop — PA Halal Butcher & Grocer" },
      { name: "description", content: "Beef, lamb, goat, and chicken — custom cut to order. 100% halal." },
      { property: "og:title", content: "Meat Shop — PA Halal Butcher" },
      { property: "og:description", content: "Steaks, roasts, diced, BBQ specials. Filter by type, weight, prep." },
    ],
  }),
  component: ShopMeat,
});

const TYPES = ["all", "beef", "lamb", "goat", "chicken"] as const;
const SUBS = ["all", "Steaks", "Roasts", "Diced", "BBQ Specials"];

function ShopMeat() {
  const meats = useMemo(() => PRODUCTS.filter((p) => p.group === "meat"), []);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [sub, setSub] = useState<string>("all");
  const [prep, setPrep] = useState<string>("all");

  const allPreps = Array.from(new Set(meats.flatMap((m) => m.preparations ?? [])));

  const filtered = meats.filter((m) => {
    if (q && !`${m.name} ${m.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== "all" && m.category !== type) return false;
    if (sub !== "all" && m.subcategory !== sub) return false;
    if (prep !== "all" && !(m.preparations ?? []).includes(prep)) return false;
    return true;
  });

  return (
    <div>
      <section className="relative border-b border-border bg-ink text-white">
        <div className="absolute inset-0 bg-meat-grain opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Beef className="h-3.5 w-3.5 text-meat" /> The Meat Counter
          </div>
          <AccentHeading
            as="h1"
            text="Cuts, custom prepped"
            accentIndex={1}
            className="mt-4 max-w-3xl text-5xl sm:text-6xl text-white [&_span:not(.text-meat)]:text-white"
          />
          <p className="mt-4 max-w-xl text-white/70">
            Every animal is whole-butchered in-house. Choose your weight and how you
            want it prepped — we'll have it ready at pickup.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cuts…"
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t === "all" ? "All meat" : t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sub} onValueChange={setSub}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUBS.map((t) => <SelectItem key={t} value={t}>{t === "all" ? "All cuts" : t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={prep} onValueChange={setPrep}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any prep</SelectItem>
              {allPreps.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted-foreground">
          Showing <span className="font-bold text-ink">{filtered.length}</span> {filtered.length === 1 ? "cut" : "cuts"}
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No cuts match those filters.
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
