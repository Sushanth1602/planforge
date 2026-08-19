"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Ambient Background Glows
 */
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#05070C]">
      {/* Cinematic Navy Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#05070C] via-[#070A12] to-[#0C111D]" />
      
      {/* Blurred Primary Ambient Lights - Extremely Subtle */}
      {/* Top Left: Muted Violet Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-900/[0.03] blur-[180px]" />
      
      {/* Center: Electric Blue Ambient light */}
      <div className="absolute top-[30%] left-[25%] w-[50%] h-[50%] rounded-full bg-blue-900/[0.02] blur-[220px]" />
      
      {/* Bottom Right: Muted Amber Glow */}
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-amber-900/[0.02] blur-[180px]" />
    </div>
  );
}

/**
 * Cinematic Shell: Wraps a page/content with custom animations and ambient layers
 */
export function CinematicShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative min-h-screen text-foreground select-none", className)}>
      <AmbientBackground />
      <div className="relative z-10 w-full animate-cinematic-in delay-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Glass Panel: Premium Content Surface (Opaque glass)
 */
export function GlassPanel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 border border-white/[0.07] bg-[#0C111D]/94 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-[#0E1524]/96",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Glass Card: Secondary Content Card (Opaque glass card)
 */
export function GlassCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 sm:p-5 border border-white/[0.06] bg-[#101624]/88 backdrop-blur-md shadow-md transition-all duration-300 hover:bg-[#121A2A]/92 hover:border-white/[0.09]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Glass Button: High-performance glass button
 */
export function GlassButton({
  children,
  className,
  variant = "secondary",
  size = "md",
  disabled,
  isLoading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 border border-blue-400/20 active:scale-[0.98] hover:translate-y-[-1px]",
    secondary: "liquid-glass text-foreground hover:bg-white/5 border border-white/10 active:scale-[0.98] hover:translate-y-[-1px]",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 active:scale-[0.98] hover:translate-y-[-1px]",
    danger: "bg-red-950/30 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-500/20 active:scale-[0.98] hover:translate-y-[-1px]",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9.5 px-4 text-sm gap-2",
    lg: "h-11 px-6 text-base gap-2.5",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

/**
 * Glass Input: Sleek input control with subtle focus border glows
 */
export function GlassInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9.5 w-full rounded-lg border border-white/8 bg-white/[0.02] px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 focus:bg-white/[0.04] disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

/**
 * Glass Textarea
 */
export function GlassTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-white/8 bg-white/[0.02] px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 focus:bg-white/[0.04] disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

/**
 * Cinematic Page Header: Editorial headings with tight letter spacing
 */
export function CinematicPageHeader({
  title,
  subheading,
  children,
  className,
}: {
  title: string;
  subheading?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-white/5 mb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white leading-tight">
          {title}
        </h1>
        {subheading && (
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {subheading}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}

/**
 * Cinematic Section: Container with delayed animations
 */
export function CinematicSection({
  children,
  className,
  delayIndex = 1,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delayIndex?: number }) {
  const delayClass = 
    delayIndex === 1 ? "delay-80" :
    delayIndex === 2 ? "delay-160" :
    delayIndex === 3 ? "delay-240" :
    delayIndex === 4 ? "delay-320" :
    delayIndex === 5 ? "delay-400" : "delay-500";

  return (
    <div
      className={cn("animate-cinematic-in", delayClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Status Badge: Restrained lighting priorities
 */
export function StatusBadge({
  value,
  variant = "status",
}: {
  value: string;
  variant?: "status" | "priority";
}) {
  const norm = value.toLowerCase();
  
  let label = value;
  let bg = "bg-white/5 text-muted-foreground border-white/5";
  
  if (norm === "low") {
    bg = "bg-slate-500/10 text-slate-400 border-slate-500/15";
    label = "Low";
  } else if (norm === "medium") {
    bg = "bg-blue-500/10 text-blue-400 border-blue-500/15";
    label = "Medium";
  } else if (norm === "high") {
    bg = "bg-amber-500/10 text-amber-400 border-amber-500/15";
    label = "High";
  } else if (norm === "urgent") {
    bg = "bg-red-500/10 text-red-400 border-red-500/15";
    label = "Urgent";
  } else if (norm === "todo") {
    bg = "bg-amber-500/5 text-amber-400 border-amber-500/10";
    label = "To Do";
  } else if (norm === "in_progress") {
    bg = "bg-blue-500/5 text-blue-400 border-blue-500/10";
    label = "In Progress";
  } else if (norm === "review") {
    bg = "bg-purple-500/5 text-purple-400 border-purple-500/10";
    label = "Review";
  } else if (norm === "done") {
    bg = "bg-emerald-500/5 text-emerald-400 border-emerald-500/10";
    label = "Done";
  } else if (norm === "backlog") {
    bg = "bg-slate-500/5 text-slate-400 border-slate-500/10";
    label = "Backlog";
  }

  return (
    <span className={cn("text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full border", bg)}>
      {label}
    </span>
  );
}

/**
 * Progress Bar: Micro thin indicators
 */
export function ProgressBar({ value = 0, className }: { value?: number; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("relative h-1 w-full overflow-hidden rounded-full bg-white/[0.04]", className)}>
      <div
        className="h-full bg-blue-500 transition-all duration-500 rounded-full"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/**
 * Timeline
 */
export function Timeline({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative pl-4 border-l border-white/5 space-y-4", className)}>
      {children}
    </div>
  );
}
