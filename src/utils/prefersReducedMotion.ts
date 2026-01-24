/**
 * Checks if the user prefers reduced motion.
 * @returns true if the user has enabled reduced motion preference, false otherwise
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}
