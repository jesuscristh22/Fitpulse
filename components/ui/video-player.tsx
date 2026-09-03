import { getExerciseVideoId } from "@/lib/exercise-videos";
import type { LocaleSlug } from "@/lib/locales-config";

// Responsive 16:9 embed using youtube-nocookie.com (privacy-enhanced mode —
// no tracking cookies until the person actually presses play).
export function ExerciseVideoPlayer({
  slug,
  title,
  locale,
  fallbackVideoId,
}: {
  slug: string;
  title: string;
  locale: LocaleSlug;
  fallbackVideoId?: string;
}) {
  const videoId = getExerciseVideoId(slug, locale) ?? fallbackVideoId;
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
