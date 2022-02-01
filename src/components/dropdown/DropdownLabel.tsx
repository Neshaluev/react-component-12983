import React from "react";
import cn from "classnames";
import Close from "../icons/Close";

const DropdownLabel = (props: any) => {
  const { className, item, handleDeleteLabels, active } = props;
  const prefixCls = "dropdown-label";

  const classess = cn(
    prefixCls,
    {
      [`${prefixCls}-active`]: active,
    },
    className
  );

  const handleDeleteLable = (e: any) => {
    handleDeleteLabels(item);
  };
  return (
    <button className={classess}>
      <span>{item.value} </span>
      <span className="dropdown-label-close" onClick={handleDeleteLable}>
        <Close />
      </span>
    </button>
  );
};

export default DropdownLabel;
