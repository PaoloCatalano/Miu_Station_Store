import React from "react";

type SelectCustomProps = {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  options: string[];
};

const SelectCustom = ({
  label,
  id,
  name,
  placeholder,
  options,
}: SelectCustomProps) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>

      <select
        className="bg-sky-400 p-1 rounded max-w-xs"
        name={name}
        defaultValue=""
      >
        <optgroup label={placeholder}>
          <option
            aria-labelledby={id}
            value=""
            hidden
            disabled
            aria-hidden
            aria-disabled
          >
            {placeholder}
          </option>

          {options.map((opt) => (
            <option key={opt + id} aria-labelledby={id} value={opt}>
              {opt}
            </option>
          ))}

          {/* <option aria-labelledby={zo.fields.payment("id")} value="mastercard">
            masterCard
          </option>
          <option aria-labelledby={zo.fields.payment("id")} value="visa">
            visa
          </option>
          <option aria-labelledby={zo.fields.payment("id")} value="cash">
            cash
          </option> */}
        </optgroup>
      </select>
    </>
  );
};
