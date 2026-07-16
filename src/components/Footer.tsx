import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/pa-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="PA Halal" className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10" />
            <span className="flex flex-col text-sm font-bold leading-tight">
              <span>PA Halal</span>
              <span className="text-meat -mt-0.5">Butcher & Grocer</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-white/70">
            100% Zabiha halal. Family owned. Cut fresh, packed clean, ready when you are.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-meat">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/shop-meat" className="hover:text-meat">Meat Shop</Link></li>
            <li><Link to="/grocery" className="hover:text-meat">Grocery</Link></li>
            <li><Link to="/wishlist" className="hover:text-meat">Wishlist</Link></li>
            <li><Link to="/checkout" className="hover:text-meat">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-meat">Visit</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>2410 Market St, Philadelphia, PA</li>
            <li>Mon–Sat · 8am – 8pm</li>
            <li>Sun · 9am – 6pm</li>
            <li>(215) 555-0142</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-meat">Loyalty</h4>
          <p className="mt-4 text-sm text-white/80">
            Sign up and get <span className="font-bold text-white">50 points free</span>. Earn 1 point per $1 spent.
          </p>
          <Link
            to="/signup"
            className="mt-4 inline-flex rounded-md bg-meat px-4 py-2 text-sm font-semibold text-white hover:bg-meat-dark"
          >
            Join now
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} PA Halal Butcher & Grocer. All rights reserved.
      </div>
    </footer>
  );
}
