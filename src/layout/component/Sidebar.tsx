import { clsx } from "clsx";

type SidebarProps = {
  isOpen: boolean;
};

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <div
      className={clsx(
        "fixed left-0 flex h-[calc(100dvh)] w-full max-w-[20rem] flex-col bg-sidebar-bg text-sidebar-text bg-clip-border p-4 shadow-xl shadow-gray-900/5 transition-transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
      )}
    >
      <div className="p-4 mb-2">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-text">
          Matches History
        </h5>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal">
        <div
          role="button"
          className="flex text-text items-center w-full p-3 cursor-pointer leading-tight transition-all rounded-lg outline-none text-start hover:bg-hover"
        >
          <div className="grid mr-4 place-items-center">
            <span className="material-symbols-outlined text-primary">
              check
            </span>
          </div>
          Victory
        </div>
        <div
          role="button"
          className="flex items-center text-text w-full p-3 cursor-pointer leading-tight transition-all rounded-lg outline-none text-start hover:bg-hover"
        >
          <div className="grid mr-4 place-items-center">
            <span className="material-symbols-outlined text-secondary">
              close
            </span>
          </div>
          Defeat
        </div>
      </nav>
    </div>
  );
};
