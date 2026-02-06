/**
 * Formats reading time with proper pluralization.
 * @param minutes - The number of minutes to read
 * @returns Formatted string: "1 minute read" or "X minutes read"
 */
export function formatReadingTime(minutes: number): string {
  return minutes === 1 ? "1 minute read" : `${minutes} minute read`;
}
