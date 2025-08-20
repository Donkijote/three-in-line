import { useEffect, useState } from "react";

interface UserSettings {
  name: string;
  difficulty: "easy" | "hard";
}

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");

  useEffect(() => {
    const stored = localStorage.getItem("userSettings");
    if (!stored) {
      setIsOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;

    const settings: UserSettings = { name, difficulty };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 space-y-8 rounded-xl bg-background p-6 text-text shadow-lg">
        <div className={"justify-centers flex flex-col items-center gap-2"}>
          <p className={"text-center"}>👋</p>
          <h2 className="text-center text-xl font-bold">Welcome</h2>
          <h3 className="text-center text-lg font-semibold">Tic Tac Toe</h3>
        </div>
        <p className="text-center text-sm opacity-80">
          Enter your name and choose difficulty
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-grid bg-transparent px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />

        <div className="flex justify-between">
          <button
            onClick={() => setDifficulty("easy")}
            className={`mx-1 flex-1 cursor-pointer rounded-lg px-3 py-2 ${
              difficulty === "easy"
                ? "bg-primary text-white"
                : "border border-grid"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className={`mx-1 flex-1 cursor-pointer rounded-lg px-3 py-2 ${
              difficulty === "hard"
                ? "bg-secondary text-white"
                : "border border-grid"
            }`}
          >
            Hard
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full cursor-pointer rounded-lg bg-emerald-500 py-2 font-semibold text-white transition hover:bg-emerald-600"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
