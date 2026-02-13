export type HomeStat = {
  id: string;
  label: string;
  value: string;
  accent: "primary" | "opponent" | "warning";
};

export type HomeMatchStatus = "victory" | "defeat" | "stalemate";

export type HomeMatch = {
  id: string;
  status: HomeMatchStatus;
  time: string;
  title: string;
  subtitle: string;
  opponentInitials: string;
};
