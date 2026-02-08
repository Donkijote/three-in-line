const LIGHT_TAP_PATTERN = 10;
const INVALID_MOVE_PATTERN: number[] = [24, 36, 24];
const OPPONENT_DISCONNECTED_PATTERN: number[] = [18, 24, 18];
const OPPONENT_RECONNECTED_PATTERN = 20;
const TIME_STOPPED_PATTERN = 40;

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
