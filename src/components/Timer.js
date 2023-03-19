import { useState, useEffect } from "react";

const Timer = ({ time, setTime, isRunning }) => {
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (time) => {
    const seconds = Math.floor(time);
    return `${seconds.toString().padStart(2, "0")}`;
  };

  const seconds = Math.floor(time / 1000);
  const hundredths = Math.floor((time % 1000) / 10);
  return (
    <div className="mx-auto flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mr-2 h-6 w-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <div className="min-w-[4rem] text-center text-yellow-500">
        <span>{formatTime(seconds)}</span>
        <span>:</span>
        <span>{formatTime(hundredths)}</span>
      </div>
    </div>
  );
};

export default Timer;
