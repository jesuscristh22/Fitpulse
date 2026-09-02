import type { Exercise } from "./workouts";

// Seed exercise library so /exercicios is never empty before a Super Admin
// content tool exists (that comes later, Phase 19). Real content, not
// placeholders — 4 exercises across each of the 7 categories from §25.
export const SEED_EXERCISES: Exercise[] = [
  // ---- Strength ----
  {
    id: "back-squat", slug: "back-squat", name: "Back Squat", category: "strength", difficulty: "intermediate",
    description: "A compound lower-body lift that builds strength in the legs, glutes, and core.",
    instructions: [
      "Set the bar on your upper back, feet shoulder-width apart.",
      "Brace your core and sit back and down, keeping your chest up.",
      "Lower until your hips are at or below knee level.",
      "Drive through your heels to stand back up.",
    ],
    muscles: ["quads", "glutes", "hamstrings", "core"],
    equipment: ["barbell", "full_gym"],
    safetyNotes: ["Keep knees tracking over toes.", "Use a spotter or safety pins when going heavy."],
    alternatives: [],
  },
  {
    id: "bench-press", slug: "bench-press", name: "Bench Press", category: "strength", difficulty: "intermediate",
    description: "The classic horizontal press for building chest, shoulder, and tricep strength.",
    instructions: [
      "Lie on the bench with eyes under the bar, feet flat on the floor.",
      "Grip slightly wider than shoulder-width.",
      "Lower the bar to your mid-chest with control.",
      "Press back up to full arm extension.",
    ],
    muscles: ["chest", "shoulders", "triceps"],
    equipment: ["barbell", "full_gym"],
    safetyNotes: ["Always use a spotter or safety arms when lifting heavy."],
    alternatives: ["dumbbell-bench-press", "push-up"],
  },
  {
    id: "deadlift", slug: "deadlift", name: "Deadlift", category: "strength", difficulty: "advanced",
    description: "A full-body pulling movement and one of the best overall strength builders.",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot.",
      "Hinge at the hips and grip the bar just outside your knees.",
      "Keep your back flat, chest up, and drive through your heels to stand.",
      "Lower the bar back down with control, hips moving back first.",
    ],
    muscles: ["back", "glutes", "hamstrings", "core"],
    equipment: ["barbell", "full_gym"],
    safetyNotes: ["Never round your lower back under load.", "Start light and prioritize form."],
    alternatives: [],
  },
  {
    id: "dumbbell-bench-press", slug: "dumbbell-bench-press", name: "Dumbbell Bench Press", category: "strength", difficulty: "beginner",
    description: "A joint-friendly variation of the bench press that also challenges shoulder stability.",
    instructions: [
      "Lie on a bench holding a dumbbell in each hand at chest level.",
      "Press both dumbbells up until your arms are extended.",
      "Lower with control back to chest level.",
    ],
    muscles: ["chest", "shoulders", "triceps"],
    equipment: ["dumbbells"],
    safetyNotes: ["Keep wrists straight and stacked over elbows."],
    alternatives: ["bench-press", "push-up"],
  },

  // ---- Cardio ----
  {
    id: "running", slug: "running", name: "Running", category: "cardio", difficulty: "beginner",
    description: "Steady-state or interval running for cardiovascular endurance.",
    instructions: [
      "Warm up with 5 minutes of easy walking or jogging.",
      "Maintain a pace you can sustain while breathing rhythmically.",
      "Cool down with a slower pace for the last few minutes.",
    ],
    muscles: ["quads", "hamstrings", "calves", "core"],
    equipment: ["no_equipment"],
    safetyNotes: ["Wear proper running shoes to reduce joint impact."],
    alternatives: ["cycling", "jump-rope"],
  },
  {
    id: "jump-rope", slug: "jump-rope", name: "Jump Rope", category: "cardio", difficulty: "beginner",
    description: "A high-efficiency cardio drill that also builds coordination and calf endurance.",
    instructions: [
      "Hold the rope handles at hip height.",
      "Jump just high enough to clear the rope, landing softly on the balls of your feet.",
      "Keep a steady rhythm, using your wrists more than your arms to turn the rope.",
    ],
    muscles: ["calves", "core"],
    equipment: ["other"],
    safetyNotes: ["Jump on a surface with some give to protect your joints."],
    alternatives: ["running", "burpee"],
  },
  {
    id: "rowing-machine", slug: "rowing-machine", name: "Rowing Machine", category: "cardio", difficulty: "beginner",
    description: "A low-impact full-body cardio exercise that also builds back and leg endurance.",
    instructions: [
      "Drive with your legs first, then lean back slightly and pull the handle to your chest.",
      "Reverse the sequence to return: arms out, lean forward, then bend the knees.",
    ],
    muscles: ["back", "quads", "core"],
    equipment: ["full_gym"],
    alternatives: ["running", "cycling"],
  },
  {
    id: "cycling", slug: "cycling", name: "Cycling", category: "cardio", difficulty: "beginner",
    description: "A joint-friendly cardio option, indoors on a stationary bike or outdoors.",
    instructions: [
      "Adjust the seat so your knee has a slight bend at full pedal extension.",
      "Maintain a steady cadence, adjusting resistance to control intensity.",
    ],
    muscles: ["quads", "hamstrings", "calves"],
    equipment: ["full_gym"],
    alternatives: ["running", "rowing-machine"],
  },

  // ---- Calisthenics ----
  {
    id: "push-up", slug: "push-up", name: "Push-Up", category: "calisthenics", difficulty: "beginner",
    description: "The foundational bodyweight pressing movement for chest, shoulders, and triceps.",
    instructions: [
      "Start in a plank position, hands slightly wider than shoulders.",
      "Lower your chest toward the floor, keeping your body in a straight line.",
      "Push back up to the starting position.",
    ],
    muscles: ["chest", "shoulders", "triceps", "core"],
    equipment: ["no_equipment"],
    safetyNotes: ["Keep your hips from sagging to protect your lower back."],
    alternatives: ["bench-press", "dumbbell-bench-press"],
  },
  {
    id: "pull-up", slug: "pull-up", name: "Pull-Up", category: "calisthenics", difficulty: "intermediate",
    description: "A demanding upper-body pull that builds back and bicep strength using bodyweight.",
    instructions: [
      "Hang from a bar with an overhand grip, slightly wider than shoulders.",
      "Pull yourself up until your chin clears the bar.",
      "Lower back down with control to a full hang.",
    ],
    muscles: ["back", "biceps", "core"],
    equipment: ["pull_up_bar"],
    safetyNotes: ["Avoid swinging or using momentum (kipping) until you have good control."],
    alternatives: [],
  },
  {
    id: "bodyweight-squat", slug: "bodyweight-squat", name: "Bodyweight Squat", category: "calisthenics", difficulty: "beginner",
    description: "A no-equipment squat pattern, great for beginners or warm-ups.",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Sit back and down, keeping your chest up and heels planted.",
      "Stand back up by driving through your heels.",
    ],
    muscles: ["quads", "glutes", "hamstrings"],
    equipment: ["no_equipment"],
    alternatives: ["back-squat"],
  },
  {
    id: "plank", slug: "plank", name: "Plank", category: "calisthenics", difficulty: "beginner",
    description: "An isometric core hold that builds trunk stability.",
    instructions: [
      "Rest on your forearms and toes, elbows under your shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Hold, breathing steadily, without letting your hips sag or pike up.",
    ],
    muscles: ["core"],
    equipment: ["no_equipment"],
    alternatives: [],
  },

  // ---- Military ----
  {
    id: "burpee", slug: "burpee", name: "Burpee", category: "military", difficulty: "intermediate",
    description: "A full-body conditioning move combining a squat, plank, push-up, and jump.",
    instructions: [
      "Squat down and place your hands on the floor.",
      "Kick your feet back into a plank and perform a push-up.",
      "Jump your feet back to your hands, then explode upward into a jump.",
    ],
    muscles: ["full_body"],
    equipment: ["no_equipment"],
    safetyNotes: ["Scale down (step back instead of jumping) if needed for your joints."],
    alternatives: ["mountain-climbers", "jump-rope"],
  },
  {
    id: "mountain-climbers", slug: "mountain-climbers", name: "Mountain Climbers", category: "military", difficulty: "beginner",
    description: "A fast-paced core and conditioning drill performed from a plank position.",
    instructions: [
      "Start in a plank position.",
      "Drive one knee toward your chest, then quickly switch legs.",
      "Keep your hips low and core braced throughout.",
    ],
    muscles: ["core", "quads"],
    equipment: ["no_equipment"],
    alternatives: ["burpee", "plank"],
  },
  {
    id: "bear-crawl", slug: "bear-crawl", name: "Bear Crawl", category: "military", difficulty: "intermediate",
    description: "A crawling pattern that builds full-body coordination, shoulder stability, and conditioning.",
    instructions: [
      "Start on hands and feet, knees hovering just off the ground.",
      "Move your opposite hand and foot forward together, keeping your back flat.",
      "Continue for distance or time, keeping your hips level.",
    ],
    muscles: ["full_body", "core", "shoulders"],
    equipment: ["no_equipment"],
    alternatives: ["plank", "mountain-climbers"],
  },
  {
    id: "sprints", slug: "sprints", name: "Sprints", category: "military", difficulty: "advanced",
    description: "Short, maximal-effort running intervals for power and conditioning.",
    instructions: [
      "Warm up thoroughly with dynamic stretches and light jogging.",
      "Sprint at near-maximal effort for the set distance or time.",
      "Walk back to recover fully before the next rep.",
    ],
    muscles: ["quads", "hamstrings", "glutes", "calves"],
    equipment: ["no_equipment"],
    safetyNotes: ["Skipping the warm-up significantly raises injury risk at sprint speeds."],
    alternatives: ["running", "burpee"],
  },

  // ---- Mobility ----
  {
    id: "hip-flexor-stretch", slug: "hip-flexor-stretch", name: "Kneeling Hip Flexor Stretch", category: "mobility", difficulty: "beginner",
    description: "Opens up tight hip flexors, common after long periods of sitting.",
    instructions: [
      "Kneel on one knee with the other foot planted in front.",
      "Shift your hips forward gently until you feel a stretch in the front of the kneeling hip.",
      "Hold, then switch sides.",
    ],
    muscles: ["core"],
    equipment: ["no_equipment"],
    alternatives: ["cat-cow"],
  },
  {
    id: "cat-cow", slug: "cat-cow", name: "Cat-Cow", category: "mobility", difficulty: "beginner",
    description: "A gentle spinal mobility flow, great as a warm-up or recovery movement.",
    instructions: [
      "Start on hands and knees.",
      "Inhale, drop your belly, and lift your chest and tailbone (cow).",
      "Exhale, round your spine and tuck your chin (cat).",
    ],
    muscles: ["core", "back"],
    equipment: ["no_equipment"],
    alternatives: ["hip-flexor-stretch"],
  },
  {
    id: "shoulder-dislocates", slug: "shoulder-dislocates", name: "Shoulder Dislocates (band or stick)", category: "mobility", difficulty: "beginner",
    description: "Improves shoulder range of motion using a resistance band or stick.",
    instructions: [
      "Hold a band or stick with a wide overhand grip in front of you.",
      "Slowly raise it overhead and back behind you, keeping arms straight.",
      "Reverse back to the starting position with control.",
    ],
    muscles: ["shoulders"],
    equipment: ["resistance_bands"],
    safetyNotes: ["Widen your grip if you feel pinching in the shoulders."],
    alternatives: ["cat-cow"],
  },
  {
    id: "world-greatest-stretch", slug: "worlds-greatest-stretch", name: "World's Greatest Stretch", category: "mobility", difficulty: "intermediate",
    description: "A multi-joint mobility flow covering hips, hamstrings, and thoracic spine in one movement.",
    instructions: [
      "Step into a deep lunge, both hands on the floor inside the front foot.",
      "Rotate your torso and reach the inside arm toward the ceiling.",
      "Return hand to the floor, then straighten the front leg to stretch the hamstring.",
    ],
    muscles: ["hamstrings", "core", "back"],
    equipment: ["no_equipment"],
    alternatives: ["hip-flexor-stretch"],
  },

  // ---- Warm-up ----
  {
    id: "jumping-jacks", slug: "jumping-jacks", name: "Jumping Jacks", category: "warm-up", difficulty: "beginner",
    description: "A classic full-body warm-up move to raise heart rate and body temperature.",
    instructions: [
      "Start standing with feet together, arms at your sides.",
      "Jump feet out while raising arms overhead.",
      "Jump back to the starting position and repeat.",
    ],
    muscles: ["full_body"],
    equipment: ["no_equipment"],
    alternatives: ["high-knees"],
  },
  {
    id: "high-knees", slug: "high-knees", name: "High Knees", category: "warm-up", difficulty: "beginner",
    description: "A dynamic warm-up drill that raises heart rate and activates the hip flexors.",
    instructions: [
      "Jog in place, driving your knees up toward hip height.",
      "Pump your arms in rhythm with your legs.",
    ],
    muscles: ["quads", "core"],
    equipment: ["no_equipment"],
    alternatives: ["jumping-jacks"],
  },
  {
    id: "arm-circles", slug: "arm-circles", name: "Arm Circles", category: "warm-up", difficulty: "beginner",
    description: "A simple shoulder warm-up to prepare the joint for pressing or overhead work.",
    instructions: [
      "Extend arms out to your sides at shoulder height.",
      "Make small circles, gradually increasing the size.",
      "Reverse direction after 15-20 seconds.",
    ],
    muscles: ["shoulders"],
    equipment: ["no_equipment"],
    alternatives: ["shoulder-dislocates"],
  },
  {
    id: "walking-lunges", slug: "walking-lunges-warmup", name: "Walking Lunges (warm-up pace)", category: "warm-up", difficulty: "beginner",
    description: "A dynamic lower-body warm-up that also improves balance.",
    instructions: [
      "Step forward into a lunge, lowering the back knee toward the floor.",
      "Push off the front foot to step into the next lunge.",
      "Continue alternating legs for the set distance.",
    ],
    muscles: ["quads", "glutes"],
    equipment: ["no_equipment"],
    alternatives: ["bodyweight-squat"],
  },

  // ---- Recovery ----
  {
    id: "foam-rolling-quads", slug: "foam-rolling-quads", name: "Foam Rolling — Quads", category: "recovery", difficulty: "beginner",
    description: "Self-myofascial release for the front of the thighs to ease post-workout tightness.",
    instructions: [
      "Lie face down with a foam roller under your thighs.",
      "Slowly roll from just above the knee to just below the hip.",
      "Pause on tender spots for 20-30 seconds.",
    ],
    muscles: ["quads"],
    equipment: ["other"],
    alternatives: ["hip-flexor-stretch"],
  },
  {
    id: "child-pose", slug: "childs-pose", name: "Child's Pose", category: "recovery", difficulty: "beginner",
    description: "A gentle resting stretch for the back and hips, often used to close out a session.",
    instructions: [
      "Kneel and sit back onto your heels.",
      "Fold forward, extending your arms in front of you, forehead toward the floor.",
      "Breathe slowly and relax into the stretch.",
    ],
    muscles: ["back", "core"],
    equipment: ["no_equipment"],
    alternatives: ["cat-cow"],
  },
  {
    id: "walking-cooldown", slug: "walking-cooldown", name: "Easy Walking Cool-Down", category: "recovery", difficulty: "beginner",
    description: "A low-intensity walk to gradually bring your heart rate down after intense training.",
    instructions: [
      "Walk at an easy, comfortable pace for 5-10 minutes.",
      "Focus on slow, deep breathing.",
    ],
    muscles: ["full_body"],
    equipment: ["no_equipment"],
    alternatives: ["childs-pose"],
  },
  {
    id: "box-breathing", slug: "box-breathing", name: "Box Breathing", category: "recovery", difficulty: "beginner",
    description: "A structured breathing pattern that supports recovery by calming the nervous system.",
    instructions: [
      "Inhale slowly for a count of 4.",
      "Hold your breath for a count of 4.",
      "Exhale slowly for a count of 4, then hold empty for a count of 4.",
      "Repeat for several cycles.",
    ],
    muscles: [],
    equipment: ["no_equipment"],
    alternatives: ["childs-pose"],
  },
];
