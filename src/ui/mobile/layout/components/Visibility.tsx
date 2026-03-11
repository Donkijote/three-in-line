import type { PropsWithChildren } from "react";

type VisibilityProps = PropsWithChildren<{
  visible: boolean;
}>;

export const Visibility = ({ visible, children }: VisibilityProps) => {
  if (!visible) {
    return null;
  }

  return <>{children}</>;
};
