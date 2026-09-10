import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-14 text-center">
      <p className="font-heading text-base font-bold text-white">{title}</p>
      {description && <p className="mt-2 max-w-xs text-sm text-silver">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
