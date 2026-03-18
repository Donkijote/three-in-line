import { useRef, useState } from "react";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import type { GameConfig } from "@/domain/entities/GameConfig";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

export const useCreateGame = () => {
  const inFlightRef = useRef(false);
  const [isCreating, setIsCreating] = useState(false);

  const createGame = async (config: GameConfig) => {
    if (inFlightRef.current) {
      return null;
    }

    inFlightRef.current = true;
    setIsCreating(true);

    try {
      return await findOrCreateGameUseCase(gameRepository, config);
    } finally {
      inFlightRef.current = false;
      setIsCreating(false);
    }
  };

  return { createGame, isCreating };
};
