import { useTextField } from "react-aria";
import { useState, useRef, useEffect } from "react";

export default function TextField(props) {
  let { label, defaultValue, onChange } = props;
  let ref = useRef();
  const [valueState, setValueState] = useState(defaultValue || "");
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(
      {
        ...props,
        inputElementType: "textarea",
      },
      ref
    );

  useEffect(() => {
    // console.log(ref.current.value);
    if (defaultValue !== null) setValueState(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (props.errorMessage) {
      ref.current.focus();
    }
  }, [props.errorMessage]);

  return (
    <div className=" mb-2">
      <div className="relative max-w-min mx-auto ">
        <textarea
          {...inputProps}
          onChange={(e) => {
            if (onChange) {
              onChange();
            }
            ref.current.blur();
            ref.current.focus();
            setValueState(e.target.value);
          }}
          ref={ref}
          className={`peer ${
            props.errorMessage
              ? "border-red-300 focus:border-red-500"
              : "border-sky-200 focus:border-2 focus:border-sky-500"
          } form-control max-w-xs outline-none border-2 rounded-md py-[0.32rem] px-3 transition text-slate-700  ${
            valueState ? "active" : ""
          }`}
        />
        <label
          className={`form-label absolute top-[0.4rem] left-3 max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis mb-0 ml-0 px-1 align-bottom  pointer-events-none origin-top-left transition-all ease-out text-slate-500 ${
            props.errorMessage
              ? "text-red-300 peer-focus:text-red-500 animate..."
              : "peer-focus:text-sky-600"
          }`}
          {...labelProps}
        >
          {label}
        </label>
        {props.description && (
          <div
            {...descriptionProps}
            className="w-full text-center text-xs text-slate-400"
          >
            {props.description}
          </div>
        )}
      </div>
      {props.errorMessage && (
        <p {...errorMessageProps} className="pl-2 pt-1 text-red-400 text-sm">
          {props.errorMessage}
        </p>
      )}
    </div>
  );
}
