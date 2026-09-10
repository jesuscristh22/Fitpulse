import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-md border border-white/10 bg-carbon px-4 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
