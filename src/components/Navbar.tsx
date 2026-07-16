import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, ShoppingBag, Menu, X, Sparkles, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useShop, cartCount } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const logoUrl = "/pa-logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop-meat", label: "Meat Shop" },
  { to: "/grocery", label: "Grocery" },
  { to: "/wishlist", label: "Wishlist" },
];

export function Navbar() {
  const cart = useShop((s) => s.cart);
  const user = useShop((s) => s.user);
  const wishlist = useShop((s) => s.wishlist);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const count = cartCount(cart);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logoUrl} alt="PA Halal Butcher & Grocer" className="h-10 w-10 rounded-full object-cover shadow-sm" />
          <span className="hidden text-sm font-bold leading-tight sm:flex sm:flex-col">
            <span className="text-ink">PA Halal</span>
            <span className="text-meat -mt-0.5">Butcher & Grocer</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "text-meat" : "text-ink/80 hover:text-meat",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden items-center gap-1.5 rounded-full border border-meat/30 bg-accent px-3 py-1.5 text-xs font-bold text-meat-dark sm:flex">
              <Sparkles className="h-3.5 w-3.5" />
              {user.points} pts
            </div>
          )}

          <Link to="/wishlist" className="relative hidden rounded-md p-2 text-ink hover:bg-muted sm:inline-flex">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-meat text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/checkout" className="relative rounded-md p-2 text-ink hover:bg-muted">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-meat px-1 text-[10px] font-bold text-white">
                {Math.ceil(count)}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              to="/checkout"
              className="hidden items-center gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-sm font-semibold text-ink hover:border-meat sm:inline-flex"
            >
              <UserIcon className="h-4 w-4" />
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link to="/signin" className="hidden sm:block">
              <Button variant="default" className="bg-meat text-white hover:bg-meat-dark">
                Sign in
              </Button>
            </Link>
          )}

          <button className="rounded-md p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            {!user && (
              <Link to="/signin" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-meat px-3 py-2.5 text-center text-sm font-semibold text-white">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
