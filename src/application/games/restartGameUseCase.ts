import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

export const restartGameUseCase = (
  repository: GameRepository,
  params: { gameId: GameId },
) => repository.restartGame(params);
