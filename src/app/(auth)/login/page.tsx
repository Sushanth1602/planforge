"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlanForge } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = usePlanForge();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("email not confirmed")) {
        setErrorMsg("Email not confirmed. Please check your inbox and click the confirmation link before logging in.");
      } else {
        setErrorMsg(err.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
              PF
            </div>
            <span className="font-bold text-xl tracking-tight">PlanForge</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="text-xs text-muted-foreground">Sign in to your collaborative workspace</p>
        </div>

        {/* Login Form Card */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-400 font-semibold">
              Login failed: {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@team.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 gap-2 font-semibold" isLoading={isLoading}>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
