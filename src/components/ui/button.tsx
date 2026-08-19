import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none rounded-lg";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 border border-blue-400/20 active:scale-[0.98] hover:translate-y-[-1px]",
      secondary: "liquid-glass text-white border border-white/10 active:scale-[0.98] hover:translate-y-[-1px]",
      outline: "border border-white/8 bg-transparent text-white hover:bg-white/5 active:scale-[0.98] hover:translate-y-[-1px]",
      ghost: "bg-transparent text-muted-foreground hover:text-white hover:bg-white/5 active:scale-[0.98] hover:translate-y-[-1px]",
      danger: "bg-red-950/30 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-500/20 active:scale-[0.98] hover:translate-y-[-1px]",
      link: "text-blue-400 underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
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
);
Button.displayName = "Button";
