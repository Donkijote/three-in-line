import { ThemeToggle } from "@/layout/component/ThemeToggle";

type NavbarProps = {
  toggleDrawer: () => void;
};

export const Navbar = ({ toggleDrawer }: NavbarProps) => {
  return (
    <nav
      className={
        "flex flex-row h-16 px-16 gap-4 items-center bg-navbar-bg w-full text-navbar-text shadow"
      }
    >
      <div className={"flex items-center gap-4"}>
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
      <div className={"ml-auto"}>
        <ThemeToggle />
      </div>
    </nav>
  );
};
