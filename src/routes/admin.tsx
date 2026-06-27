import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Beef, LayoutDashboard, Package, ShoppingBag, Users, LogOut, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop, ADMIN_EMAIL, ADMIN_PASSWORD, type AdminProduct } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — PA Halal" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const adminAuthed = useShop((s) => s.adminAuthed);
  const hydrated = useShop((s) => s.hydrated);
  const adminProducts = useShop((s) => s.adminProducts);
  const addProduct = useShop((s) => s.addProduct);

  // Seed admin product catalog from static PRODUCTS on first login
  useEffect(() => {
    if (adminAuthed && adminProducts.length === 0) {
      PRODUCTS.forEach((p) => {
        const ap: AdminProduct = {
          id: p.id,
          name: p.name,
          category: p.category,
          group: p.group,
          subcategory: p.subcategory,
          price: p.price,
          unit: p.unit,
          image: p.image,
          description: p.description,
          stock: 25,
        };
        addProduct(ap);
      });
    }
  }, [adminAuthed, adminProducts.length, addProduct]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!adminAuthed) return <AdminLogin />;

  return <AdminShell />;
}

function AdminLogin() {
  const navigate = useNavigate();
  const adminSignIn = useShop((s) => s.adminSignIn);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const ok = adminSignIn(email, password);
    setLoading(false);
    if (ok) {
      toast.success("Welcome back, owner");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-clay-canvas">
      {/* Floating clay blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-meat/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
        {/* Logo badge */}
        <div className="clay-meat animate-clay-float mb-8 grid h-20 w-20 place-items-center rounded-3xl">
          <Shield className="h-10 w-10 text-white" />
        </div>

        <div className="clay-surface w-full rounded-[2rem] p-8 sm:p-10">
          <div className="mb-6 text-center">
            <span className="clay-pill inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-meat-dark">
              <Lock className="h-3 w-3" /> Owner access only
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Admin <span className="text-meat">Sign in</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage orders, products, and your storefront.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-0 bg-white pl-10 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus-visible:ring-meat"
                  placeholder="admin@pahalal.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl border-0 bg-white pl-10 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus-visible:ring-meat"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-btn-meat w-full rounded-2xl py-4 text-base font-bold text-white disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Enter dashboard"}
            </button>

            <div className="rounded-2xl bg-white/60 p-3 text-center text-xs text-muted-foreground shadow-[inset_1px_1px_3px_rgba(0,0,0,0.04)]">
              Demo credentials: <span className="font-mono font-semibold text-ink">admin@pahalal.com</span> /{" "}
              <span className="font-mono font-semibold text-ink">admin123</span>
            </div>
          </form>
        </div>

        <Link
          to="/"
          className="mt-6 text-sm font-semibold text-muted-foreground hover:text-meat"
        >
          ← Back to store
        </Link>
      </div>
    </div>
  );
}

function AdminShell() {
  const navigate = useNavigate();
  const adminSignOut = useShop((s) => s.adminSignOut);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/customers", label: "Customers", icon: Users },
  ] as const;

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-meat">
            <Beef className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-black leading-tight text-ink">PA Halal</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-meat">
              Admin
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-meat text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <button
            onClick={() => {
              adminSignOut();
              toast.success("Signed out");
              navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-meat">
              <Beef className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-ink">PA Admin</span>
          </div>
          <button
            onClick={() => {
              adminSignOut();
              navigate({ to: "/" });
            }}
            className="text-sm font-semibold text-meat"
          >
            Sign out
          </button>
        </header>

        {/* Mobile nav scroller */}
        <nav className="flex overflow-x-auto border-b border-border bg-white px-2 md:hidden">
          {nav.map((n) => {
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${
                  active ? "border-meat text-meat" : "border-transparent text-slate-600"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
