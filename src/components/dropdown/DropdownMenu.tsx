import React from "react";
import cn from "classnames";

export const DropdownMenuInner = React.forwardRef((props: any, ref: any) => {
  const { children, className, open, upward, multiple } = props;

  const prefixCls = "dropdown-menu";

  const classess = cn(prefixCls, {
    [`${prefixCls}-visible`]: open,
    [`${prefixCls}-upward`]: upward,
    [`${prefixCls}-multiple`]: multiple,
    className,
  });

  return (
    <div ref={ref} className={classess}>
      {children}
    </div>
  );
});

export const DropdownMenu = DropdownMenuInner;

export default DropdownMenu;
