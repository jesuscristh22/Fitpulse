import { Card } from "./card";
import { ProgressBar } from "./progress-bar";

export function ProgressCard({
  label,
  current,
  target,
  unit,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
}) {
  const pct = target > 0 ? (current / target) * 100 : 0;
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs uppercase text-silver">{label}</p>
        <p className="text-xs font-semibold text-white">
          {current}/{target} {unit}
        </p>
      </div>
      <ProgressBar value={pct} />
    </Card>
  );
}
