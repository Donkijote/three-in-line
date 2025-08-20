import { ThemeToggle } from "@/layout/component/ThemeToggle";

type NavbarProps = {
  toggleDrawer: () => void;
};

export const Navbar = ({ toggleDrawer }: NavbarProps) => {
  return (
    <nav
      className={
        "flex h-16 flex-row items-center justify-between border-b border-white/10 bg-navbar-bg px-16 py-2 text-navbar-text shadow-md"
      }
      data-testid="navbar"
    >
      <div className={"flex items-center gap-2 text-lg font-bold"}>
        <button
          className={"max-h-6 cursor-pointer text-text"}
          onClick={toggleDrawer}
          data-testid="toggle-sidebar"
        >
          <span className="material-symbols-rounded">menu</span>
        </button>
        <h1
          className={
            "block font-sans text-2xl leading-snug font-semibold tracking-normal text-text antialiased"
          }
        >
          3 in Line
        </h1>
      </div>
      <ThemeToggle />
    </nav>
  );
};
