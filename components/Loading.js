const Loading = () => {
  return (
    <div className="loading fixed top-0 left-0 z-40 w-full h-full text-center flex justify-center items-center  bg-slate-700/80">
      <svg width="205" height="250" viewBox="0 0 40 50">
        <polygon
          strokeWidth="1"
          stroke="#17a2b8"
          fill="none"
          points="1,1 40,1 40,40 1,40"
        ></polygon>
        {/* <polygon
          strokeWidth="1"
          stroke="#17a2b8"
          fill="none"
          points="20,10 30,20 20,30 10,20"
        ></polygon> */}
        <polygon
          strokeWidth="1"
          stroke="#17a2b8"
          fill="none"
          points="20,10 30,10 30,20 20,20"
        ></polygon>
        <polygon
          strokeWidth="1"
          stroke="#5dbecd"
          fill="none"
          points="10,20 20,20 20,30 10,30"
        ></polygon>
        <polygon
          strokeWidth="1"
          stroke="#107181"
          fill="none"
          points="25,25 35,25 35,35 25,35"
        ></polygon>
        <polygon
          strokeWidth="1"
          stroke="#a2dae3"
          fill="none"
          points="5,5 15,5 15,15 5,15"
        ></polygon>
        {/* <polygon
            strokeWidth="1"
            stroke="#a2dae3"
            fill="#a2dae3"
            points="15,15 25,15 25,25 15,25"
          ></polygon> */}
        <text fill="#fff" x="5" y="47">
          Loading
        </text>
      </svg>
    </div>
  );
};

export default Loading;
