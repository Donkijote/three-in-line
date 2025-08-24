import botsNames from "@/data/bot_names.json";

export const getBotName = () => {
  const randomIndex = Math.floor(Math.random() * botsNames.length);
  return botsNames[randomIndex];
};
