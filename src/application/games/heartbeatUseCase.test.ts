import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

import { heartbeatUseCase } from "./heartbeatUseCase";

describe("heartbeatUseCase", () => {
  it("delegates to the repository", async () => {
    const heartbeat = vi.fn().mockResolvedValue(undefined);
    const repository: GameRepository = {
      findOrCreateGame: vi.fn(),
      placeMark: vi.fn(),
      restartGame: vi.fn(),
      abandonGame: vi.fn(),
      heartbeat,
    };
    const gameId = "game-1" as GameId;

    await heartbeatUseCase(repository, { gameId });

    expect(heartbeat).toHaveBeenCalledWith({ gameId });
  });
});
