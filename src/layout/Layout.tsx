import type { ReactNode } from "react";

import { Navbar } from "./component/Navbar";
import { Sidebar } from "./component/Sidebar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
};
