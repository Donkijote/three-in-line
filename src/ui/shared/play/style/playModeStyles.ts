import type { PlayMode } from "@/ui/shared/play/constants/modes";

type PlatformPlayModeStyle = {
  background: string;
  iconColor: string;
  pressHalo: string;
};

type PlayModeStyle = {
  web: PlatformPlayModeStyle;
  mobile: PlatformPlayModeStyle;
};

type ToneStyleToken = {
  mobileColor: keyof typeof toneColorClasses;
  webColor?: keyof typeof toneColorClasses;
};

const toneStyleTokens: Record<PlayMode["tone"], ToneStyleToken> = {
  emerald: {
    mobileColor: "emerald",
  },
  yellow: {
    mobileColor: "yellow",
  },
  fuchsia: {
    mobileColor: "fuchsia",
  },
  orange: {
    mobileColor: "orange",
  },
  sky: {
    mobileColor: "sky",
  },
  violet: {
    mobileColor: "violet",
    webColor: "purple",
  },
};

const toneColorClasses = {
  emerald: {
    background: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    pressHalo: "active:bg-emerald-500/10",
  },
  yellow: {
    background: "bg-yellow-500/15",
    iconColor: "text-yellow-500",
    pressHalo: "active:bg-yellow-500/10",
  },
  fuchsia: {
    background: "bg-fuchsia-500/15",
    iconColor: "text-fuchsia-500",
    pressHalo: "active:bg-fuchsia-500/10",
  },
  orange: {
    background: "bg-orange-500/15",
    iconColor: "text-orange-500",
    pressHalo: "active:bg-orange-500/10",
  },
  sky: {
    background: "bg-sky-500/15",
    iconColor: "text-sky-500",
    pressHalo: "active:bg-sky-500/10",
  },
  violet: {
    background: "bg-violet-500/15",
    iconColor: "text-violet-500",
    pressHalo: "active:bg-violet-500/10",
  },
  purple: {
    background: "bg-purple-500/15",
    iconColor: "text-purple-500",
    pressHalo: "active:bg-purple-500/10",
  },
} satisfies Record<string, PlatformPlayModeStyle>;

export const playModeStyles: Record<PlayMode["tone"], PlayModeStyle> = {
  emerald: resolvePlayModeStyle(toneStyleTokens.emerald),
  yellow: resolvePlayModeStyle(toneStyleTokens.yellow),
  fuchsia: resolvePlayModeStyle(toneStyleTokens.fuchsia),
  orange: resolvePlayModeStyle(toneStyleTokens.orange),
  sky: resolvePlayModeStyle(toneStyleTokens.sky),
  violet: resolvePlayModeStyle(toneStyleTokens.violet),
};

function resolvePlayModeStyle(tokens: ToneStyleToken): PlayModeStyle {
  return {
    web: toneColorClasses[tokens.webColor ?? tokens.mobileColor],
    mobile: toneColorClasses[tokens.mobileColor],
  };
}

export type { PlatformPlayModeStyle, PlayModeStyle };
