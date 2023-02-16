import { useState, useEffect } from "react";
const index2 = () => {
  const [correctWord, setCorrectWord] = useState("lingo");
  const [guess, setGuess] = useState("");
  const [gameField, setGameField] = useState([]);

  const initGameField = async () => {
    return new Promise((resolve) => {
      let squares = [];
      for (let i = 0; i < 25; i++) {
        if (i == 0) {
          squares.push({
            value: correctWord.charAt(0),
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

  const startNewGame = async () => {
    await initGameField();
  };

  const checkCorrectLetters = async () => {
    let updatedValues = []
    for (let i = 0; i < 5; i++) {
      if(correctWord.charAt(i) === guess.charAt(i)){
        updatedValues.push({value: guess.charAt(i), correct: true})
      } else {
        updatedValues.push({value: guess.charAt(i), correct: false})
      }

    }
    return updatedValues
  }

  const checkSemiCorrectLetters = async (guess) => {
    let updatedValues = guess.filter(letter => !letter.correct)

    for (let i = 0; i < updatedValues.length; i++) {
      if(correctWord.includes(updatedValues[i])){
        updatedValues[i].semiCorrect = true
      }
      
    }
    return updatedValues
  }

  const submitGuess = async (e) => {
    e.preventDefault();
    let correctLetters = await checkCorrectLetters() 
    let semiCorrectLetters = await checkSemiCorrectLetters(correctLetters)
    setGuess("")
  };

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="grid grid-cols-5 grid-rows-5 w-[25vw] h-[25vw] mx-auto">
        {gameField.map((s, index) => (
          <div
            key={index}
            className="border border-black grid place-items-center text-4xl uppercase"
          >
            {s.value}
          </div>
        ))}
      </div>
      <div>Guess: {guess}</div>
      <form onSubmit={submitGuess}>
        <input
          onChange={(e) => setGuess(e.target.value)}
          className="border border-black"
          value={guess}
        />
        <input value="Gissa" type="submit" />
      </form>
    </div>
  );
};

export default index2;

{
  /* setCounter((prev) => prev + 3); */
}
