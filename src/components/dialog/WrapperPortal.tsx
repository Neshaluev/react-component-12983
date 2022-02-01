import React from "react";
import { Portal } from "./Portal";

export type GetContainer = string | HTMLElement | (() => HTMLElement);

const getParent = (getContainer: GetContainer) => {
  if (getContainer) {
    if (typeof getContainer === "string") {
      return document.querySelectorAll(getContainer)[0];
    }
    if (typeof getContainer === "function") {
      return getContainer();
    }
    if (
      typeof getContainer === "object" &&
      getContainer instanceof window.HTMLElement
    ) {
      return getContainer;
    }
  }
  return document.body;
};

export const WrapperPortal = (props: any) => {
  const { children, visible } = props;
  const componentRef = React.useRef<any>();

  const el = React.useRef(document.createElement("div"));

  let container = el.current;

  React.useEffect(() => {}, []);

  const setWrapperClassName = () => {
    const { wrapperClassName } = props;
    if (
      container &&
      wrapperClassName &&
      wrapperClassName !== container.className
    ) {
      container.className = wrapperClassName;
    }
  };

  const attachToParent = () => {
    if (container && !container.parentNode) {
      let parent = getParent(props.getContainer);
      if (parent) {
        parent.appendChild(container);
      }
    }
  };

  const getContainer = () => {
    if (!container) {
      // container = document.createElement("div");
      attachToParent();
    }
    setWrapperClassName();
    return container;
  };

  const removeCurrentContainer = () => {
    container?.parentNode?.removeChild(container);
  };

  React.useEffect(() => {
    getContainer();

    if (container) {
      attachToParent();
    }
    return () => removeCurrentContainer();
  }, [props]);

  let childProps = {};

  console.log("Render Wrapper visible", visible);
  return (
    visible && (
      <Portal getContainer={getContainer} ref={componentRef}>
        {/* {children()} */}
        {children}
      </Portal>
    )
  );
};

export default WrapperPortal;

export const SandboxWaperPortal = () => {
  const outerRef = React.useRef<any>();

  return (
    <>
      <div className="block">
        <WrapperPortal
          wrapperClassName={"custom class"}
          visible={true}
          getContainer={() => outerRef.current}
        >
          {() => <div>test content</div>}
        </WrapperPortal>
      </div>
      <div ref={outerRef} style={{ backgroundColor: "red" }}>
        Test
      </div>
    </>
  );
};
