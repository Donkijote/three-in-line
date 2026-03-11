import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import type { HeaderProps } from "@/ui/mobile/components/Header";

type MobileHeaderContextValue = {
  header: HeaderProps | null;
  setHeader: (header: HeaderProps | null) => void;
};

const MobileHeaderContext = createContext<MobileHeaderContextValue | null>(
  null,
);

export const useMobileHeader = () => {
  const context = useContext(MobileHeaderContext);
  if (!context) {
    throw new Error("useMobileHeader must be used within MobileHeaderProvider");
  }
  return context;
};

export const MobileHeaderProvider = ({ children }: PropsWithChildren) => {
  const [header, setHeader] = useState<HeaderProps | null>(null);
  const value = useMemo<MobileHeaderContextValue>(
    () => ({
      header,
      setHeader,
    }),
    [header],
  );

  return (
    <MobileHeaderContext.Provider value={value}>
      {children}
    </MobileHeaderContext.Provider>
  );
};
