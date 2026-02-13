import { ScrollText } from "lucide-react";

import { P } from "@/ui/web/components/Typography";

export function HomeScreen() {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4 text-center no-offset">
      <div className="flex size-20 items-center justify-center rounded-full border bg-card">
        <ScrollText className="size-10 text-foreground/80" />
      </div>
      <P className="text-lg font-semibold text-muted-foreground">
        No more logs found
      </P>
    </div>
  );
}
