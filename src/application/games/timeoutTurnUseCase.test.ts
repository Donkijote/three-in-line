import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

import { timeoutTurnUseCase } from "./timeoutTurnUseCase";

describe("timeoutTurnUseCase", () => {
  it("delegates to the repository", async () => {
    const timeoutTurn = vi.fn().mockResolvedValue(undefined);
    const repository: GameRepository = {
      findOrCreateGame: vi.fn(),
      placeMark: vi.fn(),
      abandonGame: vi.fn(),
      heartbeat: vi.fn(),
      timeoutTurn,
    };
    const gameId = "game-1" as GameId;

    await timeoutTurnUseCase(repository, { gameId });

    expect(timeoutTurn).toHaveBeenCalledWith({ gameId });
  });
});
