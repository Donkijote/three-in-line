import type { GameId } from "@/domain/entities/Game";
import type { GameConfig } from "@/domain/entities/GameConfig";
import type { GameRepository } from "@/domain/ports/GameRepository";

import { findOrCreateGameUseCase } from "./findOrCreateGameUseCase";

describe("findOrCreateGameUseCase", () => {
  it("delegates to the repository", async () => {
    const gameId = "game-1" as GameId;
    const findOrCreateGame = vi.fn().mockResolvedValue(gameId);
    const repository: GameRepository = {
      findOrCreateGame,
      placeMark: vi.fn(),
      abandonGame: vi.fn(),
      heartbeat: vi.fn(),
      timeoutTurn: vi.fn(),
    };
    const config: GameConfig = { gridSize: 3, winLength: 3 };

    const result = await findOrCreateGameUseCase(repository, config);

    expect(result).toBe(gameId);
    expect(findOrCreateGame).toHaveBeenCalledWith(config);
  });
});
