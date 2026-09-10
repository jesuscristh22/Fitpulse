"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const iconColor = { success: "text-emerald-400", error: "text-red-400", info: "text-gold" };

export function Toast({ variant = "info", message }: { variant?: ToastVariant; message: string }) {
  const Icon = icons[variant];
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-graphite px-4 py-3 shadow-lg">
      <Icon size={18} className={iconColor[variant]} />
      <p className="text-sm text-white">{message}</p>
    </div>
  );
}
