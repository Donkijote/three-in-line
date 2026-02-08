describe("haptics", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("triggers a light tap vibration when supported", async () => {
    const {
      playInvalidMoveHaptic,
      playLightTapHaptic,
      playOpponentDisconnectedHaptic,
      playOpponentReconnectedHaptic,
      playTimeStoppedHaptic,
    } = await import("./haptics");
    const vibrate = vi.fn();
    vi.stubGlobal("navigator", { vibrate });

    playLightTapHaptic();
    playInvalidMoveHaptic();
    playTimeStoppedHaptic();
    playOpponentDisconnectedHaptic();
    playOpponentReconnectedHaptic();

    expect(vibrate).toHaveBeenCalledWith(10);
    expect(vibrate).toHaveBeenCalledWith([24, 36, 24]);
    expect(vibrate).toHaveBeenCalledWith(40);
    expect(vibrate).toHaveBeenCalledWith([18, 24, 18]);
    expect(vibrate).toHaveBeenCalledWith(20);
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
