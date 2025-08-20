import { clsx } from "clsx";

type SidebarProps = {
  isOpen: boolean;
};

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <div
      className={clsx(
        "fixed left-0 flex h-[calc(100dvh)] w-full max-w-[20rem] flex-col space-y-6 bg-sidebar-bg bg-clip-border p-4 text-sidebar-text shadow-xl shadow-gray-900/5 transition-transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
      )}
      data-testid="sidebar"
    >
      <div className="mb-2 p-4">
        <h2 className="tracking-white block font-sans text-xl leading-snug font-bold text-text antialiased">
          Matches History
        </h2>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 space-y-2 p-2 font-sans text-base font-normal">
        <button className="flex w-full cursor-pointer items-center rounded-lg p-3 text-start leading-tight text-text transition-all outline-none hover:bg-hover">
          <div className="mr-4 grid place-items-center">
            <span className="material-symbols-outlined text-primary">
              check
            </span>
          </div>
          Victory
        </button>
        <button className="flex w-full cursor-pointer items-center rounded-lg p-3 text-start leading-tight text-text transition-all outline-none hover:bg-hover">
          <div className="mr-4 grid place-items-center">
            <span className="material-symbols-outlined text-secondary">
              close
            </span>
          </div>
          Defeat
        </button>
      </nav>
    </div>
  );
};
