import React from "react";

export default function A({ children }: { children: React.ReactNode }) {
  return (
    <div className="underline underline-offset-8 text-lg first-letter:capitalize text-miu-500 hover:text-miu-600 transition">
      {children}
    </div>
  );
}
