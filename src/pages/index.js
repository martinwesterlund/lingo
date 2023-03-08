import { useState, useEffect, useCallback } from "react";
import { keyboard } from "@/data/keyboard";
import { words } from "@/data/words";
import ConfettiExplosion from "react-confetti-explosion";
import { MongoClient } from "mongodb";
import Toplist from "@/components/Toplist";
import Loading from "@/components/Loading";
import Name from "@/components/Name";

export default function Home({ toplistOne, toplistTwo }) {
  const [correctWord, setCorrectWord] = useState("");
  const [guess, setGuess] = useState("");
  const [gameField, setGameField] = useState([]);
  const [round, setRound] = useState(1);
  const [showCorrectWord, setShowCorrectWord] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);
  const [playLocked, setPlayLocked] = useState(true);
  const [correctState, setCorrectState] = useState([
    { correct: true },
    { correct: false },
    { correct: false },
    { correct: false },
    { correct: false },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [showNameMenu, setShowNameMenu] = useState(false);
  const [points, setPoints] = useState(0);
  const [inARow, setInARow] = useState(0);
  const [toplist, setToplist] = useState(toplistOne);
  const [inARowToplist, setInARowToplist] = useState(toplistTwo);

  const [showToplist, setShowToplist] = useState(false);

  const [isExploding, setIsExploding] = useState(false);

  const [sounds, setSounds] = useState([]);

  const sendScoreToDatabase = async (data) => {
    const response = await fetch("/api/new-score", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
      },
    });
    return response;
  };

  const getToplists = async () => {
    const response = await fetch("/api/get-toplist", {
      method: "GET",
      headers: {
        "content-Type": "application/json",
      },
    });
    return response;
  };

  useEffect(() => {
    setSounds([
      new Audio("./correctletter.mp3"),
      new Audio("./presentletter.mp3"),
      new Audio("./wrongletter.mp3"),
    ]);
  }, []);

  const initGameField = async () => {
    setRound(1);
    setCorrectState([
      { correct: true },
      { correct: false },
      { correct: false },
      { correct: false },
      { correct: false },
    ]);
    setShowCorrectWord(false);
    setIsExploding(false);
    setPlayLocked(false);
    let newWord = await getWordFromDb();
    setCorrectWord(newWord);
    return new Promise((resolve) => {
      let squares = [];
      for (let i = 0; i < 25; i++) {
        if (i == 0) {
          squares.push({
            value: newWord.charAt(0),
            correct: true,
            presentInCorrectWord: false,
          });
        } else {
          squares.push({
            value: "",
            correct: false,
            presentInCorrectWord: false,
          });
        }
      }
      setGameField(squares);
      resolve();
    });
  };

  const getWordFromDb = async () => {
    return new Promise((resolve) => {
      let fiveLetteredWords = words.filter((word) => word.length == 5);
      let word =
        fiveLetteredWords[
          Math.floor(Math.random() * fiveLetteredWords.length)
        ].toLowerCase();
      resolve(word);
    });
  };

  const startNewGame = async () => {
    await initGameField();
    setPoints(0);
    setInARow(0);
  };

  const checkGuess = async (guess, word) => {
    const result = [];
    const correctIndexes = [];
    let semiCorrectIndexes = [];

    // Check for correct letters in correct positions
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === word[i]) {
        result.push({ value: guess[i], correct: true, semiCorrect: false });
        correctIndexes.push(i);
        const newState = [...correctState];
        newState[i].correct = true;
        setCorrectState(newState);
      } else {
        result.push({ value: guess[i], correct: false, semiCorrect: false });
      }
    }

    // Check for semi-correct letters
    for (let i = 0; i < guess.length; i++) {
      if (!correctIndexes.includes(i)) {
        for (let j = 0; j < word.length; j++) {
          if (
            !correctIndexes.includes(j) &&
            guess[i] === word[j] &&
            !semiCorrectIndexes.includes(j)
          ) {
            result[i].semiCorrect = true;
            semiCorrectIndexes.push(j);
            break;
          }
        }
      }
    }
    return result;
  };

  const playSound = (num) => {
    // sounds[num].currentTime = 0;
    // sounds[num].play();
    // num = num % sounds.length;
    // if (num % 2 === 0) {
    //   sounds[num].currentTime = 0;
    //   sounds[num].play();
    // }
  };

  const detectKeyPress = (e) => {
    if (showNameMenu) {
      if (
        [...keyboard[0], ...keyboard[1], ...keyboard[2]].includes(
          e.key.toUpperCase()
        )
      ) {
        setName((prevName) => (prevName + e.key.toUpperCase()).slice(0, 20));
      } else if (e.key == "Backspace") {
        setName((prevName) => prevName.slice(0, -1));
      } else if (e.key == "Enter") {
        localStorage.setItem("lingoname", name)
        setShowNameMenu(false);
      } else if (e.key == " ") {
        setName((prevName) => (prevName + " ").slice(0, 20));
      }
    } else {
      if (
        [...keyboard[0], ...keyboard[1], ...keyboard[2]].includes(
          e.key.toUpperCase()
        )
      ) {
        setGuess((prevGuess) => (prevGuess + e.key.toLowerCase()).slice(0, 5));
      } else if (e.key == "Backspace") {
        setGuess((prevGuess) => prevGuess.slice(0, -1));
      } else if (e.key == "Enter") {
        setGuess((prevGuess) => prevGuess);
        submitGuess(e);
      }
    }
  };

  const checkIfCorrectWord = (word) => {
    let wordToCheck = word.slice(0).slice(-5);
    if (wordToCheck.every((item) => item.correct === true)) {
      setIsExploding(true);
      setPoints((prev) => prev + (6 - round));
      setInARow((prev) => prev + 1);
    } else {
      setTimeout(() => {
        showCorrectLetters(wordToCheck);
      }, 500);
    }
  };

  const checkIfValid = async () => {
    return new Promise((resolve) => {
      if (words.filter((word) => word.toLowerCase() == guess).length > 0) {
        setPlayLocked(true);
        resolve();
      } else {
        setShowErrorAnimation(true);
        setTimeout(() => {
          setShowErrorAnimation(false);
        }, 300);
        setGuess("");
      }
    });
  };

  const presentWord = async (word, callback) => {
    for (let index = 0; index < 5; index++) {
      ((index) => {
        setTimeout(function () {
          setGameField((oldState) => {
            const newState = [...oldState];
            newState[index + round * 5 - 5] = word[index];
            if (word[index].correct) {
              playSound(0);
            } else if (word[index].semiCorrect) {
              playSound(1);
            } else {
              playSound(2);
            }
            return newState;
          });
          if (index == 4) {
            callback(word);
          }
        }, index * 250);
      })(index);
    }
  };

  const showCorrectLetters = (checkedWord) => {
    if (round < 5) {
      for (let index = 0; index < 5; index++) {
        setGameField((oldState) => {
          const newState = [...oldState];
          newState[index + (round + 1) * 5 - 5] = checkedWord[index];
          if (correctState[index].correct) {
            newState[index + (round + 1) * 5 - 5] = {
              value: correctWord.charAt(index),
              correct: false,
            };
          } else {
            newState[index + (round + 1) * 5 - 5] = {
              value: "",
              correct: false,
            };
          }

          return newState;
        });
      }
      setPlayLocked(false);
    } else {
      showCorrectAnswer();
    }
  };

  const showCorrectAnswer = async () => {
    setIsLoading(true);
    let response = await sendScoreToDatabase({
      name: name,
      points: points,
      inARow: inARow,
    });
    if (response.ok) {
      let response2 = await getToplists();
      if (response2.ok) {
        const result = await response2.json();
        setToplist(result.toplist);
        setInARowToplist(result.inARowToplist);
        setIsLoading(false);
        setShowCorrectWord(true);
      }
    }
  };

  const submitGuess = useCallback(async () => {
    if (!playLocked) {
      await checkIfValid();
      let checkedWord = await checkGuess(guess, correctWord);
      await presentWord(checkedWord, checkIfCorrectWord);
      setGuess("");
      setRound((prev) => prev + 1);
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", detectKeyPress, true);
    return () => {
      document.removeEventListener("keydown", detectKeyPress, true);
    };
  }, [detectKeyPress]);

  useEffect(() => {
    if(!localStorage.getItem("lingoname")){
      setName('Anonym')
      setShowNameMenu(true)
    } else {
      setName(localStorage.getItem("lingoname"))
    };
    startNewGame();
  }, []);

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex flex-col items-center bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-700`}
    >
      {isLoading && <Loading />}
      <div
        className={`${
          showNameMenu || showToplist
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        } transition-opacity duration-500 fixed w-screen h-screen bg-black bg-opacity-50 backdrop-blur-md `}
      ></div>

      <div className="absolute top-28 left-1/2 -translate-x-1/2">
        {isExploding && (
          <ConfettiExplosion particleCount={50} particleSize={25} />
        )}
      </div>
      <header className="relative w-full flex py-2 px-3 justify-center text-white ">
        <div className="text-white flex items-center">
          <span className="w-16 bg-white text-black px-4 py-1 -rotate-6 rounded-sm mr-1 text-center">
            {points}p
          </span>
          <span className="w-16 bg-white text-black px-4 py-1 -rotate-6 text-center">
            {inARow}
          </span>
        </div>
        <button
          onClick={() => setShowToplist(true)}
          className="w-12 h-12 flex justify-center ml-auto items-center text-white hover:text-gray-400"
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
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </button>
        <button
          className="w-12 h-12 flex justify-center items-center"
          onClick={() => setShowNameMenu(true)}
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
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </button>
      </header>

      <Toplist
        toplist={toplist}
        inARowToplist={inARowToplist}
        showToplist={showToplist}
        setShowToplist={setShowToplist}
      />
      <Name
        name={name}
        showNameMenu={showNameMenu}
        setShowNameMenu={setShowNameMenu}
      />
      <div className="grid grid-cols-5 grid-rows-5 w-[80vw] h-[80vw] sm:w-[70vw] sm:h-[70vw] max-w-sm max-h-[24rem] mx-auto gap-[2px] mt-6">
        {gameField.map((s, index) => (
          <div
            key={index}
            className={`circle border-black border text-white font-bold grid place-items-center text-4xl uppercase rounded-full  ${
              s.correct ? "circle--correct" : ""
            } ${s.semiCorrect ? "p-[2px]" : ""}`}
          >
            <div
              className={`w-full h-full grid place-items-center text-2xl sm:text-4xl ${
                s.semiCorrect ? "border-[#e3ff0b] border-4 rounded-full" : ""
              }`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <span className="w-[80vw] sm:w-[70vw] max-w-sm h-px my-6 bg-gray-700"></span>

      <div className="grid grid-cols-5 place-items-center gap-1">
        {guess
          .slice(0, 5)
          .split("")
          .map((l, index) => (
            <span
              key={index}
              className="w-12 h-12 circle border-black border text-white font-bold grid place-items-center text-2xl uppercase rounded-full"
            >
              {l}
            </span>
          ))}
        {/* {showCorrectWord &&
          correctWord.split("").map((l, index) => (
            <span
              key={index}
              className="w-12 h-12 circle--correct border-black border text-white font-bold grid place-items-center text-2xl uppercase rounded-full"
            >
              {l}
            </span>
          ))} */}
        {showCorrectWord && (
          <div className="absolute top-1/2 left-1/2 flex flex-col justify-center items-center -translate-x-1/2 -translate-y-1/2  bg-black p-12 bg-opacity-80 text-white  text-center rounded-xl">
            <p className=" whitespace-nowrap mb-1">Rätt ord:</p>
            <p className="flex mb-6">
              {correctWord.split("").map((l, index) => (
                <span
                  key={index}
                  className="w-8 h-8 circle--correct border-black border text-white font-bold grid place-items-center text-lg uppercase rounded-full"
                >
                  {l}
                </span>
              ))}
            </p>
            <p className=" whitespace-nowrap flex items-center">Du fick <span className="w-8 h-8 mx-1 circle--correct border-black border text-white font-bold grid place-items-center text-lg uppercase rounded-full">{points}</span> poäng</p>
            <p className=" whitespace-nowrap flex items-center">Du hade <span className="w-8 h-8 mx-1 circle--correct border-black border text-white font-bold grid place-items-center text-lg uppercase rounded-full">{inARow}</span> rätt i rad</p>
            <button
              className="bg-[#25a525] text-white px-4 py-3 rounded-full border border-black mt-4"
              onClick={startNewGame}
            >
              Nytt spel
            </button>
            <button
              className="bg-[#25a525] text-white px-4 py-3 rounded-full border border-black mt-4"
              onClick={() => setShowToplist(true)}
            >
              Topplistan
            </button>
          </div>
        )}
      </div>
      {isExploding && (
        <button
          className="bg-[#25a525] text-white px-4 py-3 rounded-full border border-black mt-4"
          onClick={initGameField}
        >
          Nästa ord
        </button>
      )}
      <div
        className={`w-full flex flex-col gap-y-1 absolute bottom-1 px-2 text-xs sm:text-base  ${
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
                  ? setName((prev) =>
                      (prev + button.toUpperCase()).slice(0, 20)
                    )
                  : setGuess((prev) =>
                      (prev + button.toLowerCase()).slice(0, 5)
                    )
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
                  ? setName((prev) =>
                      (prev + button.toUpperCase()).slice(0, 20)
                    )
                  : setGuess((prev) =>
                      (prev + button.toLowerCase()).slice(0, 5)
                    )
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
                  ? setName((prev) =>
                      (prev + button.toUpperCase()).slice(0, 20)
                    )
                  : setGuess((prev) =>
                      (prev + button.toLowerCase()).slice(0, 5)
                    )
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
            onClick={(e) =>
              showNameMenu ? setShowNameMenu(false) : submitGuess(e)
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
    </div>
  );
}

export async function getStaticProps() {
  try {
    const mongoClient = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI);
    const db = mongoClient.db("Toplist");

    const toplist = await db
      .collection("Toplist")
      .find({})
      .sort({ points: -1 })
      .limit(10)
      .toArray();

    const inARowToplist = await db
      .collection("Toplist")
      .find({})
      .sort({ inARow: -1 })
      .limit(10)
      .toArray();

    return {
      props: {
        toplistOne: JSON.parse(JSON.stringify(toplist)),
        toplistTwo: JSON.parse(JSON.stringify(inARowToplist)),
      },
      revalidate: 10,
    };
  } catch (e) {
    console.error(e);
  }
}
