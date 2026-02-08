import {
  playDefeatSound,
  playPlayerMarkSound,
  playSurrenderSound,
  playTimesUpSound,
  playVictorySound,
  startTimerTickSound,
  stopResultSound,
  stopTimerTickSound,
} from "./sound";

type MockAudioInstance = {
  src: string;
  currentTime: number;
  loop: boolean;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  addEventListener: (type: string, cb: () => void) => void;
  emitEnded: () => void;
};

const audioInstances: MockAudioInstance[] = [];
const queuedPlayResults: Array<Promise<void> | undefined> = [];

const MockAudio = class {
  src = "";
  currentTime = 0;
  loop = false;
  private endedListeners = new Set<() => void>();
  play = vi.fn(() => {
    if (queuedPlayResults.length === 0) {
      return Promise.resolve();
    }

    return queuedPlayResults.shift();
  });
  pause = vi.fn();
  addEventListener = (type: string, cb: () => void) => {
    if (type === "ended") {
      this.endedListeners.add(cb);
    }
  };

  emitEnded = () => {
    for (const cb of this.endedListeners) {
      cb();
    }
  };

  constructor(src?: string) {
    this.src = src ?? "";
    audioInstances.push(this);
  }
};

describe("sound", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    audioInstances.length = 0;
    queuedPlayResults.length = 0;
    vi.stubGlobal("Audio", MockAudio as unknown as typeof Audio);
  });

  afterEach(() => {
    stopResultSound();
    stopTimerTickSound();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("plays X and O mark sounds with the expected files", () => {
    playPlayerMarkSound("X");
    playPlayerMarkSound("O");

    expect(audioInstances).toHaveLength(2);
    expect(audioInstances[0]?.src).toBe("/sounds/X.mp3");
    expect(audioInstances[1]?.src).toBe("/sounds/O.mp3");
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1);
    expect(audioInstances[1]?.play).toHaveBeenCalledTimes(1);
  });

  it("returns safely when Audio is unavailable", () => {
    vi.stubGlobal("Audio", undefined);

    expect(() => {
      playPlayerMarkSound("X");
      playVictorySound();
      playDefeatSound();
      stopResultSound();
    }).not.toThrow();
  });

  it("returns safely when play() does not return a promise", () => {
    queuedPlayResults.push(undefined);

    expect(() => {
      playPlayerMarkSound("X");
    }).not.toThrow();
  });

  it("supports optional max duration for mark sounds", () => {
    playPlayerMarkSound("X", { maxDurationMs: 100 });
    const markAudio = audioInstances[0];

    vi.advanceTimersByTime(100);
    expect(markAudio?.pause).toHaveBeenCalledTimes(1);
    expect(markAudio?.currentTime).toBe(0);
  });

  it("clears unmanaged timeout when mark sound play fails", async () => {
    queuedPlayResults.push(Promise.reject(new Error("blocked")));
    playPlayerMarkSound("O", { maxDurationMs: 100 });
    const markAudio = audioInstances[0];

    await Promise.resolve();
    vi.advanceTimersByTime(100);
    expect(markAudio?.pause).not.toHaveBeenCalled();
  });

  it("handles mark sound play rejection without timeout", async () => {
    queuedPlayResults.push(Promise.reject(new Error("blocked")));

    playPlayerMarkSound("X");

    await Promise.resolve();
    expect(audioInstances[0]?.pause).not.toHaveBeenCalled();
  });

  it("trims victory sound to 5 seconds", () => {
    playVictorySound();
    const victoryAudio = audioInstances[0];

    expect(victoryAudio?.src).toBe("/sounds/victory.mp3");
    expect(victoryAudio?.pause).not.toHaveBeenCalled();

    vi.advanceTimersByTime(4_999);
    expect(victoryAudio?.pause).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(victoryAudio?.pause).toHaveBeenCalledTimes(1);
    expect(victoryAudio?.currentTime).toBe(0);
  });

  it("starts timer ticking sound as a loop and does not duplicate", () => {
    startTimerTickSound();
    startTimerTickSound();

    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0]?.src).toBe("/sounds/timer.mp3");
    expect(audioInstances[0]?.loop).toBe(true);
  });

  it("stops timer ticking sound explicitly", () => {
    startTimerTickSound();
    const timerAudio = audioInstances[0];

    stopTimerTickSound();

    expect(timerAudio?.pause).toHaveBeenCalledTimes(1);
  });

  it("stops timer ticking before times up sound", () => {
    startTimerTickSound();
    const timerAudio = audioInstances[0];

    playTimesUpSound();
    const timesUpAudio = audioInstances[1];

    expect(timerAudio?.pause).toHaveBeenCalledTimes(1);
    expect(timesUpAudio?.src).toBe("/sounds/timesup.mp3");
  });

  it("stops active result sound when explicitly requested", () => {
    playDefeatSound();
    const defeatAudio = audioInstances[0];

    stopResultSound();

    expect(defeatAudio?.pause).toHaveBeenCalledTimes(1);
    expect(defeatAudio?.currentTime).toBe(0);
  });

  it("stops previous result audio before starting a new one", () => {
    playVictorySound();
    const victoryAudio = audioInstances[0];

    playDefeatSound();
    const defeatAudio = audioInstances[1];

    expect(victoryAudio?.pause).toHaveBeenCalledTimes(1);
    expect(victoryAudio?.currentTime).toBe(0);
    expect(defeatAudio?.src).toBe("/sounds/defeat.mp3");
    expect(defeatAudio?.play).toHaveBeenCalledTimes(1);
  });

  it("plays surrender result sound trimmed to 2 seconds", () => {
    playSurrenderSound();
    const surrenderAudio = audioInstances[0];

    expect(surrenderAudio?.src).toBe("/sounds/surrender.mp3");
    expect(surrenderAudio?.play).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1_999);
    expect(surrenderAudio?.pause).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(surrenderAudio?.pause).toHaveBeenCalledTimes(1);
    expect(surrenderAudio?.currentTime).toBe(0);
  });

  it("stops active mark sound when a result sound starts", () => {
    playPlayerMarkSound("X");
    const markAudio = audioInstances[0];

    playVictorySound();
    const victoryAudio = audioInstances[1];

    expect(markAudio?.pause).toHaveBeenCalledTimes(1);
    expect(markAudio?.currentTime).toBe(0);
    expect(victoryAudio?.src).toBe("/sounds/victory.mp3");
  });

  it("untracks mark audio when ended event fires", () => {
    playPlayerMarkSound("X");
    const markAudio = audioInstances[0];
    markAudio?.emitEnded();

    playVictorySound();

    expect(markAudio?.pause).not.toHaveBeenCalled();
  });

  it("ignores stale managed play rejection when a newer result sound exists", async () => {
    queuedPlayResults.push(Promise.reject(new Error("blocked")));
    queuedPlayResults.push(Promise.resolve());

    playVictorySound();
    const firstAudio = audioInstances[0];
    playDefeatSound();
    const secondAudio = audioInstances[1];

    await Promise.resolve();

    expect(firstAudio?.pause).toHaveBeenCalledTimes(1);
    expect(secondAudio?.pause).not.toHaveBeenCalled();
  });

  it("clears managed playback state when active result play rejects", async () => {
    queuedPlayResults.push(Promise.reject(new Error("blocked")));

    playVictorySound();
    const victoryAudio = audioInstances[0];

    await Promise.resolve();

    expect(victoryAudio?.pause).toHaveBeenCalledTimes(1);
    expect(victoryAudio?.currentTime).toBe(0);
  });
});
