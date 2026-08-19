import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "purple";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-blue-500/10 text-blue-400 border-blue-500/15",
    secondary: "bg-white/5 text-muted-foreground border-white/5",
    outline: "bg-transparent text-white border-white/10",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/15",
    danger: "bg-red-500/10 text-red-400 border-red-500/15",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/15",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
