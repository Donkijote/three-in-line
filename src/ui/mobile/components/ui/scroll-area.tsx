import type { ComponentProps } from "react";

import { ScrollView } from "react-native";

import { cn } from "@/ui/mobile/lib/utils";

type ScrollAreaProps = ComponentProps<typeof ScrollView> & {
  contentContainerClassName?: string;
};

export const ScrollArea = ({
  className,
  contentContainerClassName,
  ...props
}: ScrollAreaProps) => {
  return (
    <ScrollView
      className={cn("flex-1", className)}
      contentContainerClassName={cn("flex-grow", contentContainerClassName)}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
};
