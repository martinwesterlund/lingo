const GuessedWordDisplay = ({ guess }) => {
  return (
    <div className="grid grid-cols-5 place-items-center gap-1">
      {guess
        .slice(0, 5)
        .split("")
        .map((l, index) => (
          <span
            key={index}
            className="circle grid h-8 w-8 place-items-center rounded-full text-lg font-bold uppercase text-white"
          >
            {l}
          </span>
        ))}
    </div>
  );
};

export default GuessedWordDisplay;
