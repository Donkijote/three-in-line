import { clsx } from "clsx";

type SidebarProps = {
  isOpen: boolean;
};

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <div
      className={clsx(
        "fixed left-0 flex h-[calc(100dvh)] w-full max-w-[20rem] flex-col rounded-xl bg-background bg-clip-border p-4 text-text shadow-xl shadow-gray-900/5 transition-transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
      )}
    >
      <div className="p-4 mb-2">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal ">
          Matches History
        </h5>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal">
        <div
          role="button"
          className="flex text-text items-center w-full p-3 cursor-pointer leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 "
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
          className="flex items-center text-text w-full p-3 cursor-pointer leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 "
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
