import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/ui/web/lib/utils";

type TypographyProps<T extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T> & {
    className?: string;
    children?: ReactNode;
  };

const H1 = ({ className, children, ...props }: TypographyProps<"h1">) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

const H2 = ({ className, children, ...props }: TypographyProps<"h2">) => (
  <h2
    className={cn(
      "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
);

const H3 = ({ className, children, ...props }: TypographyProps<"h3">) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

const H4 = ({ className, children, ...props }: TypographyProps<"h4">) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h4>
);

const H5 = ({ className, children, ...props }: TypographyProps<"h5">) => (
  <h5
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h5>
);

const H6 = ({ className, children, ...props }: TypographyProps<"h6">) => (
  <h6
    className={cn(
      "scroll-m-20 text-base font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h6>
);

const P = ({ className, children, ...props }: TypographyProps<"p">) => (
  <p className={cn("leading-7 not-first:mt-6", className)} {...props}>
    {children}
  </p>
);

const Lead = ({ className, children, ...props }: TypographyProps<"p">) => (
  <p className={cn("text-xl text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

const Blockquote = ({
  className,
  children,
  ...props
}: TypographyProps<"blockquote">) => (
  <blockquote
    className={cn("mt-6 border-l-2 border-border pl-6 italic", className)}
    {...props}
  >
    {children}
  </blockquote>
);

const InlineCode = ({
  className,
  children,
  ...props
}: TypographyProps<"code">) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className,
    )}
    {...props}
  >
    {children}
  </code>
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
}: TypographyProps<"small"> & VariantProps<typeof smallVariants>) => (
  <small className={cn(smallVariants({ variant }), className)} {...props}>
    {children}
  </small>
);

const Muted = ({ className, children, ...props }: TypographyProps<"p">) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
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
