import React from "react";
import ReactDOM from "react-dom";

export type PortalRef = {};

export interface PortalProps {
  getContainer: () => HTMLElement;
  children?: React.ReactNode;
}

export const Portal = React.forwardRef<PortalRef, PortalProps>((props, ref) => {
  const { getContainer, children } = props;
  const containerRef = React.useRef<HTMLElement>();

  const initRef = React.useRef(false);

  React.useImperativeHandle(ref, () => ({}));

  if (!initRef.current) {
    containerRef.current = getContainer();
    initRef.current = true;
  }

  return containerRef.current
    ? ReactDOM.createPortal(children, containerRef.current)
    : null;
});
