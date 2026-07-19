import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useShop((s) => s.addToCart);
  const wishlist = useShop((s) => s.wishlist);
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const liked = wishlist.includes(product.id);

  const [weight, setWeight] = useState<string>(
    product.weights ? String(product.weights[0]) : "1",
  );
  const [prep, setPrep] = useState<string>(product.preparations?.[0] ?? "");

  const isMeat = product.group === "meat";

  const handleAdd = () => {
    const qty = isMeat ? Number(weight) : 1;
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      unit: product.unit,
      quantity: qty,
      preparation: isMeat ? prep : undefined,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-meat/40 hover:shadow-xl hover:shadow-meat/5">

      <div className={cn("relative aspect-[4/3] overflow-hidden bg-muted", !isMeat && "bg-white p-4")}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn(
            "h-full w-full transition-transform duration-500 group-hover:scale-105",
            isMeat ? "object-cover" : "object-contain",
          )}
        />
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Wishlist"
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur transition-colors",
            liked ? "text-meat" : "text-ink/60 hover:text-meat",
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-meat")} />
        </button>
        <div className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {product.subcategory}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-xl font-black text-meat">${product.price.toFixed(2)}</span>
          <span className="text-xs font-medium text-muted-foreground">/ {product.unit}</span>
        </div>

        {isMeat && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                {product.weights!.map((w) => (
                  <SelectItem key={w} value={String(w)}>{w} lb</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={prep} onValueChange={setPrep}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Prep" />
              </SelectTrigger>
              <SelectContent>
                {product.preparations!.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={handleAdd}
          className="mt-auto w-full bg-meat text-white hover:bg-meat-dark"
        >

          <Plus className="mr-1 h-4 w-4" /> Add to cart
        </Button>
      </div>
    </div>
  );
}
