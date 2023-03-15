const GameOver = ({
  correctWord,
  points,
  inARow,
  startNewGame,
  setShowToplist,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center   bg-black p-12 bg-opacity-70 text-white  text-center rounded-xl">
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
  );
};

export default GameOver;
