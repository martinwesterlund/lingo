const Overlay = ({ showNameMenu, showToplist }) => {
  return (
    <div
      className={`${
        showNameMenu || showToplist
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      } transition-opacity duration-500 fixed w-screen h-screen bg-black bg-opacity-50 backdrop-blur-md `}
    ></div>
  );
};

export default Overlay;
