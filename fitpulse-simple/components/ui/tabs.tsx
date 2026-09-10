"use client";

import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

export function Tabs({
  tabs,
  defaultValue,
}: {
  tabs: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);

  return (
    <div>
      <div className="flex gap-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={cn(
              "px-4 py-3 text-sm font-semibold transition-colors",
              active === tab.value
                ? "border-b-2 border-gold text-gold"
                : "text-silver hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{tabs.find((t) => t.value === active)?.content}</div>
    </div>
  );
}
