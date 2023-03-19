const Name = ({ name, showNameMenu, saveName }) => {
  return (
    <div
      className={`fixed ${
        showNameMenu ? "top-0" : " -top-32"
      } left-0 flex h-32 w-full items-center justify-center bg-gray-900 text-white transition-all duration-500 ease-in-out`}
    >
      Ditt namn: <span className="ml-4 uppercase"> {name}</span>{" "}
      <span className="marker ml-px h-6 w-px bg-white"></span>
      <button
        aria-label={`Spara namn`}
        className="absolute right-8 bottom-6 text-green-500"
        onClick={() => saveName()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Name;
