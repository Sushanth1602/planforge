"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h2>
          <p className="text-xs text-muted-foreground">Enter your email and we will send a password reset link</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-foreground">Reset Link Sent</h3>
              <p className="text-xs text-muted-foreground">
                We sent a password reset instruction to <span className="font-semibold text-foreground">{email}</span>.
              </p>
              <Link href="/login" className="inline-block pt-2">
                <Button variant="outline" size="sm">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@team.com"
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full h-10 font-semibold">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
