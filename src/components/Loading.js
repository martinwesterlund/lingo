import { motion } from "framer-motion";
const Loading = () => {
  return (
    <div className="absolute w-screen h-screen inset-0 bg-black bg-opacity-20 backdrop-blur-md flex flex-col justify-center items-center z-50">
      <p className="loading-text w-screen absolute top-1/2 text-center opacity-0 text-white text-lg -mt-12">
        Du hade fel
      </p>
      <p className="loading-text w-screen absolute top-1/2 text-center opacity-0 text-white text-lg -mt-12">
        Kontrollerar hur fel
      </p>
      <p className="loading-text w-screen absolute top-1/2 text-center opacity-0 text-white text-lg -mt-12">
        Sparar
      </p>
      <div className=" flex justify-center fill-white">
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20%" fill="current-color">
            <animate
              attributeName="fill-opacity"
              begin="0s"
              dur="500ms"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20%" fill="current-color">
            <animate
              attributeName="fill-opacity"
              begin="100ms"
              dur="500ms"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20%" fill="current-color">
            <animate
              attributeName="fill-opacity"
              begin="200ms"
              dur="500ms"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20%" fill="current-color">
            <animate
              attributeName="fill-opacity"
              begin="300ms"
              dur="500ms"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20%" fill="current-color">
            <animate
              attributeName="fill-opacity"
              begin="400ms"
              dur="500ms"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default Loading;
