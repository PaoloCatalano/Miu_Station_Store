import React from "react";

export default function SkeletonProfile() {
  return (
    <section className="my-3 md:w-full md:max-w-xl ">
      <div className="flex flex-col items-center mt-4">
        <div className="w-44 h-6 bg-slate-300 rounded-lg animate-pulse"></div>
        <div className="rounded-full w-40 h-40 mt-4 bg-slate-300 animate-pulse"></div>
      </div>
      <div className="w-full flex flex-wrap items-center justify-center md:justify-between ">
        <div className="my-5 mx-5 w-[270px] h-[358px] bg-slate-300 rounded-lg animate-pulse md:mx-0"></div>
        <div className="my-5 mx-5 w-[270px] h-[358px] bg-slate-300 rounded-lg animate-pulse md:mx-0"></div>
      </div>
    </section>
  );
}
