const Loading = ({ simple = false }) => {
  return (
    <>
      {simple ? (
        <div className="fixed bottom-4 right-4 spinner grid w-20 aspect-square rounded-full blur-[2px] before:blur-[3px] after:blur-sm z-50"></div>
      ) : (
        <div className="fixed top-0 left-0 z-40 w-full h-full text-center flex flex-col justify-center items-center  bg-slate-700/80">
          <div className="spinner w-20 grid aspect-square rounded-full blur-[2px] before:blur-[3px] after:blur-sm"></div>
          <h1 className="mt-4 uppercase font-bold text-4xl text-white animate-pulse">
            Loading
          </h1>
        </div>
      )}
    </>
  );
};

export default Loading;
