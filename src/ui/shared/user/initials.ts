export type FallbackInitialsSource = {
  name?: string | null;
  username?: string | null;
  email?: string | null;
};

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
