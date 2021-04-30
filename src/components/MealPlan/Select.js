import React from "react";

const Select = ({
  defaultValue,
  register,
  options,
  name,
  onChange_f,
  ...rest
}) => {
  return (
    <select
      className="select"
      onChange={onChange_f}
      defaultValue={defaultValue}
      name={name}
      ref={register}
      {...rest}
    >
      {options.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default Select;
