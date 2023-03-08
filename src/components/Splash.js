import { motion } from "framer-motion";

const Splash = ({ name }) => {
  const letters = ["L", "I", "N", "G", "O"];
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
    hidden: { opacity: 1, scale: 0, y: -100 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 2, delay: 1.5, ease: [0.71, 0.04, 0.13, 0.95] }}
      className="absolute w-screen h-screen flex flex-col justify-center items-center bg-gray-900 shadow-md text-white z-50"
    >
      {letters && (
        <motion.div
          className="flex"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {letters.map((l, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`circle circle--correct w-8 h-8 md:w-16 md:h-16 border-black border text-white font-bold grid place-items-center text-xl md:text-4xl uppercase rounded-full mx-1`}
            >
              {l}
            </motion.div>
          ))}
        </motion.div>
      )}
      {name !== null && name !== "Anonym" && (
        <p className="text-white mt-12">Välkommen tillbaka {name}!</p>
      )}
    </motion.div>
  );
};

export default Splash;
