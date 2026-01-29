import type { UserAvatar } from "@/domain/entities/Avatar";
import type { GameStatus, MatchScore } from "@/domain/entities/Game";

export type ResultAccent = "primary" | "destructive";
export type ResultIcon = "trophy" | "heart" | "wifi";

export type MatchResultOverlayProps = {
  status: GameStatus;
  endedReason: "win" | "draw" | "abandoned" | "disconnect" | null;
  winner: "P1" | "P2" | null;
  abandonedBy: "P1" | "P2" | null;
  p1UserId: string;
  currentUserId?: string;
  score?: MatchScore;
  onPrimaryAction: () => Promise<void>;
  currentUser: {
    name: string;
    avatar?: UserAvatar;
  };
  opponentUser: {
    name: string;
    avatar?: UserAvatar;
  };
};

export type MatchResultViewModel = {
  title: string;
  subtitle?: string;
  accent: ResultAccent;
  icon: ResultIcon;
  pill?: string;
  footer?: string;
  score?: {
    current: number;
    opponent: number;
  };
  primaryLabel: string;
  secondaryLabel: string;
  changeModeLabel: string;
  currentUser: MatchResultOverlayProps["currentUser"];
  opponentUser: MatchResultOverlayProps["opponentUser"];
  isCurrentWinner: boolean;
  isAbandonedByCurrentUser?: boolean;
};
