import { createFileRoute, Link } from "@tanstack/react-router";
import { AccentHeading } from "@/components/AccentHeading";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — PA Halal" }] }),
  component: Wishlist,
});

function Wishlist() {
  const ids = useShop((s) => s.wishlist);
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AccentHeading as="h1" text="Your saved favorites" accentIndex={2} className="text-4xl sm:text-5xl" />
      <p className="mt-3 text-muted-foreground">Tap the heart on any product to save it for later.</p>

      {items.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border p-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-meat" />
          <p className="mt-4 font-semibold text-ink">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Browse the shop and tap the heart on items you love.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/shop-meat"><Button className="bg-meat text-white hover:bg-meat-dark">Shop Meat</Button></Link>
            <Link to="/grocery"><Button variant="outline">Browse Grocery</Button></Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
