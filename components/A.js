import React from "react";

export default function A({ children }) {
  return (
    <div className="underline underline-offset-8 text-2xl first-letter:capitalize text-miu-500 hover:text-miu-600 transition">
      {children}
    </div>
  );
}
