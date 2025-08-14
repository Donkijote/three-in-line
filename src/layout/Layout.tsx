import { useState } from "react";

import { Navbar } from "./component/Navbar";
import { Sidebar } from "./component/Sidebar";

export const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Navbar toggleDrawer={() => setIsOpen((prevState) => !prevState)} />
      <Sidebar isOpen={isOpen} />
    </>
  );
};
