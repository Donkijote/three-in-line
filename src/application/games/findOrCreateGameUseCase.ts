import type { GameConfig } from "@/domain/entities/GameConfig";
import type { GameRepository } from "@/domain/ports/GameRepository";

export const findOrCreateGameUseCase = (
  repository: GameRepository,
  config: GameConfig,
) => repository.findOrCreateGame(config);
