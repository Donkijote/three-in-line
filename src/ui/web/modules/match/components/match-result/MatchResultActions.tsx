import { Home, RotateCcw, Shuffle } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/ui/web/components/ui/button";
import { cn } from "@/ui/web/lib/utils";

import type { ResultAccent } from "./MatchResultOverlay.types";

type MatchResultActionsProps = {
  accent: ResultAccent;
  primaryLabel: string;
  secondaryLabel: string;
  changeModeLabel: string;
  onPrimaryAction: () => void;
};

export const MatchResultActions = ({
  accent,
  primaryLabel,
  secondaryLabel,
  changeModeLabel,
  onPrimaryAction,
}: MatchResultActionsProps) => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    void navigate({ to: "/" });
  };

  const handleChangeMode = () => {
    void navigate({ to: "/play" });
  };

  return (
    <div className="grid w-full gap-3">
      <Button
        className={cn(
          "h-12 rounded-full text-sm font-semibold uppercase tracking-widest",
          {
            "bg-primary text-primary-foreground": accent === "primary",
            "bg-destructive text-destructive-foreground hover:bg-destructive/70":
              accent === "destructive",
          },
        )}
        onClick={onPrimaryAction}
      >
        <RotateCcw className="size-4" />
        {primaryLabel}
      </Button>
      <Button
        variant="secondary"
        className="h-12 rounded-full text-sm tracking-widest"
        onClick={handleChangeMode}
      >
        <Shuffle className="size-4" />
        {changeModeLabel}
      </Button>
      <Button
        variant="outline"
        className="h-12 rounded-full text-sm tracking-widest"
        onClick={handleBackHome}
      >
        <Home className="size-4" />
        {secondaryLabel}
      </Button>
    </div>
  );
};
