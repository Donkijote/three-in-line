import type {
  GameEndedReason,
  GameStatus,
  MatchScore,
  PlayerSlot,
} from "@/domain/entities/Game";
import type {
  MatchResultParticipant,
  MatchResultViewModel,
} from "@/ui/shared/match/utils";

export type ResultAccent = "primary" | "destructive";
export type ResultIcon = "trophy" | "heart" | "wifi" | "flag";

export type MatchResultOverlayProps = {
  status: GameStatus;
  endedReason: GameEndedReason;
  winner: PlayerSlot | null;
  abandonedBy: PlayerSlot | null;
  p1UserId: string;
  currentUserId?: string;
  score?: MatchScore;
  onPrimaryAction: () => Promise<void>;
  currentUser: MatchResultParticipant;
  opponentUser: MatchResultParticipant;
};

export type { MatchResultViewModel };
