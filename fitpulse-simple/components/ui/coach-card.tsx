import { Card } from "./card";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";

export function CoachCard({
  name,
  photoURL,
  specialties,
  city,
  verified,
  onInvite,
}: {
  name: string;
  photoURL?: string;
  specialties: string[];
  city?: string;
  verified?: boolean;
  onInvite?: () => void;
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar src={photoURL} name={name} size={48} />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-sm font-bold">{name}</p>
            {verified && <Badge variant="success">Verified</Badge>}
          </div>
          {city && <p className="text-xs text-silver">{city}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {specialties.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>
      <Button variant="primary" size="sm" onClick={onInvite}>
        Invite Coach
      </Button>
    </Card>
  );
}
