import type { ComponentProps } from "react";

import { ActivityIndicator, View } from "react-native";

import { H3, P, Small } from "@/ui/mobile/components/Typography";
import { cn } from "@/ui/mobile/lib/utils";

type FullPageLoaderProps = ComponentProps<typeof View> & {
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
    <View
      className={cn(
        "relative flex-1 items-center justify-center overflow-hidden bg-background px-6 py-12",
        className,
      )}
      {...props}
    >
      <View className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <View className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-chart-2/25 blur-3xl" />
      <View className="pointer-events-none absolute inset-x-0 top-20 h-px bg-primary/30" />

      <View className="relative z-10 w-full max-w-sm gap-6 rounded-3xl border border-border/60 bg-card/70 px-8 py-8 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.35)]">
        <View className="items-center justify-center">
          <View className="relative size-16 items-center justify-center">
            <View className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <View className="absolute size-3 rounded-full bg-primary shadow-[0_0_18px_rgba(0,0,0,0.25)]" />
            <ActivityIndicator size="large" color="hsl(158 76% 40%)" />
          </View>
        </View>

        <View className="items-center gap-2">
          <Small variant="label" className="text-primary/80">
            {label}
          </Small>
          {message ? (
            <H3 className="text-center text-2xl font-bold tracking-tight">
              {message}
            </H3>
          ) : null}
          {subMessage ? (
            <P className="mt-0 text-center text-sm leading-6 text-muted-foreground">
              {subMessage}
            </P>
          ) : null}
        </View>
      </View>
    </View>
  );
};
