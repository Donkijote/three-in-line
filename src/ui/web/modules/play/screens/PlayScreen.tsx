import { H1, P } from "@/ui/web/components/Typography";

export const PlayScreen = () => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm">
      <H1 className="text-2xl">Play</H1>
      <P className="text-sm text-muted-foreground">
        Game mode selection and matchmaking will live here.
      </P>
    </section>
  );
};
