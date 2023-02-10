import { useState, useEffect } from "react";
import { words } from "@/data/words";
import { keyboard } from "@/data/keyboard";
import ConfettiExplosion from "react-confetti-explosion";

export default function Home() {
  const [correctWord, setCorrectWord] = useState([]);

  const [guess, setGuess] = useState("");
  const [submittedGuess, setSubmittedGuess] = useState([]);
  const [round, setRound] = useState(0);
  const [gameSquares, setGameSquares] = useState([]);
  const [isExploding, setIsExploding] = useState(false);

  const [sounds, setSounds] = useState([]);
  // const sounds = [  new Audio('correctletter.mp3'),  new Audio('presentletter.mp3'),  new Audio('wrongletter.mp3')];

  // const [audioCorrect, setAudioCorrect] = useState(null);
  // const [audioPresent, setAudioPresent] = useState(null);
  // const [audioWrong, setAudioWrong] = useState(null);

  console.log(keyboard);
  useEffect(() => {
    setSounds([
      new Audio("./correctletter.mp3"),
      new Audio("./presentletter.mp3"),
      new Audio("./wrongletter.mp3"),
    ]);
  }, []);

  const correctLetterStyling =
    "w-full h-full grid place-items-center bg-[#25CE26] border-[5px] border-t-[#98E07E] border-l-[#98E07E] border-r-[#009F0C] border-b-[#009F0C] text-green-100";
  const includedLetterStyling =
    "w-full h-full grid place-items-center rounded-full bg-green-500 border-4 border-green-300 text-green-100";
  const defaultLetterStyling =
    "bg-[#121F8D] border-[5px] border-t-[#373DA4] border-l-[#373DA4] border-r-[#071054] border-b-[#071054] text-blue-100";

  const getWordFromDb = async () => {
    return new Promise((resolve) => {
      let fiveLetteredWords = words.filter((word) => word.length == 5);
      let word =
        fiveLetteredWords[
          Math.floor(Math.random() * fiveLetteredWords.length)
        ].toLowerCase();
      // let word = 'agent'
      console.log(word);

      let array = [];
      for (let i = 0; i < word.length; i++) {
        if (i == 0) {
          array.push({ value: word[i], correct: true });
        } else {
          array.push({ value: word[i], correct: false });
        }
      }
      resolve(array);
    });
  };

  const initGameField = async () => {
    setRound(1);
    setIsExploding(false);
    setGameSquares([]);
    setSubmittedGuess([]);
    let newWord = await getWordFromDb();
    setCorrectWord(newWord);
    console.log("Detta är det korrekta:", newWord);
    let arrayWithSquares = [];
    for (let i = 0; i < 25; i++) {
      if (i == 0) {
        arrayWithSquares.push({
          value: newWord[0].value,
          correct: true,
          presentInCorrectWord: false,
        });
      } else {
        arrayWithSquares.push({
          value: "",
          correct: false,
          presentInCorrectWord: false,
        });
      }
    }
    setGameSquares(arrayWithSquares);
  };

  const checkGuess = async () => {
    let array = [...submittedGuess];

    let correctCopy = structuredClone(correctWord);

    for (let index = 0; index < 5; index++) {
      ((index) => {
        if (splitWordToArray(guess)[index] == correctCopy[index].value) {
          array.push({
            value: splitWordToArray(guess)[index],
            correct: true,
            presentInCorrectWord: false,
          });
          correctCopy[index].correct = true;
        } else {
          array.push({
            value: splitWordToArray(guess)[index],
            correct: false,
            presentInCorrectWord: false,
          });
        }
      })(index);
    }
    let remainingLetters = correctCopy.filter((letter) => !letter.correct);
    console.log("Remaningletter", remainingLetters);
    console.log("Gissning", array);

    let lastGuess = array.slice(0).slice(-5);

    for (let index = 0; index < 5; index++) {
      if (
        remainingLetters.filter(
          (letter) =>
            lastGuess[index].value == letter.value && !lastGuess[index].correct
        ).length > 0
      ) {
        let idxObj = remainingLetters.findIndex((letter) => {
          return letter.value == lastGuess[index].value;
        });
        remainingLetters.splice(idxObj, 1);
        lastGuess[index].presentInCorrectWord = true;
      }
    }
    setGuess("");
    setSubmittedGuess(array);
    return array;
  };

  let currentSound = 0;

  function playSound(num) {
    sounds[num].currentTime = 0;
    sounds[num].play();

    num = num % sounds.length;

    if (num % 2 === 0) {
      sounds[num].currentTime = 0;
      sounds[num].play();
    }
  }

  const splitWordToArray = (word) => {
    return word.split("");
  };

  const presentWord = async (word, callback) => {
    console.log("WTBPRRR", word);
    for (let index = 0; index < 5; index++) {
      ((index) => {
        setTimeout(function () {
          setGameSquares((oldState) => {
            const newState = [...oldState];
            newState[index + round * 5 - 5] = word[index];
            if (word[index].correct) {
              // audioCorrect.play();
              playSound(0);
            } else if (word[index].presentInCorrectWord) {
              // audioPresent.play();
              playSound(1);
            } else {
              // audioWrong.play();
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

  const checkIfValid = async () => {
    console.log(guess);
    return new Promise((resolve) => {
      console.log(words.length);
      if (words.filter((word) => word.toLowerCase() == guess).length > 0) {
        resolve();
      } else {
        console.log("fel");
        resetGuessFromSquares();
      }
    });
  };

  const checkIfCorrectWord = (word) => {
    let wordToCheck = word.slice(0).slice(-5);
    console.log(wordToCheck);
    if (wordToCheck.every((item) => item.correct === true)) {
      setIsExploding(true);
      setTimeout(() => {
        initGameField();
      }, 2000);
    }
  };

  const submitGuess = async () => {
    setGuess("");
    setRound(round + 1);
    // await checkIfValid()
    let wordToBePresented = await checkGuess();
    await presentWord(wordToBePresented.slice(0).slice(-5), checkIfCorrectWord);
  };

  const resetGuessFromSquares = () => {
    let temporarySquares = structuredClone(gameSquares);
    console.log(correctWord);
    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        temporarySquares[i + round * 5 - 5].value = correctWord[0].value;
      } else temporarySquares[i + round * 5 - 5].value = "";
    }
    setGameSquares(temporarySquares);
  };

  useEffect(() => {
    if (guess.length > 0 && round < 6) {
      let temporarySquares = structuredClone(gameSquares);
      for (let i = 0; i < 5; i++) {
        temporarySquares[i + round * 5 - 5].value = splitWordToArray(guess)[i];
      }
      setGameSquares(temporarySquares);
    }
  }, [guess]);

  useEffect(() => {
    initGameField();
  }, []);

  useEffect(() => {}, [submittedGuess]);

  return (
    <div className="w-screen h-screen grid place-items-center bg-gradient-to-tr from-yellow-900 to-yellow-600">
      {/* <span>{round}</span> */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2">
        {isExploding && (
          <ConfettiExplosion particleCount={50} particleSize={25} />
        )}
      </div>
      <div className="w-[90%] h-[90vw] sm:w-1/2 sm:h-[50vw] md:w-1/3 md:h-[33vw] grid grid-cols-5 grid-rows-5 gap-[4px] bg-[#69709B] p-1">
        {gameSquares.map((square, index) => (
          <div
            className={`relative grid p-0 place-items-center blur-[0.4px] uppercase text-4xl font-extrabold ${
              square.correct ? correctLetterStyling : defaultLetterStyling
            }`}
            key={index}
          >
            <div
              className={`drop-shadow-md  ${
                square.presentInCorrectWord ? includedLetterStyling : ""
              }`}
            >
              {square.value}
            </div>
          </div>
        ))}
      </div>
      {/* <input
        pattern="I[A-Za-z]{4}"
        title="Input must start with 'B' and be 5 letters long"
        className="border-2 border-black invalid:border-red-600"
        onChange={(e) => setGuess(e.target.value.toLowerCase())}
      />
      <div>{guess}</div>
      <button onClick={() => submitGuess()} className="bg-green-300 p-4">
        Gissa!
      </button> */}
      <div className="flex flex-col gap-y-1 sticky left-0 bottom-24">
      <div className="w-screen flex justify-center gap-x-1">
        {keyboard[0].map((button) => (
          <button
            key={button}
            className="bg-gray-100 w-10 h-10 md:h-12 md:w-12 rounded-lg"
            onClick={() => setGuess(guess + button.toLowerCase())}
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
            onClick={() => setGuess(guess + button.toLowerCase())}
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
            onClick={() => setGuess(guess + button.toLowerCase())}
          >
            {button}
          </button>
        ))}
        <button
          className="bg-gray-100 grid place-items-center w-20 rounded-lg "
          onClick={() => setGuess(guess.slice(0, -1))}
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
          onClick={() => submitGuess()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

        </button>
      </div>
      </div>
    </div>
  );
};
