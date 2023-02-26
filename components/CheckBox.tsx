import type { AriaCheckboxProps } from "@react-types/checkbox";
import { useRef } from "react";
import { useToggleState } from "@react-stately/toggle";
import { useCheckbox } from "@react-aria/checkbox";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";

type AriaCheckboxPropsWithClassName = AriaCheckboxProps & { className: string };

export default function Checkbox(props: AriaCheckboxPropsWithClassName) {
  let state = useToggleState(props);
  let ref = useRef<HTMLInputElement>(null);
  let { inputProps } = useCheckbox(props, state, ref);
  let { focusProps, isFocusVisible } = useFocusRing();

  let checkboxClassName = `${
    state.isSelected
      ? "bg-blue-400 group-active:bg-blue-500"
      : "bg-white hover:border-blue-200"
  }
    text-white
    border-2
    rounded
    
    ${
      props.isDisabled
        ? "border-gray-300"
        : isFocusVisible || state.isSelected
        ? "border-blue-200 group-active:border-blue-200"
        : "border-slate-300 group-active:border-blue-200"
    }
    w-5
    h-5
    flex
    flex-shrink-0
    justify-center
    items-center
    mr-2
    ${isFocusVisible ? "shadow-outline" : ""}
    transition-all
    ease-in-out
    duration-150
    // ${props.className ? props.className : ""}
 `;

  let labelClassName = `${
    props.isDisabled
      ? "text-gray-400"
      : "text-slate-500 group-active:text-gray-800"
  }
    select-none
  `;

  return (
    <label className="flex items-center group ">
      <VisuallyHidden>
        <input {...mergeProps(inputProps, focusProps)} ref={ref} />
      </VisuallyHidden>
      <div className={checkboxClassName} aria-hidden="true">
        <svg className="stroke-current w-3 h-3 " viewBox="0 0 18 18">
          <polyline
            points="1 9 7 14 15 4"
            fill="none"
            strokeWidth={3}
            strokeDasharray={22}
            strokeDashoffset={state.isSelected ? 44 : 66}
            style={{
              transition: "all 400ms",
            }}
          />
        </svg>
      </div>
      <span className={labelClassName}>{props.children}</span>
    </label>
  );
}
