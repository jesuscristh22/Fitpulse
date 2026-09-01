import { Card } from "./card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <p className="text-xs uppercase tracking-wide text-silver">{label}</p>
      <p className="mt-2 font-heading text-3xl font-extrabold text-white">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-semibold",
            trend.direction === "up" ? "text-emerald-400" : "text-red-400",
          )}
        >
          {trend.direction === "up" ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </Card>
  );
}
