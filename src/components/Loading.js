const Loading = ({ isLoading }) => {
  return (
    <div
      className={`${
        isLoading ? "opacity-100" : "pointer-events-none opacity-0"
      } absolute inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-500 uppercase`}
    >
      {isLoading && (
        <>
          <p className="loading-text absolute top-1/2 -mt-12 w-screen text-center text-lg text-white opacity-0">
            Du hade fel
          </p>
          <p className="loading-text absolute top-1/2 -mt-12 w-screen text-center text-lg text-white opacity-0">
            Kontrollerar hur fel
          </p>
          <p className="loading-text absolute top-1/2 -mt-12 w-screen text-center text-lg text-white opacity-0">
            Sparar
          </p>
        </>
      )}
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
