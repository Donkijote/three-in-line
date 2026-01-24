import type { ReactNode } from "react";

import { Small } from "@/ui/web/components/Typography";
import { cn } from "@/ui/web/lib/utils";

type HeaderProps = {
  title: string;
  eyebrow?: string;
  leftSlot?: ReactNode;
};

export const Header = ({ title, eyebrow, leftSlot }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-center border-b border-border/60 bg-background/90 backdrop-blur">
      {leftSlot ? (
        <div className="absolute left-0 flex items-center">{leftSlot}</div>
      ) : null}
      <div className="flex flex-col items-center text-center">
        {eyebrow ? (
          <Small className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary/80">
            {eyebrow}
          </Small>
        ) : null}
        <Small
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.2em]",
            eyebrow ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {title}
        </Small>
      </div>
    </header>
  );
};
