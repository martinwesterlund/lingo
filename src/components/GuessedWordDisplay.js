const GuessedWordDisplay = ({ guess }) => {
  return (
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
  );
};

export default GuessedWordDisplay;
