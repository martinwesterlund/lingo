import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { keyboard } from "@/data/keyboard";
import { words } from "@/data/words";
import ConfettiExplosion from "react-confetti-explosion";
import { MongoClient } from "mongodb";
import Toplist from "@/components/Toplist";
import ScoreHighlight from "@/components/ScoreHighlight";
import Loading from "@/components/Loading";
import Name from "@/components/Name";
import Splash from "@/components/Splash";

export default function Home({ toplistOne, toplistTwo }) {
  const [correctWord, setCorrectWord] = useState("");
  const [guess, setGuess] = useState("");
  const [gameField, setGameField] = useState();
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
  const scoreLadder = [10, 25, 50, 75, 100];

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [showNameMenu, setShowNameMenu] = useState(false);
  const [showGameField, setShowGameField] = useState(false)
  const [highlightScore, setHighlightScore] = useState();
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
    // console.log(newWord);
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
    sounds[num].currentTime = 0;
    sounds[num].play();
    num = num % sounds.length;
    if (num % 2 === 0) {
      sounds[num].currentTime = 0;
      sounds[num].play();
    }
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
        saveName();
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

  const saveName = () => {
    localStorage.setItem("lingoname", name);
    setShowNameMenu(false);
    setShowGameField(true)
  };

  const checkIfCorrectWord = (word) => {
    let wordToCheck = word.slice(0).slice(-5);
    if (wordToCheck.every((item) => item.correct === true)) {
      setIsExploding(true);
      setPoints((prev) => prev + scoreLadder[5 - round]);
      setHighlightScore(scoreLadder[5 - round]);
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
    if (
      localStorage.getItem("lingoname") === null ||
      localStorage.getItem("lingoname") === "Anonym"
    ) {
      setName("Anonym");
      setShowNameMenu(true);
    } else {
      setName(localStorage.getItem("lingoname"));
      setTimeout(() => {
        setShowGameField(true)
      }, 3000);
    }
    startNewGame();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 1, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div
      className={`w-screen h-screen relative overflow-hidden flex flex-col items-center bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-700`}
    >
      <Loading isLoading={isLoading} />

      <div
        className={`${
          showNameMenu || showToplist
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        } transition-opacity duration-500 fixed w-screen h-screen bg-black bg-opacity-50 backdrop-blur-md `}
      ></div>

      {isExploding && (
        <>
          <div className="absolute top-28 left-1/2 -translate-x-1/2">
            <ConfettiExplosion particleCount={50} particleSize={25} />
          </div>
          <ScoreHighlight score={highlightScore} />
        </>
      )}

      <motion.header
        className="relative w-full flex py-2 px-3 justify-center text-white "
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 3.5 }}
      >
        <div
          className={`text-white flex items-center ${
            isExploding ? "score-hl-2" : ""
          }`}
        >
          <div className="text-white mr-4 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>

            <span className="text-yellow-500">{points}</span>
          </div>
          <div className="text-white mr-1 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
              <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
            </svg>

            <span className="text-yellow-500">{inARow}</span>
          </div>
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
          className="w-12 h-12 flex justify-center items-center hover:text-gray-400"
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
      </motion.header>

      <Toplist
        toplist={toplist}
        inARowToplist={inARowToplist}
        showToplist={showToplist}
        setShowToplist={setShowToplist}
      />
      <Name name={name} showNameMenu={showNameMenu} saveName={saveName} />
      {(gameField && showGameField) && (
        <>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-5 grid-rows-5 w-[80vw] h-[80vw] sm:w-[70vw] sm:h-[70vw] max-w-sm max-h-[24rem] mx-auto gap-[2px] mt-6"
        >
          {gameField.map((s, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`circle  text-white font-bold grid place-items-center text-4xl uppercase rounded-full  ${
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
            </motion.div>
          ))}
        </motion.div>
        <div className="w-[80vw] sm:w-[70vw]">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: "100%",
              transition: {
                delay: 2,
              },
            }}
            className="h-px max-w-sm my-6 mx-auto bg-gray-700"
          ></motion.div>

        </div>
        </>
      )}
      
      <div className="grid grid-cols-5 place-items-center gap-1">
        {guess
          .slice(0, 5)
          .split("")
          .map((l, index) => (
            <span
              key={index}
              className="w-12 h-12 circle  text-white font-bold grid place-items-center text-2xl uppercase rounded-full"
            >
              {l}
            </span>
          ))}
        
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
      {showCorrectWord && (
          <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center   bg-black p-12 bg-opacity-50 text-white  text-center rounded-xl">
            <p className=" whitespace-nowrap mb-1">Rätt ord:</p>
            <p className="flex mb-6">
              {correctWord.split("").map((l, index) => (
                <span
                  key={index}
                  className="w-8 h-8 mx-1 circle--correct  text-white font-bold grid place-items-center text-lg uppercase rounded-full"
                >
                  {l}
                </span>
              ))}
            </p>
            <p className=" whitespace-nowrap flex items-center mb-2">
              Du fick
              <span className="min-w-[2rem] px-2 h-8 mx-1 circle--correct  text-white font-bold grid place-items-center text-lg uppercase rounded-full">
                {points}
              </span>
              poäng
            </p>
            <p className=" whitespace-nowrap flex items-center">
              Du hade
              <span className="min-w-[2rem] px-2 h-8 mx-1 circle--correct  text-white font-bold grid place-items-center text-lg uppercase rounded-full">
                {inARow}
              </span>
              rätt i rad
            </p>
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
      <Splash name={name} />
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
