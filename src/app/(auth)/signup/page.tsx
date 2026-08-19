"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlanForge } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";

function SignUpPageContent() {
  const { signup } = usePlanForge();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite_code");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    try {
      await signup(fullName, email, password);
      if (inviteCode) {
        router.push(`/accept-invitation?code=${inviteCode}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("email not confirmed")) {
        setErrorMsg("Confirmation link sent! Please check your email inbox to confirm your address before logging in.");
      } else {
        setErrorMsg(err.message || "Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
              PF
            </div>
            <span className="font-bold text-xl tracking-tight">PlanForge</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h2>
          <p className="text-xs text-muted-foreground">Start organizing your hackathon and team goals</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-400 font-semibold">
              Signup failed: {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sushanth"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@team.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full h-10 gap-2 font-semibold" isLoading={isLoading}>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href={inviteCode ? `/login?invite_code=${inviteCode}` : "/login"} className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-foreground">Loading signup...</p>
        </div>
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  );
}
