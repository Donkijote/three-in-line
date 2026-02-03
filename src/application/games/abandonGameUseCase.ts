import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

export const abandonGameUseCase = (
  repository: GameRepository,
  params: { gameId: GameId },
) => repository.abandonGame(params);
