"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";

// Mobile-first bottom sheet by default; becomes a right-side drawer on larger screens.
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70">
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-white/10 bg-graphite p-6",
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:w-96 sm:rounded-t-none sm:rounded-l-2xl sm:border-l sm:border-t-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-silver hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
