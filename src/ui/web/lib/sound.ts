export type PlayerSymbol = "X" | "O";

const SOUND_BY_SYMBOL: Record<PlayerSymbol, string> = {
  X: "/sounds/X.mp3",
  O: "/sounds/O.mp3",
};

const DEFEAT_SOUND_PATH = "/sounds/defeat.mp3";
const VICTORY_SOUND_PATH = "/sounds/victory.mp3";
const VICTORY_MAX_DURATION_MS = 5_000;

type PlaybackState = {
  audio: HTMLAudioElement | null;
  timeoutId: number | undefined;
};

const resultPlaybackState: PlaybackState = {
  audio: null,
  timeoutId: undefined,
};

type PlaySoundOptions = {
  maxDurationMs?: number;
  playbackState?: PlaybackState;
};

type PlayerMarkSoundOptions = {
  maxDurationMs?: number;
};

const stopAudio = (audio: HTMLAudioElement): void => {
  audio.pause();
  audio.currentTime = 0;
};

const clearPlaybackState = (
  playbackState: NonNullable<PlaySoundOptions["playbackState"]>,
): void => {
  if (playbackState.timeoutId !== undefined) {
    clearTimeout(playbackState.timeoutId);
    playbackState.timeoutId = undefined;
  }

  if (playbackState.audio) {
    stopAudio(playbackState.audio);
    playbackState.audio = null;
  }
};

const playSound = (path: string, options?: PlaySoundOptions): void => {
  if (typeof Audio === "undefined") {
    return;
  }

  const playbackState = options?.playbackState;
  if (playbackState) {
    clearPlaybackState(playbackState);
  }
  const audio = new Audio(path);
  if (playbackState) {
    playbackState.audio = audio;
  }

  const maxDurationMs = options?.maxDurationMs;
  let unmanagedTimeoutId: number | undefined;
  if (maxDurationMs && maxDurationMs > 0) {
    const timeoutId = setTimeout(() => {
      if (playbackState) {
        clearPlaybackState(playbackState);
        return;
      }

      stopAudio(audio);
    }, maxDurationMs);

    if (playbackState) {
      playbackState.timeoutId = timeoutId;
    } else {
      unmanagedTimeoutId = timeoutId;
    }
  }

  const playResult = audio.play();
  if (typeof playResult?.catch !== "function") {
    return;
  }

  void playResult.catch(() => {
    if (playbackState) {
      if (playbackState.audio !== audio) {
        return;
      }
      clearPlaybackState(playbackState);
      return;
    }
    if (unmanagedTimeoutId !== undefined) {
      clearTimeout(unmanagedTimeoutId);
    }
    // Ignore autoplay/policy failures; gameplay should continue.
  });
};

export const playPlayerMarkSound = (
  symbol: PlayerSymbol,
  options?: PlayerMarkSoundOptions,
): void => {
  playSound(SOUND_BY_SYMBOL[symbol], {
    maxDurationMs: options?.maxDurationMs,
  });
};

export const playVictorySound = (): void => {
  playSound(VICTORY_SOUND_PATH, {
    maxDurationMs: VICTORY_MAX_DURATION_MS,
    playbackState: resultPlaybackState,
  });
};

export const playDefeatSound = (): void => {
  playSound(DEFEAT_SOUND_PATH, {
    playbackState: resultPlaybackState,
  });
};

export const stopResultSound = (): void => {
  clearPlaybackState(resultPlaybackState);
};
