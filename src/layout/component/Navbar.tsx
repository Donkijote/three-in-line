import { ThemeToggle } from "@/layout/component/ThemeToggle";

type NavbarProps = {
  toggleDrawer: () => void;
};

export const Navbar = ({ toggleDrawer }: NavbarProps) => {
  return (
    <nav
      className={
        "bg-navbar-bg h-16 px-16 text-navbar-text flex flex-row items-center justify-between py-2 shadow-md border-b border-white/10"
      }
    >
      <div className={"flex items-center gap-2 font-bold text-lg"}>
        <button
          className={"cursor-pointer max-h-6 text-text"}
          onClick={toggleDrawer}
        >
          <span className="material-symbols-rounded">menu</span>
        </button>
        <h1
          className={
            "text-2xl block font-sans antialiased font-semibold leading-snug tracking-normal text-text"
          }
        >
          3 in Line
        </h1>
      </div>
      <ThemeToggle />
    </nav>
  );
};
