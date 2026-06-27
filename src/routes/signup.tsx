import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "./signin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — PA Halal" }] }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const signUp = useShop((s) => s.signUp);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <AuthShell
      title="Join PA Halal Rewards"
      accentIndex={2}
      subtitle="Create your account and get 50 loyalty points instantly."
      footer={<>Already a member? <Link to="/signin" className="font-bold text-meat hover:text-meat-dark">Sign in</Link></>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name || !email) return;
          signUp(name, email);
          toast.success("Welcome! +50 loyalty points added");
          navigate({ to: "/" });
        }}
        className="space-y-4"
      >
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full name</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Aisha Khan" className="mt-2 focus-visible:ring-meat" />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-2 focus-visible:ring-meat" />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input type="password" required placeholder="••••••••" className="mt-2 focus-visible:ring-meat" />
        </div>
        <div className="rounded-xl border border-meat/30 bg-accent p-3 text-sm text-meat-dark font-semibold">
          ✦ 50 loyalty points added on signup
        </div>
        <Button type="submit" className="w-full bg-meat py-6 font-bold text-white hover:bg-meat-dark">Create account</Button>
      </form>
    </AuthShell>
  );
}
