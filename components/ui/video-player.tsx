import { getExerciseVideoId } from "@/lib/exercise-videos";

// Responsive 16:9 embed using youtube-nocookie.com (privacy-enhanced mode —
// no tracking cookies until the person actually presses play).
export function ExerciseVideoPlayer({ slug, title }: { slug: string; title: string }) {
  const videoId = getExerciseVideoId(slug);
  if (!videoId) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-graphite">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={`${title} — demonstration video`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
