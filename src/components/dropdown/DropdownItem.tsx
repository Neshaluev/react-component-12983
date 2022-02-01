import React from "react";
import cn from "classnames";

const DropdownItem = (props: any) => {
  const { active, children, className, disabled, selected, text, onClick } =
    props;

  const handleClick = (e: any) => {
    onClick(e, props);
  };

  const prefixCls = "dropdown-item";

  const classess = cn(
    prefixCls,
    {
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-selected`]: selected,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  const ariaOptions = {
    // role: "options",
    // "aria-disabled": !!disabled,
    // "aria-active": !!active,
    // "aria-selected": !!selected,
  };

  const textElement = React.cloneElement(<span />, [], text);
  return (
    <div {...ariaOptions} className={classess} onClick={handleClick}>
      {textElement}
    </div>
  );
};

export default DropdownItem;
