import React from "react";
import cn from "classnames";

const InnerDropdownSearchInput = (props: any, ref: any) => {
  const { autoComplete, className, tabIndex, type, value, onChange, ...rest } =
    props;

  const handleChange = (e: any) => {
    const value = e.target.value;
    onChange(e, value);
  };

  const classess = cn("dropdown-search", className);

  return (
    <input
      ref={ref}
      {...rest}
      onChange={handleChange}
      autoComplete={autoComplete}
      tabIndex={tabIndex}
      type={type}
      value={value}
      className={classess}
    />
  );
};

export const DropdownSearchInput = React.forwardRef(InnerDropdownSearchInput);

export default DropdownSearchInput;
