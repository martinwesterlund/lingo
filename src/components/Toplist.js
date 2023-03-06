const Toplist = ({ toplist, inARowToplist, showToplist, setShowToplist }) => {
  return (
    <div
      className={`w-screen h-screen z-30 sm:w-[50vw] xl:w-[25vw] bg-gray-900 text-white fixed ${
        showToplist ? "left-0 sm:left-1/2 xl:left-3/4" : "left-full"
      } transition-all ease-in-out duration-500 top-0 p-6 pt-12 overflow-y-auto`}
    >
      <h1 className="text-center">Topplista</h1>
      <button
        className="absolute top-6 right-6"
        onClick={() => setShowToplist(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2>Poäng</h2>
      <ul>
        {toplist &&
          toplist.map((item, index) => (
            <li
              className="w-full bg-gray-800 my-1 px-2 flex justify-between"
              key={item._id}
            >
              <span>
                {index + 1}. {item.name}
              </span>{" "}
              <span className="text-yellow-500">{item.points}p</span>
            </li>
          ))}
      </ul>
      <h2 className="mt-12">Ord i rad</h2>
      <ul>
        {inARowToplist &&
          inARowToplist.map((item, index) => (
            <li
              className="w-full bg-gray-800 my-1 px-2 flex justify-between"
              key={item._id}
            >
              <span>
                {index + 1}. {item.name}
              </span>{" "}
              <span className="text-yellow-500">{item.inARow}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Toplist;
