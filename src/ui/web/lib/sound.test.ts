import {
  playDefeatSound,
  playPlayerMarkSound,
  playVictorySound,
  stopResultSound,
} from "./sound";

type MockAudioInstance = {
  src: string;
  currentTime: number;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
};

const audioInstances: MockAudioInstance[] = [];
const queuedPlayResults: Array<Promise<void> | undefined> = [];

const MockAudio = class {
  src = "";
  currentTime = 0;
  play = vi.fn(() => {
    if (queuedPlayResults.length === 0) {
      return Promise.resolve();
    }

    return queuedPlayResults.shift();
  });
  pause = vi.fn();

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
