import type { UserAvatar } from "@/domain/entities/Avatar";

export type ResultAccent = "primary" | "destructive";
export type ResultIcon = "trophy" | "heart" | "wifi";

export type MatchResultOverlayProps = {
  isOpen: boolean;
  result: "win" | "disconnect";
  isWinner: boolean;
  isAbandonedByCurrentUser?: boolean;
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
  primaryLabel: string;
  secondaryLabel: string;
  currentUser: MatchResultOverlayProps["currentUser"];
  opponentUser: MatchResultOverlayProps["opponentUser"];
  isCurrentWinner: boolean;
  isAbandonedByCurrentUser?: boolean;
};
