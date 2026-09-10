import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

export function GymCard({
  name,
  city,
  memberCount,
  onJoin,
}: {
  name: string;
  city?: string;
  memberCount?: number;
  onJoin?: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="font-heading text-sm font-bold">{name}</p>
        {city && <p className="text-xs text-silver">{city}</p>}
      </div>
      {typeof memberCount === "number" && <Badge variant="gold">{memberCount} members</Badge>}
      <Button variant="secondary" size="sm" onClick={onJoin}>
        Join Gym
      </Button>
    </Card>
  );
}
