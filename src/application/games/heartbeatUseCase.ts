import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

export const heartbeatUseCase = (
  repository: GameRepository,
  params: { gameId: GameId },
) => repository.heartbeat(params);
