import type { PropsWithChildren } from "react";

export const AppLayout = ({ children }: PropsWithChildren) => (
  <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
    {children}
  </main>
);
