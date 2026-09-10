import { cn } from "@/lib/utils";
import Image from "next/image";

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-graphite text-xs font-bold text-gold ring-1 ring-white/10",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
