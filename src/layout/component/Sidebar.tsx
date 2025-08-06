export const Sidebar = () => {
  return (
    <div className="fixed left-0 flex h-[calc(100dvh)] w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-gray-900/5 transition-transform -translate-x-0">
      <div className="p-4 mb-2">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal ">
          Matches History
        </h5>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal">
        <div
          role="button"
          className="flex items-center w-full p-3 cursor-pointer leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <div className="grid mr-4 place-items-center">
            <span className="material-symbols-outlined text-green-400">
              check
            </span>
          </div>
          Victory
        </div>
        <div
          role="button"
          className="flex items-center w-full p-3 cursor-pointer leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <div className="grid mr-4 place-items-center">
            <span className="material-symbols-outlined text-red-500">
              close
            </span>
          </div>
          Defeat
        </div>
      </nav>
    </div>
  );
};
