import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

export function WorkoutCard({
  name,
  durationMinutes,
  difficulty,
  onStart,
}: {
  name: string;
  durationMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  onStart?: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">{name}</h3>
        <Badge variant="gold">{difficulty}</Badge>
      </div>
      <p className="text-sm text-silver">{durationMinutes} min</p>
      <Button variant="primary" size="sm" onClick={onStart} className="self-start">
        Start Workout
      </Button>
    </Card>
  );
}
