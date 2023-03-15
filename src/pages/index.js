import { useState, useEffect, useCallback } from "react";
import { keyboard } from "@/data/keyboard";
import { words } from "@/data/words";
import ConfettiExplosion from "react-confetti-explosion";
import { MongoClient } from "mongodb";
import Toplist from "@/components/Toplist";
import ScoreHighlight from "@/components/ScoreHighlight";
import Loading from "@/components/Loading";
import Name from "@/components/Name";
import Splash from "@/components/Splash";
import Keyboard from "@/components/Keyboard";
import GameField from "@/components/GameField";
import GameOver from "@/components/GameOver";
import Header from "@/components/Header";
import NextWord from "@/components/NextWord";
import Overlay from "@/components/Overlay";
import GuessedWordDisplay from "@/components/GuessedWordDisplay";

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
  const [showGameField, setShowGameField] = useState(false);
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
    setShowGameField(true);
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
      if ((words.filter((word) => word.toLowerCase() == guess).length > 0) && (guess.charAt(0) === correctWord.charAt(0))) {
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
    setSounds([
      new Audio("./correctletter.mp3"),
      new Audio("./presentletter.mp3"),
      new Audio("./wrongletter.mp3"),
    ]);
  }, []);

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
        setShowGameField(true);
      }, 3000);
    }
    startNewGame();
  }, []);

  return (
    <div
      className={`bg w-screen h-screen relative overflow-hidden flex flex-col items-center transition-all duration-700`}
    >
      <Loading isLoading={isLoading} />
      <Overlay showNameMenu={showNameMenu} showToplist={showToplist} />
      {isExploding && (
        <>
          <div className="absolute top-28 left-1/2 -translate-x-1/2">
            <ConfettiExplosion particleCount={50} particleSize={25} />
          </div>
          <ScoreHighlight score={highlightScore} />
        </>
      )}
      <Header
        isExploding={isExploding}
        points={points}
        inARow={inARow}
        setShowToplist={setShowToplist}
        setShowNameMenu={setShowNameMenu}
      />
      <Toplist
        toplist={toplist}
        inARowToplist={inARowToplist}
        showToplist={showToplist}
        setShowToplist={setShowToplist}
      />
      <Name name={name} showNameMenu={showNameMenu} saveName={saveName} />
      {gameField && showGameField && <GameField gameField={gameField} />}
      <GuessedWordDisplay guess={guess} />
      {isExploding && <NextWord initGameField={initGameField} />}
      <Keyboard
        keyboard={keyboard}
        setName={setName}
        setGuess={setGuess}
        submitGuess={submitGuess}
        saveName={saveName}
        showErrorAnimation={showErrorAnimation}
        showNameMenu={showNameMenu}
      />
      {showCorrectWord && (
        <GameOver
          correctWord={correctWord}
          points={points}
          inARow={inARow}
          startNewGame={startNewGame}
          setShowToplist={setShowToplist}
        />
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
