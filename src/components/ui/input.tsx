import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9.5 w-full rounded-lg border border-white/8 bg-white/[0.035] px-3 py-1 text-sm text-white placeholder:text-muted-foreground transition-all duration-300 focus-visible:outline-none focus-visible:border-blue-500/50 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-white/8 bg-white/[0.035] px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground transition-all duration-300 focus-visible:outline-none focus-visible:border-blue-500/50 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
