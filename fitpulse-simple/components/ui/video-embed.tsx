// Generic YouTube embed — unlike ExerciseVideoPlayer, this isn't tied to the
// exercise library or a locale-keyed map. Used for Functional/Dance routine
// videos, where the video ID is attached directly to the routine's own data
// (see lib/functional-templates.ts / lib/dance-content.ts).
export function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-graphite">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
