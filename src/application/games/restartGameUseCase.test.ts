import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

import { restartGameUseCase } from "./restartGameUseCase";

describe("restartGameUseCase", () => {
  it("delegates to the repository", async () => {
    const restartGame = vi.fn().mockResolvedValue(undefined);
    const repository: GameRepository = {
      findOrCreateGame: vi.fn(),
      placeMark: vi.fn(),
      restartGame,
      abandonGame: vi.fn(),
      heartbeat: vi.fn(),
    };
    const gameId = "game-1" as GameId;

    await restartGameUseCase(repository, { gameId });

    expect(restartGame).toHaveBeenCalledWith({ gameId });
  });
});
