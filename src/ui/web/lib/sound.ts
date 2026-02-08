export type PlayerSymbol = "X" | "O";

const SOUND_BY_SYMBOL: Record<PlayerSymbol, string> = {
  X: "/sounds/X.mp3",
  O: "/sounds/O.mp3",
};

const DEFEAT_SOUND_PATH = "/sounds/defeat.mp3";
const TIMER_SOUND_PATH = "/sounds/timer.mp3";
const TIMES_UP_SOUND_PATH = "/sounds/timesup.mp3";
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
const timerTickPlaybackState: PlaybackState = {
  audio: null,
  timeoutId: undefined,
};

const activeMarkAudios = new Set<HTMLAudioElement>();
const markAudioTimeoutIds = new Map<HTMLAudioElement, number>();

type PlaySoundOptions = {
  maxDurationMs?: number;
  playbackState?: PlaybackState;
  onAudioStart?: (audio: HTMLAudioElement) => void;
  onAudioStop?: (audio: HTMLAudioElement) => void;
  onTimeoutStart?: (audio: HTMLAudioElement, timeoutId: number) => void;
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

const untrackMarkAudio = (audio: HTMLAudioElement): void => {
  const timeoutId = markAudioTimeoutIds.get(audio);
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId);
  }
  markAudioTimeoutIds.delete(audio);
  activeMarkAudios.delete(audio);
};

const stopPlayerMarkSounds = (): void => {
  for (const audio of activeMarkAudios) {
    stopAudio(audio);
    untrackMarkAudio(audio);
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
  options?.onAudioStart?.(audio);

  if (typeof audio.addEventListener === "function" && options?.onAudioStop) {
    audio.addEventListener("ended", () => {
      options.onAudioStop?.(audio);
    });
  }

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
      options?.onAudioStop?.(audio);
    }, maxDurationMs);

    if (playbackState) {
      playbackState.timeoutId = timeoutId;
    } else {
      unmanagedTimeoutId = timeoutId;
      options?.onTimeoutStart?.(audio, timeoutId);
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
    options?.onAudioStop?.(audio);
    // Ignore autoplay/policy failures; gameplay should continue.
  });
};

export const playPlayerMarkSound = (
  symbol: PlayerSymbol,
  options?: PlayerMarkSoundOptions,
): void => {
  playSound(SOUND_BY_SYMBOL[symbol], {
    maxDurationMs: options?.maxDurationMs,
    onAudioStart: (audio) => {
      activeMarkAudios.add(audio);
    },
    onAudioStop: (audio) => {
      untrackMarkAudio(audio);
    },
    onTimeoutStart: (audio, timeoutId) => {
      markAudioTimeoutIds.set(audio, timeoutId);
    },
  });
};

export const playVictorySound = (): void => {
  stopPlayerMarkSounds();
  stopTimerTickSound();
  playSound(VICTORY_SOUND_PATH, {
    maxDurationMs: VICTORY_MAX_DURATION_MS,
    playbackState: resultPlaybackState,
  });
};

export const playDefeatSound = (): void => {
  stopPlayerMarkSounds();
  stopTimerTickSound();
  playSound(DEFEAT_SOUND_PATH, {
    playbackState: resultPlaybackState,
  });
};

export const startTimerTickSound = (): void => {
  if (timerTickPlaybackState.audio) {
    return;
  }

  playSound(TIMER_SOUND_PATH, {
    playbackState: timerTickPlaybackState,
    onAudioStart: (audio) => {
      audio.loop = true;
    },
  });
};

export const stopTimerTickSound = (): void => {
  clearPlaybackState(timerTickPlaybackState);
};

export const playTimesUpSound = (): void => {
  stopTimerTickSound();
  playSound(TIMES_UP_SOUND_PATH);
};

export const stopResultSound = (): void => {
  clearPlaybackState(resultPlaybackState);
};
