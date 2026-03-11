import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import { useCurrentUser, useUserById } from "@/ui/shared/user/hooks/useUser";
import { getFallbackInitials } from "@/ui/shared/user/initials";
import { resolvePlayerLabel } from "@/ui/shared/user/resolvePlayerLabel";

export const useHomeMatchCard = (opponentUserId: string | null) => {
  const currentUser = useCurrentUser();
  const opponentUser = useUserById(opponentUserId);

  const currentName = resolvePlayerLabel(currentUser ?? {}, "You");
  const opponentName = resolvePlayerLabel(opponentUser ?? {}, "Opponent");
  const currentInitials = getFallbackInitials({
    name: currentUser?.name,
    username: currentUser?.username,
    email: currentUser?.email,
  });
  const opponentInitials = getFallbackInitials({
    name: opponentUser?.name,
    username: opponentUser?.username,
    email: opponentUser?.email,
  });
  const currentAvatar = resolveAvatarSrc(currentUser?.avatar);
  const opponentAvatar = resolveAvatarSrc(opponentUser?.avatar);

  return {
    currentAvatar,
    currentInitials,
    currentName,
    opponentAvatar,
    opponentInitials,
    opponentName,
  };
};
