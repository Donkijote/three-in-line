import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const getInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
};

type FallbackInitialsSource = {
  name?: string | null;
  username?: string | null;
  email?: string | null;
};

export const getFallbackInitials = ({
  name,
  username,
  email,
}: FallbackInitialsSource) => {
  const emailHandle = email?.split("@")[0] ?? "";

  return (
    getInitials(name ?? "") ||
    getInitials(username ?? "") ||
    getInitials(emailHandle) ||
    "?"
  );
};
