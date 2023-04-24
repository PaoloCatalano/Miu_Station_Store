import React from "react";

export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-5xl md:text-6xl font-bold mb-10 text-blue-400">
      {children}
    </h1>
  );
}
