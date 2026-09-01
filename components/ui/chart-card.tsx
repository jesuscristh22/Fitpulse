import { Card } from "./card";
import type { ReactNode } from "react";

// Wraps a chart (recharts, etc.) with a consistent title/subtitle header.
// Kept chart-library-agnostic on purpose — pass the chart as children.
export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <p className="font-heading text-sm font-bold">{title}</p>
      {subtitle && <p className="text-xs text-silver">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  );
}
