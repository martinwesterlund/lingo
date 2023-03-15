const Keyboard = ({
  keyboard,
  setName,
  setGuess,
  submitGuess,
  saveName,
  showErrorAnimation,
  showNameMenu,
}) => {
  return (
    <div
      className={`absolute bottom-16 flex w-full flex-col gap-y-1 px-2 text-xs sm:text-base md:bottom-1  ${
        showErrorAnimation ? "wrong-word" : ""
      }`}
    >
      <div className="flex w-full justify-center gap-x-1">
        {keyboard[0].map((button) => (
          <button
            key={button}
            className="h-[8vw] w-[8vw] rounded-md bg-gray-100 sm:h-12 sm:w-12 sm:rounded-lg"
            onClick={() =>
              showNameMenu
                ? setName((prev) => (prev + button.toUpperCase()).slice(0, 20))
                : setGuess((prev) => (prev + button.toLowerCase()).slice(0, 5))
            }
          >
            {button}
          </button>
        ))}
      </div>
      <div className="flex w-full justify-center gap-x-1">
        {keyboard[1].map((button) => (
          <button
            key={button}
            className="h-[8vw] w-[8vw] rounded-md bg-gray-100 sm:h-12 sm:w-12 sm:rounded-lg"
            onClick={() =>
              showNameMenu
                ? setName((prev) => (prev + button.toUpperCase()).slice(0, 20))
                : setGuess((prev) => (prev + button.toLowerCase()).slice(0, 5))
            }
          >
            {button}
          </button>
        ))}
      </div>
      <div className="flex w-full justify-center gap-x-1">
        {keyboard[2].map((button) => (
          <button
            key={button}
            className="h-[8vw] w-[8vw] rounded-md bg-gray-100 sm:h-12 sm:w-12 sm:rounded-lg"
            onClick={() =>
              showNameMenu
                ? setName((prev) => (prev + button.toUpperCase()).slice(0, 20))
                : setGuess((prev) => (prev + button.toLowerCase()).slice(0, 5))
            }
          >
            {button}
          </button>
        ))}
        <button
          className="grid h-[8vw] w-[calc(16vw+4px)] place-items-center rounded-md bg-gray-100 sm:h-12 sm:w-[calc(6rem+4px)] sm:rounded-lg"
          onClick={() =>
            showNameMenu
              ? setName((prev) => prev.slice(0, -1))
              : setGuess((prev) => prev.slice(0, -1))
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 sm:h-6 sm:w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
            />
          </svg>
        </button>
        <button
          className="grid h-[8vw] w-[calc(16vw+4px)] place-items-center rounded-md bg-gray-100 sm:h-12 sm:w-[calc(6rem+4px)] sm:rounded-lg"
          onClick={(e) => (showNameMenu ? saveName() : submitGuess(e))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 sm:h-6 sm:w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <button
        className={`bg-gray-100 ${
          showNameMenu ? "h-[8vw] sm:h-12" : "h-0"
        } mx-auto my-0 w-[calc(56vw+24px)] rounded-md transition-all duration-500 ease-in-out sm:w-[calc(21rem+24px)] sm:rounded-lg`}
        onClick={(e) => setName((prev) => (prev + " ").slice(0, 20))}
      ></button>
    </div>
  );
};

export default Keyboard;
