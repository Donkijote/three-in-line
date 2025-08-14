type NavbarProps = {
  toggleDrawer: () => void;
};

export const Navbar = ({ toggleDrawer }: NavbarProps) => {
  return (
    <nav
      className={
        "flex flex-row h-16 px-16 gap-4 items-center border-b border-gray-200 shadow-xs"
      }
    >
      <button className={"cursor-pointer max-h-6"} onClick={toggleDrawer}>
        <span className="material-symbols-rounded">menu</span>
      </button>
      <h1
        className={
          "text-2xl block font-sans antialiased font-semibold leading-snug tracking-normal text-text"
        }
      >
        3 in Line
      </h1>
    </nav>
  );
};
