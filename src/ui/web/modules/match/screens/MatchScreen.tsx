import { ArrowLeft } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { H3, Muted } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import { Header } from "@/ui/web/components/Header";

export const MatchScreen = () => {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-border/60 bg-card/80 p-6 text-center shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
      <Header
        title="Match"
        leftSlot={
          <Button asChild variant="ghost" size="icon-sm">
            <Link to="/play" aria-label="Go back">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="flex flex-col gap-2 text-center">
        <H3 className="text-xl">Match Lobby</H3>
        <Muted className="text-sm text-muted-foreground">
          Matchmaking and real-time play will live here.
        </Muted>
      </div>
    </section>
  );
};
