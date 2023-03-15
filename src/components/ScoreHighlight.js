const ScoreHighlight = ({ score }) => {
  return (
    <div className="score-hl absolute top-1/2 left-1/2 text-[35vw] font-bold text-yellow-500 lg:text-[15vw]">
      +{score}
    </div>
  );
};

export default ScoreHighlight;
