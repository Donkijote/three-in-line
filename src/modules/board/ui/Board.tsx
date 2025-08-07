const arr = Array.from({ length: 9 }, (_, i) => i % 2);

export const Board = () => {
  return (
    <div className="flex h-[calc(100dvh-8rem)] w-full justify-start flex-col gap-12">
      <div className={"flex flex-col gap-4 items-center"}>
        <h1 className={"text-4xl font-light text-gray-700"}>Your Turn!</h1>
        <h2 className={"font-light text-gray-700"}>Name vs Bot Name</h2>
      </div>
      <div
        className={
          "xs:max-md:px-0 md:max-lg:px-32 lg:max-xl:px-60 xl:max-2xl:px-90 2xl:px-96"
        }
      >
        <div
          className={
            "grid grid-flow-row grid-cols-3 h-[calc(100dvh-18rem)] bg-black gap-1 max-h-[800px] max-w-[1200px] m-auto"
          }
        >
          {arr.map((item, index) => (
            <button
              key={`${index}-${item}`}
              className={
                "flex bg-white justify-center items-center cursor-pointer"
              }
            >
              <span className="material-symbols-rounded !text-7xl md:max-xl:!text-8xl xl:max-2xl:!text-8xl 2xl:!text-9xl">
                {item ? "close" : "radio_button_unchecked"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
