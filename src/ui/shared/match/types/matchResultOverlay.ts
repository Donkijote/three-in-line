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

export type ResultAccent = MatchResultViewModel["accent"];
export type ResultIcon = MatchResultViewModel["icon"];

export type MatchResultOverlayProps = {
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
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
