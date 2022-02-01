import React from "react";
import cn from "classnames";

const DropdownText = (props: any) => {
  const { children, className, content } = props;
  const classes = cn("divider", className);
  return (
    <div aria-atomic aria-live="polite" role="alert" className={classes}>
      {children ? children : content}
    </div>
  );
};

export default DropdownText;
