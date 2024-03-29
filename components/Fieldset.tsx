import React from "react";

export default function Fieldset({
  children,
  legend,
}: {
  children: React.ReactNode;
  legend: string;
}) {
  return (
    <fieldset className="flex flex-col gap-4  rounded border-2 border-slate-200 my-5 p-3 mx-auto bg-slate-50 shadow-md">
      <legend className="px-1 text-slate-500 select-none translate-y-[1.5px] first-letter:capitalize">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}
