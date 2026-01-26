import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

import { abandonGameUseCase } from "./abandonGameUseCase";

describe("abandonGameUseCase", () => {
  it("delegates to the repository", async () => {
    const abandonGame = vi.fn().mockResolvedValue(undefined);
    const repository: GameRepository = {
      findOrCreateGame: vi.fn(),
      placeMark: vi.fn(),
      restartGame: vi.fn(),
      abandonGame,
      heartbeat: vi.fn(),
    };
    const gameId = "game-1" as GameId;

    await abandonGameUseCase(repository, { gameId });

    expect(abandonGame).toHaveBeenCalledWith({ gameId });
  });
});
