const Overlay = ({ showNameMenu, showToplist }) => {
  return (
    <div
      className={`${
        showNameMenu || showToplist
          ? "opacity-100"
          : "pointer-events-none opacity-0"
      } fixed h-screen w-screen bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-500 `}
    ></div>
  );
};

export default Overlay;
