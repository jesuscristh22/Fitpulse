import { Card } from "./card";
import { Badge } from "./badge";
import type { Exercise } from "@/lib/workouts";

export function ExerciseCard({ exercise }: { exercise: Pick<Exercise, "name" | "category" | "difficulty" | "equipment"> }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="font-heading text-sm font-bold">{exercise.name}</p>
        <p className="mt-1 text-xs text-silver">{exercise.equipment.join(", ") || "No equipment"}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant="default">{exercise.category}</Badge>
        <Badge variant="gold">{exercise.difficulty}</Badge>
      </div>
    </Card>
  );
}
