const LIGHT_TAP_PATTERN = 10;
const INVALID_MOVE_PATTERN: number[] = [24, 36, 24];
const OPPONENT_DISCONNECTED_PATTERN: number[] = [18, 24, 18];
const OPPONENT_RECONNECTED_PATTERN = 20;
const TIME_STOPPED_PATTERN = 40;
const ABANDONED_WIN_PATTERN: number[] = [14, 20, 24];
const DEFEAT_OVERLAY_PATTERN = 55;
const VICTORY_OVERLAY_PATTERN: number[] = [18, 28, 36];

export const playLightTapHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(LIGHT_TAP_PATTERN);
};

export const playInvalidMoveHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(INVALID_MOVE_PATTERN);
};

export const playTimeStoppedHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(TIME_STOPPED_PATTERN);
};

export const playOpponentDisconnectedHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(OPPONENT_DISCONNECTED_PATTERN);
};

export const playOpponentReconnectedHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(OPPONENT_RECONNECTED_PATTERN);
};

export const playVictoryOverlayHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(VICTORY_OVERLAY_PATTERN);
};

export const playDefeatOverlayHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(DEFEAT_OVERLAY_PATTERN);
};

export const playAbandonedWinHaptic = (): void => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  navigator.vibrate(ABANDONED_WIN_PATTERN);
};
