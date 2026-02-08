describe("haptics", () => {
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
    } = await import("./haptics");
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
    vi.stubGlobal("navigator", {});
    const { playLightTapHaptic } = await import("./haptics");

    expect(() => playLightTapHaptic()).not.toThrow();
  });

  it("returns safely when navigator is unavailable", async () => {
    const { playLightTapHaptic } = await import("./haptics");
    vi.stubGlobal("navigator", undefined);

    expect(() => playLightTapHaptic()).not.toThrow();
  });
});
