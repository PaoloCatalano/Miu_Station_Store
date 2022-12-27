import { useButton } from "@react-aria/button";
import { useRef } from "react";

export default function Button(props) {
  const { isDisabled } = props;
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={`${
        isDisabled && "animate-boeing brightness-75 pointer-events-none"
      } bg-sky-400 p-2 rounded max-w-xs  transition hover:ring-4 hover:ring-sky-200 active:scale-x-[.95] active:scale-y-[1.05] focus:outline-none focus:ring-4 focus:ring-sky-200`}
    >
      {props.children}
    </button>
  );
}
