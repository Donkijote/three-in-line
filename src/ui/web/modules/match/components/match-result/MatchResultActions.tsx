import { Home, RotateCcw } from "lucide-react";

import { Button } from "@/ui/web/components/ui/button";
import { cn } from "@/ui/web/lib/utils";

import type { ResultAccent } from "./MatchResultOverlay.types";

type MatchResultActionsProps = {
  accent: ResultAccent;
  primaryLabel: string;
  secondaryLabel: string;
  onNavigate: () => void;
};

export const MatchResultActions = ({
  accent,
  primaryLabel,
  secondaryLabel,
  onNavigate,
}: MatchResultActionsProps) => {
  return (
    <div className="grid w-full gap-3">
      <Button
        className={cn(
          "h-12 rounded-full text-sm font-semibold uppercase tracking-widest",
          {
            "bg-primary text-primary-foreground": accent === "primary",
            "bg-destructive text-destructive-foreground":
              accent === "destructive",
          },
        )}
        onClick={onNavigate}
      >
        <RotateCcw className="size-4" />
        {primaryLabel}
      </Button>
      <Button
        variant="outline"
        className="h-12 rounded-full text-sm tracking-widest"
        onClick={onNavigate}
      >
        <Home className="size-4" />
        {secondaryLabel}
      </Button>
    </div>
  );
};
