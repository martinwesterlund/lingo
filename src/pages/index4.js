import { useState, useEffect, useCallback } from "react";
import { keyboard } from "@/data/keyboard";

const index3 = () => {
  const [guess, setGuess] = useState("");

  const detectKeyPress = (e) => {
    if (
      [...keyboard[0], ...keyboard[1], ...keyboard[2]].includes(
        e.key.toUpperCase()
      )
    ) {
      setGuess((prevGuess) => prevGuess + e.key);
    } else if (e.key === "Backspace") {
      setGuess((prevGuess) => prevGuess.slice(0, -1));
    } else if (e.key === "Enter") {
      submitGuess();
    }
  };

  const submitGuess = useCallback(async () => {
    setGuess("");
  }, [guess]);

  useEffect(() => {
    document.addEventListener("keydown", detectKeyPress, true);
    return () => {
      document.removeEventListener("keydown", detectKeyPress, true);
    };
  }, [detectKeyPress]);

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div>Guess: {guess}</div>

      <div className="flex flex-col gap-y-1 sticky left-0 bottom-24">
        <div className="w-screen flex justify-center gap-x-1">
          {keyboard[0].map((button) => (
            <button
              key={button}
              className="bg-gray-100 w-10 h-10 md:h-12 md:w-12 rounded-lg"
              onClick={() => setGuess((prev) => prev + button.toLowerCase())}
            >
              {button}
            </button>
          ))}
        </div>
        <div className="w-screen flex justify-center gap-x-1">
          {keyboard[1].map((button) => (
            <button
              key={button}
              className="bg-gray-100 w-10 h-10 md:h-12 md:w-12 rounded-lg"
              onClick={() => setGuess((prev) => prev + button.toLowerCase())}
            >
              {button}
            </button>
          ))}
        </div>
        <div className="w-screen flex justify-center gap-x-1">
          {keyboard[2].map((button) => (
            <button
              key={button}
              className="bg-gray-100 w-10 h-10 md:h-12 md:w-12 rounded-lg"
              onClick={() => setGuess((prev) => prev + button.toLowerCase())}
            >
              {button}
            </button>
          ))}
          <button
            className="bg-gray-100 grid place-items-center w-20 rounded-lg "
            onClick={() => setGuess((prev) => prev.slice(0, -1))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
              />
            </svg>
          </button>
          <button
            className="bg-gray-100 grid place-items-center w-20  rounded-lg "
            onClick={(e) => submitGuess(e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default index3;
