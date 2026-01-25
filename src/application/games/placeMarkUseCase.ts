import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

export const placeMarkUseCase = (
  repository: GameRepository,
  params: { gameId: GameId; index: number },
) => repository.placeMark(params);
