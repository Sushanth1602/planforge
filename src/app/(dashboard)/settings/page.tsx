"use client";

import React, { useState } from "react";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Database, Save, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
  const { currentUser, setCurrentUser, allUsers } = usePlanForge();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      full_name: fullName,
      email,
      avatar_url: avatarUrl || undefined,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };


  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-primary" /> Profile & Platform Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your personal account profile and configure database connections.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-xl bg-card border border-border space-y-5 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <Avatar src={avatarUrl || currentUser.avatar_url} name={fullName || currentUser.full_name} size="lg" />
          <div>
            <h3 className="text-base font-bold text-foreground">{currentUser.full_name}</h3>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Member since {formatDate(currentUser.created_at)}
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Avatar Image URL</label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <Button type="submit" size="sm" className="gap-1.5">
            <Save className="h-4 w-4" />
            <span>{isSaved ? "Saved Profile!" : "Save Profile"}</span>
          </Button>
        </div>
      </form>

      {/* Database Connection Status & Reset */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-foreground">Supabase Database Integration</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The application includes the full Supabase PostgreSQL schema with RLS in <code className="bg-secondary px-1.5 py-0.5 rounded text-primary font-mono text-[11px]">supabase/schema.sql</code>. All data is backed by an automated local reactive cache and sync engine.
        </p>
      </div>
    </div>
  );
}
