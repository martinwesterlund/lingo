import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { keyboard } from "@/data/keyboard";
import { words } from "@/data/words";
import ConfettiExplosion from "react-confetti-explosion";
import { MongoClient } from 'mongodb'





export default function Home({toplist}) {
//   const [correctWord, setCorrectWord] = useState("");
//   const [guess, setGuess] = useState("");
//   const [gameField, setGameField] = useState([]);
//   const [round, setRound] = useState(1);
//   const [showCorrectWord, setShowCorrectWord] = useState(false);
//   const [showErrorAnimation, setShowErrorAnimation] = useState(false);
//   const [playLocked, setPlayLocked] = useState(true);
//   const [correctState, setCorrectState] = useState([
//     { correct: true },
//     { correct: false },
//     { correct: false },
//     { correct: false },
//     { correct: false },
//   ]);

//   const [points, setPoints] = useState(0)
//   const [inARow, setInARow] = useState(0)

//   const [isExploding, setIsExploding] = useState(false);

//   const [sounds, setSounds] = useState([]);

//   const addScore = async (data) => {
//     console.log(data)
//     const response = await fetch("/api/new-score", {
//         method: "POST", 
//         body: JSON.stringify(data),
//         headers: {
//             "content-Type" : "application/json"
//         }
//     }) 
//     const res = await response.json()
//     router.push("/")
// }
  

//   useEffect(() => {
//     setSounds([
//       new Audio("./correctletter.mp3"),
//       new Audio("./presentletter.mp3"),
//       new Audio("./wrongletter.mp3"),
//     ]);
//   }, []);

//   const initGameField = async () => {
//     setRound(1);
//     setCorrectState([
//       { correct: true },
//       { correct: false },
//       { correct: false },
//       { correct: false },
//       { correct: false },
//     ]);
//     setShowCorrectWord(false);
//     setIsExploding(false);
//     setPlayLocked(false);
//     let newWord = await getWordFromDb();
//     setCorrectWord(newWord);
//     return new Promise((resolve) => {
//       let squares = [];
//       for (let i = 0; i < 25; i++) {
//         if (i == 0) {
//           squares.push({
//             value: newWord.charAt(0),
//             correct: true,
//             presentInCorrectWord: false,
//           });
//         } else {
//           squares.push({
//             value: "",
//             correct: false,
//             presentInCorrectWord: false,
//           });
//         }
//       }
//       setGameField(squares);
//       resolve();
//     });
//   };

//   const getWordFromDb = async () => {
//     return new Promise((resolve) => {
//       let fiveLetteredWords = words.filter((word) => word.length == 5);
//       let word =
//         fiveLetteredWords[
//           Math.floor(Math.random() * fiveLetteredWords.length)
//         ].toLowerCase();
//         console.log(word)
//       resolve(word);
//     });
//   };

//   const startNewGame = async () => {
//     await initGameField();
//     setPoints(0)
//     setInARow(0)
//   };

//   const checkGuess = async (guess, word) => {
//     const result = [];
//     const correctIndexes = [];
//     let semiCorrectIndexes = [];

//     // Check for correct letters in correct positions
//     for (let i = 0; i < guess.length; i++) {
//       if (guess[i] === word[i]) {
//         result.push({ value: guess[i], correct: true, semiCorrect: false });
//         correctIndexes.push(i);
//         const newState = [...correctState];
//         newState[i].correct = true;
//         setCorrectState(newState);
//       } else {
//         result.push({ value: guess[i], correct: false, semiCorrect: false });
//       }
//     }

//     // Check for semi-correct letters
//     for (let i = 0; i < guess.length; i++) {
//       if (!correctIndexes.includes(i)) {
//         for (let j = 0; j < word.length; j++) {
//           if (
//             !correctIndexes.includes(j) &&
//             guess[i] === word[j] &&
//             !semiCorrectIndexes.includes(j)
//           ) {
//             result[i].semiCorrect = true;
//             semiCorrectIndexes.push(j);
//             break;
//           }
//         }
//       }
//     }
//     return result;
//   };

//   const playSound = (num) => {
//     sounds[num].currentTime = 0;
//     sounds[num].play();

//     num = num % sounds.length;

//     if (num % 2 === 0) {
//       sounds[num].currentTime = 0;
//       sounds[num].play();
//     }
//   };

//   const detectKeyPress = (e) => {
//     if (
//       [...keyboard[0], ...keyboard[1], ...keyboard[2]].includes(
//         e.key.toUpperCase()
//       )
//     ) {
//       setGuess((prevGuess) => (prevGuess + e.key.toLowerCase()).slice(0, 5));
//     } else if (e.key == "Backspace") {
//       setGuess((prevGuess) => prevGuess.slice(0, -1));
//     } else if (e.key == "Enter") {
//       setGuess((prevGuess) => prevGuess);
//       submitGuess(e);
//     }
//   };

//   const checkIfCorrectWord = (word) => {
//     let wordToCheck = word.slice(0).slice(-5);
//     if (wordToCheck.every((item) => item.correct === true)) {
//       setIsExploding(true);
//       setPoints((prev) => prev + (6 - round))
//       setInARow((prev) => prev + 1)
//     } else {
//       setTimeout(() => {
//         showCorrectLetters(wordToCheck);
//       }, 2000);
//     }
//   };

//   const checkIfValid = async () => {
//     return new Promise((resolve) => {
//       if (words.filter((word) => word.toLowerCase() == guess).length > 0) {
//         setPlayLocked(true);
//         resolve();
//       } else {
//         setShowErrorAnimation(true);
//         setTimeout(() => {
//           setShowErrorAnimation(false);
//         }, 300);
//         setGuess("");
//       }
//     });
//   };

//   const presentWord = async (word, callback) => {
//     for (let index = 0; index < 5; index++) {
//       ((index) => {
//         setTimeout(function () {
//           setGameField((oldState) => {
//             const newState = [...oldState];
//             newState[index + round * 5 - 5] = word[index];
//             if (word[index].correct) {
//               playSound(0);
//             } else if (word[index].semiCorrect) {
//               playSound(1);
//             } else {
//               playSound(2);
//             }
//             return newState;
//           });
//           if (index == 4) {
//             callback(word);
//           }
//         }, index * 250);
//       })(index);
//     }
//   };

//   const showCorrectLetters = (checkedWord) => {
//     if (round < 5) {
//       for (let index = 0; index < 5; index++) {
//         setGameField((oldState) => {
//           const newState = [...oldState];
//           newState[index + (round + 1) * 5 - 5] = checkedWord[index];
//           if (correctState[index].correct) {
//             newState[index + (round + 1) * 5 - 5] = {
//               value: correctWord.charAt(index),
//               correct: false,
//             };
//           } else {
//             newState[index + (round + 1) * 5 - 5] = {
//               value: "",
//               correct: false,
//             };
//           }

//           return newState;
//         });
//       }
//       setPlayLocked(false);
//     } else {
//       showCorrectAnswer();
//     }
//   };

//   const showCorrectAnswer = () => {
//     setShowCorrectWord(true);
//   };

//   const submitGuess = useCallback(async () => {
//     if (!playLocked) {
//       await checkIfValid();
//       let checkedWord = await checkGuess(guess, correctWord);
//       await presentWord(checkedWord, checkIfCorrectWord);
//       setGuess("");
//       setRound((prev) => prev + 1);
//     }
//   });

//   useEffect(() => {
//     document.addEventListener("keydown", detectKeyPress, true);
//     return () => {
//       document.removeEventListener("keydown", detectKeyPress, true);
//     };
//   }, [detectKeyPress]);

//   useEffect(() => {
//     startNewGame();
//   }, []);

//   useEffect(() => {

//   }, []);

  return (
    <div className="w-screen h-screen p-2 flex flex-col items-center justify-center bg-[#17468d]">
      <Image className="object-cover w-full h-full" fill src="/error.jpg" /> 
      <div className="bg-black bg-opacity-60 text-white z-10 p-12">Site under construction</div>
      {/* <div className="absolute top-28 left-1/2 -translate-x-1/2">
        {isExploding && (
          <ConfettiExplosion particleCount={50} particleSize={25} />
        )}
      </div>
      <div className="grid grid-cols-5 grid-rows-5 w-[80vw] h-[80vw] max-w-sm max-h-[24rem] mx-auto gap-[2px]">
        {gameField.map((s, index) => (
          <div
            key={index}
            className={`circle border-black border text-white font-bold grid place-items-center text-4xl uppercase rounded-full  ${
              s.correct ? "circle--correct" : ""
            } ${s.semiCorrect ? "p-[2px]" : ""}`}
          >
            <div
              className={`w-full h-full grid place-items-center ${
                s.semiCorrect ? "border-[#e3ff0b] border-4 rounded-full" : ""
              }`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <span className="w-[80vw] h-px my-8 bg-yellow-500"></span>
      <div className="text-white">{points} p | {inARow} ord i rad</div>
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
        {showCorrectWord &&
          correctWord.split("").map((l, index) => (
            <span
              key={index}
              className="w-12 h-12 circle--correct border-black border text-white font-bold grid place-items-center text-2xl uppercase rounded-full"
            >
              {l}
            </span>
          ))}
      </div>
      {(isExploding) && (
        <button
          className="bg-[#25a525] text-white px-4 py-3 rounded-full border border-black mt-4"
          onClick={initGameField}
        >
          Nästa ord
        </button>
      )}
            {(showCorrectWord) && (
        <button
          className="bg-[#25a525] text-white px-4 py-3 rounded-full border border-black mt-4"
          onClick={startNewGame}
        >
          Nytt spel
        </button>
      )}
      <button onClick={() => addScore({name: 'Testare Testare', points: 666})} >Skicka poäng</button>
      <div
        className={`w-full flex flex-col gap-y-1 absolute bottom-16 sm:bottom-2 px-2 text-xs sm:text-base  ${
          showErrorAnimation ? "wrong-word" : ""
        }`}
      >
        <div className="w-full flex justify-center gap-x-1">
          {keyboard[0].map((button) => (
            <button
              key={button}
              className="bg-gray-100 w-[8vw] h-[8vw] sm:w-12 sm:h-12 rounded-md sm:rounded-lg"
              onClick={() =>
                setGuess((prev) => (prev + button.toLowerCase()).slice(0, 5))
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
                setGuess((prev) => (prev + button.toLowerCase()).slice(0, 5))
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
                setGuess((prev) => (prev + button.toLowerCase()).slice(0, 5))
              }
            >
              {button}
            </button>
          ))}
          <button
            className="bg-gray-100 grid place-items-center w-[calc(16vw+4px)] h-[8vw] sm:w-[calc(6rem+4px)] sm:h-12 rounded-md sm:rounded-lg"
            onClick={() => setGuess((prev) => prev.slice(0, -1))}
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
            onClick={(e) => submitGuess(e)}
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
      </div> */}
    </div>
  );
}

export async function getStaticProps() {
  // const mongoClient = new MongoClient('mongodb+srv://westerlundmartin:ebsuSGmpa4bxDS1R@lingo.iitlhda.mongodb.net/Toplist?retryWrites=true&w=majority')
  // const response = await mongoClient.db().collection('Toplist').find({}).toArray();
  // const toplist = await response.text()
  // console.log('Toplist ', toplist)

  // return {
  //   props: {
  //     toplist,
  //   },
  // }


  try {
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const db = mongoClient.db("Toplist");

    const toplist = await db
        .collection("Toplist")
        .find({})
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray();

    return {
        props: { toplist: JSON.parse(JSON.stringify(toplist)) },
    };
} catch (e) {
    console.error(e);
}
}