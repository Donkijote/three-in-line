import { Activity, type ComponentPropsWithoutRef } from "react";

import { H3, P, Small } from "@/ui/web/components/Typography";
import { cn } from "@/ui/web/lib/utils";

type FullPageLoaderProps = ComponentPropsWithoutRef<"div"> & {
  label?: string;
  message?: string;
  subMessage?: string;
};

export const FullPageLoader = ({
  label = "Loading",
  message = "",
  subMessage = "",
  className,
  ...props
}: FullPageLoaderProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-chart-2/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-border/60 bg-card/70 p-8 text-center shadow-[0_24px_60px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-2 border-primary/20" />
          <div className="absolute h-full w-full animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_rgba(0,0,0,0.25)]" />
        </div>

        <div className="space-y-2">
          <Small variant="label" className="text-primary/80">
            {label}
          </Small>
          <Activity
            name={"loading-message"}
            mode={message ? "visible" : "hidden"}
          >
            <H3 className="text-2xl font-bold tracking-tight">{message}</H3>
          </Activity>
          <Activity
            name={"loading-sub-message"}
            mode={subMessage ? "visible" : "hidden"}
          >
            <P className="text-sm text-muted-foreground">{subMessage}</P>
          </Activity>
        </div>
      </div>
    </div>
  );
};
