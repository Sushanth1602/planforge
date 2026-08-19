"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { usePlanForge } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { fetchSupabaseData } = usePlanForge();

  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Verifying invitation details...");
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    if (!code) {
      setIsLoading(false);
      setStatusMsg("Invalid invitation code: No code provided in URL.");
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function processAcceptance() {
      try {
        setStatusMsg("Accepting invitation and joining workspace...");
        const { data: wsId, error } = await (supabase as any).rpc("accept_invitation", {
          invite_id: code,
        });

        if (error) {
          setErrorDetails(error);
          setStatusMsg("Failed to accept invitation.");
          setIsLoading(false);
          return;
        }

        setStatusMsg("Successfully joined workspace! Redirecting...");
        await fetchSupabaseData();
        router.push(`/workspaces/${wsId}`);
      } catch (err: any) {
        setErrorDetails({ message: err.message || String(err) });
        setStatusMsg("Failed to accept invitation.");
        setIsLoading(false);
      }
    }

    processAcceptance();
  }, [isAuthenticated, code, fetchSupabaseData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-foreground">{statusMsg}</p>
        </div>
      </div>
    );
  }

  if (errorDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 text-red-500 pb-2 border-b border-border">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-base font-bold">Invitation Error</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We could not complete your workspace invitation. Please review the details below:
          </p>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/80 space-y-2 text-xs font-mono">
            <div><span className="font-semibold text-foreground">Message:</span> {errorDetails.message}</div>
            {errorDetails.code && <div><span className="font-semibold text-foreground">Code:</span> {errorDetails.code}</div>}
            {errorDetails.details && <div><span className="font-semibold text-foreground">Details:</span> {errorDetails.details}</div>}
            {errorDetails.hint && <div><span className="font-semibold text-foreground">Hint:</span> {errorDetails.hint}</div>}
          </div>
          <div className="pt-2 flex justify-end">
            <Link href="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6 text-center">
          <div className="space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Workspace Invitation</h2>
            <p className="text-xs text-muted-foreground leading-relaxed px-2">
              You have been invited to collaborate in a PlanForge workspace. Please sign in or create a new account to join.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href={`/login?invite_code=${code}`}>
              <Button className="w-full h-10 gap-2 font-semibold" variant="outline">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link href={`/signup?invite_code=${code}`}>
              <Button className="w-full h-10 gap-2 font-semibold">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center space-y-4 max-w-md">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
        <p className="text-sm font-semibold text-foreground">{statusMsg}</p>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-foreground">Loading invitation context...</p>
        </div>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}
