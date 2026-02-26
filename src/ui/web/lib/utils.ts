import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export {
  type FallbackInitialsSource,
  getFallbackInitials,
  getInitials,
} from "@/ui/shared/user/initials";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
