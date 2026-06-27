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
    <div className="bg-clay-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="hidden flex-col justify-between rounded-3xl bg-ink p-10 text-white lg:flex bg-meat-grain">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-meat font-black text-lg">PA</span>
            <h3 className="mt-8 text-3xl font-black leading-tight">
              Free <span className="text-meat">50 points</span><br /> just for joining.
            </h3>
            <p className="mt-3 text-white/70">Plus 1 point for every $1 you spend. Redeem on any order.</p>
          </div>
          <ul className="space-y-3 text-sm">
            {["100% Zabiha halal", "Custom cut at no extra cost", "Same-day pickup", "Trusted since 1996"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-meat" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -top-10 -right-6 h-40 w-40 rounded-full bg-meat/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="clay-surface relative p-8 sm:p-10 animate-clay-float-slow">
            <span className="clay-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-meat-dark">
              <Sparkles className="h-3.5 w-3.5 text-meat" /> PA Halal Rewards
            </span>
            <div className="mt-5">
              <AccentHeading as="h1" text={title} accentIndex={accentIndex} className="text-4xl sm:text-5xl" />
            </div>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
