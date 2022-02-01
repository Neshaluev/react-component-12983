import React from "react";
import cn from "classnames";
import { WrapperPortal } from "./WrapperPortal";

import "./dialog.style.scss";

const Dialog = (props: any) => {
  const { children, visible, className, getContainer } = props;

  const classess = cn("dialog", className);

  return (
    <WrapperPortal
      visible={visible}
      wrapperClassName={classess}
      getContainer={getContainer}
    >
      {children}
    </WrapperPortal>
  );
};

export default Dialog;
