import { useButton } from "@react-aria/button";
import { useRef } from "react";

export default function Button(props) {
  const { isDisabled, hipster, cta, className } = props;
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={` group
       bg-slate-400 p-2 text-slate-700 rounded max-w-xs transition-all hover:text-slate-800 hover:ring-4 hover:ring-slate-200 active:shadow-in focus:outline-none focus:ring-4 focus:ring-slate-200
      ${isDisabled && "brightness-75 pointer-events-none"}  
      ${isDisabled && !cta && "animate-boeing-once"}  
      ${hipster && "bg-slate-200 hover:ring-slate-200 focus:ring-slate-200"}
      ${
        cta &&
        "bg-slate-500 text-slate-100 hover:text-white hover:ring-slate-400 focus:ring-slate-400"
      }
      ${className ? className : ""}`}
      /* shadow-out */
    >
      <div className="transition-all group-active:translate-x-[1px] group-active:translate-y-[1px]">
        {props.children}
      </div>
    </button>
  );
}
