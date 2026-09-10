import {
  Button, Card, Badge, Avatar, ProgressBar, Skeleton, EmptyState, Input,
  MetricCard, WorkoutCard, ProgressCard, PricingCard, ChartCard, CoachCard, GymCard,
} from "@/components/ui";

// Internal-only style guide page — not linked from the marketing nav.
// Useful during Phase 1+ to visually QA every design system component at once.
export default function DesignSystemPage() {
  return (
    <main className="min-h-screen space-y-10 bg-carbon p-10">
      <h1 className="font-heading text-2xl font-bold text-gold">FitPulse Design System</h1>

      <section className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Badge variant="gold">Gold Badge</Badge>
        <Badge variant="success">Success</Badge>
        <Avatar name="Diego Silva" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="FitPulse Score" value={84} trend={{ value: "4 pts", direction: "up" }} />
        <ProgressCard label="Weekly Volume" current={3} target={5} unit="sessions" />
        <Card>
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <WorkoutCard name="Upper Body Strength" durationMinutes={45} difficulty="intermediate" />
        <CoachCard name="Ana Ribeiro" specialties={["Strength", "Mobility"]} city="Porto, PT" verified />
        <GymCard name="Iron Temple Gym" city="Lisboa, PT" memberCount={340} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PricingCard name="Member Pro" price="€12.99" interval="mo" features={["Unlimited AI workouts", "AI Copilot", "Advanced progress"]} highlighted />
        <ChartCard title="Consistency" subtitle="Last 4 weeks">
          <ProgressBar value={72} />
        </ChartCard>
        <EmptyState title="No workouts yet" description="Create your first workout to get started." action={<Button size="sm">Create Workout</Button>} />
      </section>

      <section className="max-w-sm">
        <Input placeholder="Search exercises..." />
      </section>
    </main>
  );
}
