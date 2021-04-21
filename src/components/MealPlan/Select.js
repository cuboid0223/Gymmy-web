import React from "react";

const Select = ({ defaultValue, register, options, name, ...rest }) => {
  return (
    <select
      className="select"
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
