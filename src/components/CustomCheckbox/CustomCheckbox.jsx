import React, { useState } from "react";

const CustomCheckbox = ({ isChecked, number, label, inline, ...rest }) => {
  const [is_checked, setIsChecked] = useState(isChecked ? true : false);

  const classes =
    inline !== undefined ? "checkbox checkbox-inline" : "checkbox";

  return (
    <div className={classes}>
      <input
        id={number}
        type="checkbox"
        onChange={() => setIsChecked(!is_checked)}
        checked={is_checked}
        {...rest}
      />
      <label htmlFor={number}>{label}</label>
    </div>
  );
};

export default CustomCheckbox;
