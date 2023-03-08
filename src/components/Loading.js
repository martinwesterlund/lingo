const Loading = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center bg-black bg-opacity-50 p-24">
      <p className="text-white text-2xl">Laddar...</p>
      <div className=" flex justify-center fill-white ">
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
