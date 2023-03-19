const NextWord = ({ initGameField, isExploding }) => {
  return (
    <div className={`absolute bottom-0 ${isExploding ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-[1500ms] left-0 z-20 h-[33vh] w-screen bg-gradient-to-t from-black `}>
      <button disabled={!isExploding}
        className="absolute bottom-24 left-1/2 mt-4 -translate-x-1/2 rounded-full border border-white bg-[#25a525] px-4 py-3 text-white"
        onClick={initGameField}
      >
        Nästa ord
      </button>
    </div>
  );
};

export default NextWord;
