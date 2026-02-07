export type PlayerSymbol = "X" | "O";

const SOUND_BY_SYMBOL: Record<PlayerSymbol, string> = {
  X: "/sounds/X.mp3",
  O: "/sounds/O.mp3",
};

export const playPlayerMarkSound = (symbol: PlayerSymbol): void => {
  if (typeof Audio === "undefined") {
    return;
  }

  const audio = new Audio(SOUND_BY_SYMBOL[symbol]);
  void audio.play().catch(() => {
    // Ignore autoplay/policy failures; gameplay should continue.
  });
};
