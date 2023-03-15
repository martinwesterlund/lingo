const NextWord = ({ initGameField }) => {
  return (
    <button
      className="mt-4 rounded-full border border-black bg-[#25a525] px-4 py-3 text-white"
      onClick={initGameField}
    >
      Nästa ord
    </button>
  );
};

export default NextWord;
