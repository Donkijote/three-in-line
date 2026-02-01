import type { GameId } from "@/domain/entities/Game";
import type { GameRepository } from "@/domain/ports/GameRepository";

type TimeoutTurnParams = {
  gameId: GameId;
};

export const timeoutTurnUseCase = (
  repository: GameRepository,
  params: TimeoutTurnParams,
) => repository.timeoutTurn(params);
