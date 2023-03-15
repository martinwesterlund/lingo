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
      className={`w-full flex flex-col gap-y-1 absolute bottom-16 md:bottom-1 px-2 text-xs sm:text-base  ${
        showErrorAnimation ? "wrong-word" : ""
      }`}
    >
      <div className="w-full flex justify-center gap-x-1">
        {keyboard[0].map((button) => (
          <button
            key={button}
            className="bg-gray-100 w-[8vw] h-[8vw] sm:w-12 sm:h-12 rounded-md sm:rounded-lg"
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
      <div className="w-full flex justify-center gap-x-1">
        {keyboard[1].map((button) => (
          <button
            key={button}
            className="bg-gray-100 w-[8vw] h-[8vw] sm:w-12 sm:h-12 rounded-md sm:rounded-lg"
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
      <div className="w-full flex justify-center gap-x-1">
        {keyboard[2].map((button) => (
          <button
            key={button}
            className="bg-gray-100 w-[8vw] h-[8vw] sm:w-12 sm:h-12 rounded-md sm:rounded-lg"
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
          className="bg-gray-100 grid place-items-center w-[calc(16vw+4px)] h-[8vw] sm:w-[calc(6rem+4px)] sm:h-12 rounded-md sm:rounded-lg"
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
            className="w-4 h-4 sm:w-6 sm:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
            />
          </svg>
        </button>
        <button
          className="bg-gray-100 grid place-items-center w-[calc(16vw+4px)] h-[8vw] sm:w-[calc(6rem+4px)] sm:h-12 rounded-md sm:rounded-lg"
          onClick={(e) => (showNameMenu ? saveName() : submitGuess(e))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 sm:w-6 sm:h-6"
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
        } transition-all duration-500 ease-in-out w-[calc(56vw+24px)] sm:w-[calc(21rem+24px)] mx-auto rounded-md sm:rounded-lg my-0`}
        onClick={(e) => setName((prev) => (prev + " ").slice(0, 20))}
      ></button>
    </div>
  );
};

export default Keyboard;
