import type { ComponentProps } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Text } from "@/ui/mobile/components/ui/text";
import { cn } from "@/ui/mobile/lib/utils";

type TypographyProps = ComponentProps<typeof Text>;

const H1 = ({ className, children, ...props }: TypographyProps) => (
  <Text
    variant="h1"
    className={cn("text-4xl font-extrabold tracking-tight", className)}
    {...props}
  >
    {children}
  </Text>
);

const H2 = ({ className, children, ...props }: TypographyProps) => (
  <Text
    variant="h2"
    className={cn(
      "border-b border-border pb-2 text-3xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </Text>
);

const H3 = ({ className, children, ...props }: TypographyProps) => (
  <Text
    variant="h3"
    className={cn("text-2xl font-semibold tracking-tight", className)}
    {...props}
  >
    {children}
  </Text>
);

const H4 = ({ className, children, ...props }: TypographyProps) => (
  <Text
    variant="h4"
    className={cn("text-xl font-semibold tracking-tight", className)}
    {...props}
  >
    {children}
  </Text>
);

const H5 = ({ className, children, ...props }: TypographyProps) => (
  <Text
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  >
    {children}
  </Text>
);

const H6 = ({ className, children, ...props }: TypographyProps) => (
  <Text
    className={cn("text-base font-semibold tracking-tight", className)}
    {...props}
  >
    {children}
  </Text>
);

const P = ({ className, children, ...props }: TypographyProps) => (
  <Text className={cn("leading-7", className)} {...props}>
    {children}
  </Text>
);

const Lead = ({ className, children, ...props }: TypographyProps) => (
  <Text
    variant="lead"
    className={cn("text-xl text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Text>
);

const Blockquote = ({ className, children, ...props }: TypographyProps) => (
  <Text
    className={cn("border-l-2 border-border pl-6 italic", className)}
    {...props}
  >
    {children}
  </Text>
);

const InlineCode = ({ className, children, ...props }: TypographyProps) => (
  <Text
    className={cn(
      "rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className,
    )}
    {...props}
  >
    {children}
  </Text>
);

const smallVariants = cva("leading-none", {
  variants: {
    variant: {
      default: "text-sm font-medium",
      label: "text-xs font-semibold uppercase tracking-widest",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Small = ({
  className,
  children,
  variant,
  ...props
}: TypographyProps & VariantProps<typeof smallVariants>) => (
  <Text className={cn(smallVariants({ variant }), className)} {...props}>
    {children}
  </Text>
);

const Muted = ({ className, children, ...props }: TypographyProps) => (
  <Text
    variant="muted"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Text>
);

export {
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  InlineCode,
  Lead,
  Muted,
  P,
  Small,
};
