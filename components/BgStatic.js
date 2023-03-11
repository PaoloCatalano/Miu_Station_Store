import React from "react";

export default function BgStatic() {
  return (
    <>
      <div className="fading-bg fixed inset-0 h-screen -z-40 "></div>
      <div className="fixed inset-0 bg-fixed -z-50  bg-[url('/images/bg/lines.png')] bg-cover animate-fade-in"></div>
    </>
  );
}
