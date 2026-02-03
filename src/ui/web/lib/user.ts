import { getFallbackInitials } from "@/ui/web/lib/utils";

type UserLabelInput = {
  username?: string | null;
  name?: string | null;
  email?: string | null;
};

type ResolvePlayerLabelOptions = {
  useInitialsFallback?: boolean;
};

export const resolvePlayerLabel = (
  user: UserLabelInput,
  fallback: string,
  options: ResolvePlayerLabelOptions = {},
) => {
  if (user?.username) return user.username;
  if (user?.name) return user.name;
  if (user?.email) return user.email.split("@")[0] ?? user.email;
  if (options.useInitialsFallback) {
    const initials = getFallbackInitials({
      name: user?.name,
      username: user?.username,
      email: user?.email,
    });
    return initials || fallback;
  }
  return fallback;
};
