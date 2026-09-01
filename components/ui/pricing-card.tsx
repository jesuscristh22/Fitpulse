import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { CheckCircle2 } from "lucide-react";

export function PricingCard({
  name,
  price,
  interval,
  features,
  highlighted,
  onSelect,
}: {
  name: string;
  price: string;
  interval?: string;
  features: string[];
  highlighted?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card
      className={
        highlighted ? "border-gold shadow-[0_0_0_1px_theme(colors.gold)]" : undefined
      }
    >
      {highlighted && <Badge variant="gold" className="mb-3">Most Popular</Badge>}
      <p className="font-heading text-lg font-bold">{name}</p>
      <p className="mt-2 font-heading text-3xl font-extrabold text-gold">
        {price}
        {interval && <span className="text-sm font-normal text-silver">/{interval}</span>}
      </p>
      <ul className="mt-4 flex flex-col gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-silver">
            <CheckCircle2 size={16} className="text-gold" /> {f}
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? "primary" : "secondary"} className="mt-6 w-full" onClick={onSelect}>
        Choose {name}
      </Button>
    </Card>
  );
}
