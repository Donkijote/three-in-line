import type { PresetAvatarId, UserAvatar } from "@/domain/entities/Avatar";

import type { AvatarPreset } from "./types";

const presetSrc = (id: PresetAvatarId) => `/avatars/${id}.svg`;

/**
 * Simple display metadata for UI.
 */

export const PRESET_AVATARS: readonly AvatarPreset[] = [
  { id: "avatar-1", name: "Orion", initials: "O", src: presetSrc("avatar-1") },
  { id: "avatar-2", name: "Nova", initials: "N", src: presetSrc("avatar-2") },
  { id: "avatar-3", name: "Atlas", initials: "A", src: presetSrc("avatar-3") },
  { id: "avatar-4", name: "Echo", initials: "E", src: presetSrc("avatar-4") },
  { id: "avatar-5", name: "Luna", initials: "L", src: presetSrc("avatar-5") },
  { id: "avatar-6", name: "Kai", initials: "K", src: presetSrc("avatar-6") },

  {
    id: "avatar-7",
    name: "Astra Vale",
    initials: "AV",
    src: presetSrc("avatar-7"),
  },
  {
    id: "avatar-8",
    name: "Rowan Sky",
    initials: "RS",
    src: presetSrc("avatar-8"),
  },
  {
    id: "avatar-9",
    name: "Milo Ray",
    initials: "MR",
    src: presetSrc("avatar-9"),
  },
  {
    id: "avatar-10",
    name: "Iris Bloom",
    initials: "IB",
    src: presetSrc("avatar-10"),
  },

  {
    id: "avatar-11",
    name: "Zenith",
    initials: "Z",
    src: presetSrc("avatar-11"),
  },
  {
    id: "avatar-12",
    name: "Solace",
    initials: "S",
    src: presetSrc("avatar-12"),
  },
  { id: "avatar-13", name: "Nyx", initials: "N", src: presetSrc("avatar-13") },
  { id: "avatar-14", name: "Arlo", initials: "A", src: presetSrc("avatar-14") },
  {
    id: "avatar-15",
    name: "Vesper",
    initials: "V",
    src: presetSrc("avatar-15"),
  },

  {
    id: "avatar-16",
    name: "Theo North",
    initials: "TN",
    src: presetSrc("avatar-16"),
  },
  {
    id: "avatar-17",
    name: "Elara Moon",
    initials: "EM",
    src: presetSrc("avatar-17"),
  },
  {
    id: "avatar-18",
    name: "Cleo Dawn",
    initials: "CD",
    src: presetSrc("avatar-18"),
  },
  {
    id: "avatar-19",
    name: "Leo Ash",
    initials: "LA",
    src: presetSrc("avatar-19"),
  },
  {
    id: "avatar-20",
    name: "Mara Snow",
    initials: "MS",
    src: presetSrc("avatar-20"),
  },

  { id: "avatar-21", name: "Rune", initials: "R", src: presetSrc("avatar-21") },
  {
    id: "avatar-22",
    name: "Sable",
    initials: "S",
    src: presetSrc("avatar-22"),
  },
  {
    id: "avatar-23",
    name: "Indigo",
    initials: "I",
    src: presetSrc("avatar-23"),
  },
  {
    id: "avatar-24",
    name: "Jasper",
    initials: "J",
    src: presetSrc("avatar-24"),
  },
  { id: "avatar-25", name: "Lyra", initials: "L", src: presetSrc("avatar-25") },

  {
    id: "avatar-26",
    name: "Finn Wilder",
    initials: "FW",
    src: presetSrc("avatar-26"),
  },
  {
    id: "avatar-27",
    name: "Noah Vale",
    initials: "NV",
    src: presetSrc("avatar-27"),
  },
  {
    id: "avatar-28",
    name: "Skye Harbor",
    initials: "SH",
    src: presetSrc("avatar-28"),
  },
  {
    id: "avatar-29",
    name: "Ezra Lake",
    initials: "EL",
    src: presetSrc("avatar-29"),
  },
  {
    id: "avatar-30",
    name: "Ivy Stone",
    initials: "IS",
    src: presetSrc("avatar-30"),
  },

  { id: "avatar-31", name: "Onyx", initials: "O", src: presetSrc("avatar-31") },
  {
    id: "avatar-32",
    name: "Blaze",
    initials: "B",
    src: presetSrc("avatar-32"),
  },
  {
    id: "avatar-33",
    name: "Cobalt",
    initials: "C",
    src: presetSrc("avatar-33"),
  },
  {
    id: "avatar-34",
    name: "Ember",
    initials: "E",
    src: presetSrc("avatar-34"),
  },
  {
    id: "avatar-35",
    name: "Fable",
    initials: "F",
    src: presetSrc("avatar-35"),
  },

  {
    id: "avatar-36",
    name: "Aurora Field",
    initials: "AF",
    src: presetSrc("avatar-36"),
  },
  {
    id: "avatar-37",
    name: "Silas Reed",
    initials: "SR",
    src: presetSrc("avatar-37"),
  },
  {
    id: "avatar-38",
    name: "Nova Quinn",
    initials: "NQ",
    src: presetSrc("avatar-38"),
  },
] as const;

export const getPresetAvatarById = (id: PresetAvatarId): AvatarPreset => {
  const found = PRESET_AVATARS.find((a) => a.id === id);

  return (
    found ?? {
      id,
      name: id,
      initials: id.replace("avatar-", "A"),
      src: presetSrc(id),
    }
  );
};

export const pickRandomPresetAvatars = (count = 6): AvatarPreset[] => {
  if (count >= PRESET_AVATARS.length) {
    return [...PRESET_AVATARS];
  }

  const shuffled = [...PRESET_AVATARS]
    .map((avatar) => ({ avatar, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ avatar }) => avatar);

  return shuffled.slice(0, count);
};

export const toUserAvatar = (avatar: AvatarPreset): UserAvatar => ({
  type: "preset",
  value: avatar.id,
});
