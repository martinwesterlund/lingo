import { motion } from "framer-motion";

const GameField = ({ gameField }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 1, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto mt-2 grid h-[80vw] max-h-[24rem] w-[80vw] max-w-sm grid-cols-5 grid-rows-5 gap-[2px] sm:h-[70vw] sm:w-[70vw]"
      >
        {gameField.map((s, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`circle  grid place-items-center rounded-full text-4xl font-bold uppercase text-white  ${
              s.correct ? "circle--correct" : ""
            } ${s.semiCorrect ? "p-[2px]" : ""}`}
          >
            <div
              className={`grid h-full w-full place-items-center text-2xl sm:text-4xl ${
                s.semiCorrect ? "rounded-full border-4 border-[#e3ff0b]" : ""
              }`}
            >
              {s.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="w-[80vw] sm:w-[70vw]">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: "100%",
            transition: {
              delay: 2,
            },
          }}
          className="my-6 mx-auto h-px max-w-sm bg-gray-700"
        ></motion.div>
      </div>
    </>
  );
};

export default GameField;
