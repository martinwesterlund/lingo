import { useState } from "react";

const Toplist = ({ toplist, inARowToplist, showToplist, setShowToplist }) => {
  const [listToShow, setListToShow] = useState("points");

  return (
    <div
      className={`w-screen h-screen z-30 sm:w-[50vw] xl:w-[25vw] bg-gray-900 text-white fixed ${
        showToplist ? "left-0 sm:left-1/2 xl:left-3/4" : "left-full"
      } transition-all ease-in-out duration-500 top-0 p-6 overflow-y-auto`}
    >
      <h1 className="mb-8 text-shadow text-center">Topp 10</h1>
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
      <div className="text-center mb-6">
        <button
          className={`
            ${
              listToShow === "points"
                ? "text-yellow-500 border rounded-full px-4 py-1"
                : "text-gray-500"
            } w-32`}
          onClick={() => setListToShow("points")}
        >
          <h2>Poäng</h2>
        </button>
        <button
          className={`
          ${
            listToShow === "inARow"
              ? "text-yellow-500 border rounded-full px-4 py-1"
              : "text-gray-500"
          } w-32`}
          onClick={() => setListToShow("inARow")}
        >
          <h2>Ord i rad</h2>
        </button>
      </div>
      {listToShow === "points" && (
        <ul className=" text-sm">
          {toplist &&
            toplist.map((item, index) => (
              <li
                className="w-full relative bg-gray-800 my-1 px-12 py-2 flex justify-between"
                key={item._id}
              >
                <span className="absolute left-2 top-1/2 -translate-y-1/2 border w-6 h-6 rounded-full grid place-items-center">
                  {index + 1}
                </span>
                <span>{item.name}</span>
                <div className="text-yellow-500 flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2 absolute right-0 top-1/2 -translate-y-[55%]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item.points}
                </div>
              </li>
            ))}
        </ul>
      )}
      {listToShow === "inARow" && (
        <ul className=" text-sm">
          {inARowToplist &&
            inARowToplist.map((item, index) => (
              <li
                className="w-full relative bg-gray-800 my-1 px-12 py-2 flex justify-between"
                key={item._id}
              >
                <span className="absolute left-2 top-1/2 -translate-y-1/2 border w-6 h-6 rounded-full grid place-items-center">
                  {index + 1}
                </span>
                <span>{item.name}</span>
                <div className="text-yellow-500 flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2 absolute right-0 top-1/2 -translate-y-[55%]"
                  >
                    <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                    <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                  </svg>
                  {item.inARow}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Toplist;
