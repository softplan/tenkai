import React from "react";

const CustomRadio = ({ number, label, option, name, ...rest }) => (
  <div className="radio">
    <input id={number} name={name} type="radio" value={option} {...rest} />
    <label htmlFor={number}>{label}</label>
  </div>
);

export default CustomRadio;
