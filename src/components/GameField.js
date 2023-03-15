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
        className="grid grid-cols-5 grid-rows-5 w-[80vw] h-[80vw] sm:w-[70vw] sm:h-[70vw] max-w-sm max-h-[24rem] mx-auto gap-[2px] mt-6"
      >
        {gameField.map((s, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`circle  text-white font-bold grid place-items-center text-4xl uppercase rounded-full  ${
              s.correct ? "circle--correct" : ""
            } ${s.semiCorrect ? "p-[2px]" : ""}`}
          >
            <div
              className={`w-full h-full grid place-items-center text-2xl sm:text-4xl ${
                s.semiCorrect ? "border-[#e3ff0b] border-4 rounded-full" : ""
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
          className="h-px max-w-sm my-6 mx-auto bg-gray-700"
        ></motion.div>
      </div>
    </>
  );
};

export default GameField;
