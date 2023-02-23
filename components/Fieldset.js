import React from "react";

export default function Fieldset({ children, legend }) {
  return (
    <fieldset className="max-w-[247.2px] flex flex-col gap-4  rounded border-2 border-slate-500 my-5 p-3 mx-auto shadow-md">
      <legend className="px-1 text-slate-600 select-none">{legend}</legend>
      {children}
    </fieldset>
  );
}
