import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 * Pass any `clsx`-compatible values and receive a normalized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
