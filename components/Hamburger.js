import React from "react";

export default function Hamburger({ open = false }) {
  return (
    <div
      className={`fixed z-20 top-0 right-0 m-4 md:hidden select-none text-center w-11 h-14 transition-all cursor-pointer before:w-full before:h-2 before:bg-sky-600 before:block before:absolute before:rounded after:w-full after:h-2 after:bg-sky-600 after:block after:absolute after:rounded before:origin-left-top after:right-0 after:top-5 after:origin-right-top  ${
        open
          ? "before:animate-[topBar-open_1s_ease-in-out_forwards] after:animate-[bottomBar-open_1s_ease-in-out_forwards] "
          : "before:animate-[topBar-close_1s_ease-in-out_forwards] after:animate-[bottomBar-close_1s_ease-in-out_forwards] "
      }`}
    >
      <span
        className={`text-sky-600 block absolute bottom-[33px] left-[2px] text-sm  ${
          open
            ? "animate-[menuLabel-open_1s_ease-in_forwards]"
            : "animate-[menuLabel-close_1s_ease-in_forwards]"
        }`}
      >
        {/* bottom: -20px; */}
        MENU
      </span>
    </div>
  );
}
