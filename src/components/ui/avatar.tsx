import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Avatar({ src, name = "User", size = "md", className, ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
    xl: "h-14 w-14 text-lg",
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full font-semibold border border-border bg-secondary select-none",
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-muted-foreground">{getInitials(name)}</span>
      )}
    </div>
  );
}

export function Progress({ value = 0, className, barClassName }: { value?: number; className?: string; barClassName?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full bg-primary transition-all duration-300 rounded-full", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
