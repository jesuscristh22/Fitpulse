// Maps exercise slug -> YouTube video ID. Demonstration videos are visual and
// language-independent, so one video serves all 3 site locales.
//
// [CONFIGURATION REQUIRED] — only a starter set (one per category) is filled
// in below, sourced from reputable channels (NASM, Yoga With Adriene,
// Well+Good, etc). The remaining exercises have no video yet rather than a
// guessed/unverified link — nobody here can watch and confirm a video's
// content and quality at scale, so add the rest deliberately (Super Admin
// content tools arrive in Phase 19) rather than filling every slot at once.
export const EXERCISE_VIDEOS: Record<string, string> = {
  "back-squat": "T_t85kQEDWk",
  "push-up": "uXC_3Gs9Yr0",
  burpee: "qLBImHhCXSw",
  "cat-cow": "y39PrKY_4JM",
  "jumping-jacks": "uLVt6u15L98",
  "childs-pose": "ESy8ujdrZrk",
  "jump-rope": "nMHfZ-yrFjA",
};

export function getExerciseVideoId(slug: string): string | undefined {
  return EXERCISE_VIDEOS[slug];
}
