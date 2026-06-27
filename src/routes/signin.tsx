import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AccentHeading } from "@/components/AccentHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop } from "@/lib/store";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — PA Halal" }] }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const signIn = useShop((s) => s.signIn);
  const [email, setEmail] = useState("");

  return (
    <AuthShell
      title="Welcome back"
      accentIndex={1}
      subtitle="Sign in to track orders and use your loyalty points."
      footer={<>New here? <Link to="/signup" className="font-bold text-meat hover:text-meat-dark">Create an account</Link></>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          signIn(email);
          toast.success("Signed in");
          navigate({ to: "/" });
        }}
        className="space-y-4"
      >
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-2 focus-visible:ring-meat" />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input type="password" placeholder="••••••••" className="mt-2 focus-visible:ring-meat" />
        </div>
        <Button type="submit" className="w-full bg-meat py-6 font-bold text-white hover:bg-meat-dark">Sign in</Button>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title, subtitle, accentIndex, children, footer,
}: {
  title: string; subtitle: string; accentIndex?: number; children: React.ReactNode; footer: React.ReactNode;
}) {
  return (
    <div className="relative bg-clay-canvas">
      <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-meat/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="hidden flex-col justify-between p-10 lg:flex clay-surface animate-clay-float-slow">
          <div>
            <span className="grid h-14 w-14 place-items-center clay-meat font-black text-lg text-white">PA</span>
            <h3 className="mt-8 text-3xl font-black leading-tight text-ink">
              Free <span className="text-meat">50 points</span><br /> just for joining.
            </h3>
            <p className="mt-3 text-muted-foreground">Plus 1 point for every $1 you spend. Redeem on any order.</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="clay-stat p-4">
                <div className="text-2xl font-black text-meat">50</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Signup bonus</div>
              </div>
              <div className="clay-stat p-4">
                <div className="text-2xl font-black text-meat">1996</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trusted since</div>
              </div>
            </div>
          </div>

          <ul className="mt-10 space-y-3 text-sm font-medium text-ink">
            {["100% Zabiha halal", "Custom cut at no extra cost", "Same-day pickup", "Trusted since 1996"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center clay-meat">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="clay-surface p-8 sm:p-10">
          <span className="clay-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-meat">
            <Sparkles className="h-3.5 w-3.5" /> PA Halal Rewards
          </span>
          <AccentHeading as="h1" text={title} accentIndex={accentIndex} className="mt-5 text-4xl sm:text-5xl" />
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
