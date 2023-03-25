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
      className={`my-3 px-5 group
       bg-blue-400 p-2 text-white rounded max-w-xs transition-all  hover:ring-4 hover:ring-blue-200 active:shadow-in focus:outline-none focus:ring-4 focus:ring-blue-200
      ${isDisabled && "brightness-50 pointer-events-none"}  
      ${isDisabled && !cta && "animate-boeing-once"}  
      ${
        hipster &&
        "bg-blue-200 !text-sky-900 hover:ring-blue-200 focus:ring-blue-200"
      }
      ${cta && "!bg-miu-600  hover:ring-miu-500 focus:ring-miu-500"}
      ${className ? className : ""}`}
      /* shadow-out */
    >
      <div className="transition-all group-active:translate-x-[1px] group-active:translate-y-[1px]">
        {props.children}
      </div>
    </button>
  );
}
