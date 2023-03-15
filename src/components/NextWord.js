const NextWord = ({ initGameField }) => {
  return (
    <button
      className="bg-[#25a525] text-white px-4 py-3 rounded-full border border-black mt-4"
      onClick={initGameField}
    >
      Nästa ord
    </button>
  );
};

export default NextWord;
