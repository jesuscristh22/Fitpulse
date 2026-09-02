"use client";

// Firestore rejects any field whose value is `undefined` (unlike `null`).
// Form state naturally ends up with undefined values for fields the person
// left blank (e.g. an optional weight or duration). Round-tripping through
// JSON strips those keys entirely before the write, which is simpler and
// less error-prone than manually omitting each optional field by hand.
export function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
