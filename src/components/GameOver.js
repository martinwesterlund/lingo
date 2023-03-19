const GameOver = ({
  correctWord,
  points,
  inARow,
  startNewGame,
  setShowToplist,
}) => {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center   rounded-xl bg-black bg-opacity-70 p-12  text-center text-white">
      <p className=" mb-1 whitespace-nowrap">Rätt ord:</p>
      <p className="mb-6 flex">
        {correctWord.split("").map((l, index) => (
          <span
            key={index}
            className="circle--correct mx-1 grid h-8  w-8 place-items-center rounded-full text-lg font-bold uppercase text-white"
          >
            {l}
          </span>
        ))}
      </p>
      <p className=" mb-2 flex items-center whitespace-nowrap">
        Du fick
        <span className="circle--correct mx-1 grid h-8 min-w-[2rem]  place-items-center rounded-full px-2 text-lg font-bold uppercase text-white">
          {points}
        </span>
        poäng
      </p>
      <p className=" flex items-center whitespace-nowrap">
        Du hade
        <span className="circle--correct mx-1 grid h-8 min-w-[2rem]  place-items-center rounded-full px-2 text-lg font-bold uppercase text-white">
          {inARow}
        </span>
        rätt i rad
      </p>
      <button
        aria-label="Starta nytt spel"
        className="mt-4 rounded-full border border-black bg-[#25a525] px-4 py-3 text-white"
        onClick={startNewGame}
      >
        Nytt spel
      </button>
      <button
        aria-label="Visa topplistan"
        className="mt-4 rounded-full border border-black bg-[#25a525] px-4 py-3 text-white"
        onClick={() => setShowToplist(true)}
      >
        Topplistan
      </button>
    </div>
  );
};

export default GameOver;
