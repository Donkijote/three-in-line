import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

import { placeMarkUseCase } from "./placeMarkUseCase";

describe("placeMarkUseCase", () => {
  it("delegates to the repository", async () => {
    const placeMark = vi.fn().mockResolvedValue(undefined);
    const repository: GameRepository = {
      findOrCreateGame: vi.fn(),
      placeMark,
      abandonGame: vi.fn(),
      heartbeat: vi.fn(),
      timeoutTurn: vi.fn(),
    };
    const gameId = "game-1" as GameId;

    await placeMarkUseCase(repository, { gameId, index: 4 });

    expect(placeMark).toHaveBeenCalledWith({ gameId, index: 4 });
  });
});
