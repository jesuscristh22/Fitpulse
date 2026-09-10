import { cn } from "@/lib/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-12 w-full rounded-md border border-white/10 bg-carbon px-4 text-sm text-white outline-none focus:border-gold",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
