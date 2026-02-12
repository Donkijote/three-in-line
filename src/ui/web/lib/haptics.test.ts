describe("haptics", () => {
  const loadAllHaptics = async () => import("./haptics");

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("triggers a light tap vibration when supported", async () => {
    const {
      playAbandonedWinHaptic,
      playDefeatOverlayHaptic,
      playInvalidMoveHaptic,
      playLightTapHaptic,
      playOpponentDisconnectedHaptic,
      playOpponentReconnectedHaptic,
      playTimeStoppedHaptic,
      playVictoryOverlayHaptic,
    } = await loadAllHaptics();
    const vibrate = vi.fn();
    vi.stubGlobal("navigator", { vibrate });

    playLightTapHaptic();
    playInvalidMoveHaptic();
    playTimeStoppedHaptic();
    playOpponentDisconnectedHaptic();
    playOpponentReconnectedHaptic();
    playVictoryOverlayHaptic();
    playDefeatOverlayHaptic();
    playAbandonedWinHaptic();

    expect(vibrate).toHaveBeenCalledWith(10);
    expect(vibrate).toHaveBeenCalledWith([24, 36, 24]);
    expect(vibrate).toHaveBeenCalledWith(40);
    expect(vibrate).toHaveBeenCalledWith([18, 24, 18]);
    expect(vibrate).toHaveBeenCalledWith(20);
    expect(vibrate).toHaveBeenCalledWith([18, 28, 36]);
    expect(vibrate).toHaveBeenCalledWith(55);
    expect(vibrate).toHaveBeenCalledWith([14, 20, 24]);
  });

  it("returns safely when vibrate is not available", async () => {
    const {
      playAbandonedWinHaptic,
      playDefeatOverlayHaptic,
      playInvalidMoveHaptic,
      playLightTapHaptic,
      playOpponentDisconnectedHaptic,
      playOpponentReconnectedHaptic,
      playTimeStoppedHaptic,
      playVictoryOverlayHaptic,
    } = await loadAllHaptics();
    vi.stubGlobal("navigator", {});

    expect(() => playLightTapHaptic()).not.toThrow();
    expect(() => playInvalidMoveHaptic()).not.toThrow();
    expect(() => playTimeStoppedHaptic()).not.toThrow();
    expect(() => playOpponentDisconnectedHaptic()).not.toThrow();
    expect(() => playOpponentReconnectedHaptic()).not.toThrow();
    expect(() => playVictoryOverlayHaptic()).not.toThrow();
    expect(() => playDefeatOverlayHaptic()).not.toThrow();
    expect(() => playAbandonedWinHaptic()).not.toThrow();
  });

  it("returns safely when navigator is unavailable", async () => {
    const {
      playAbandonedWinHaptic,
      playDefeatOverlayHaptic,
      playInvalidMoveHaptic,
      playLightTapHaptic,
      playOpponentDisconnectedHaptic,
      playOpponentReconnectedHaptic,
      playTimeStoppedHaptic,
      playVictoryOverlayHaptic,
    } = await loadAllHaptics();
    vi.stubGlobal("navigator", undefined);

    expect(() => playLightTapHaptic()).not.toThrow();
    expect(() => playInvalidMoveHaptic()).not.toThrow();
    expect(() => playTimeStoppedHaptic()).not.toThrow();
    expect(() => playOpponentDisconnectedHaptic()).not.toThrow();
    expect(() => playOpponentReconnectedHaptic()).not.toThrow();
    expect(() => playVictoryOverlayHaptic()).not.toThrow();
    expect(() => playDefeatOverlayHaptic()).not.toThrow();
    expect(() => playAbandonedWinHaptic()).not.toThrow();
  });
});
