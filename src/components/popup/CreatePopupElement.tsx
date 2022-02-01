import ReactDOM from "react-dom";
//@ts-nocheck
import React from "react";

const Portal = (props: any) => {
  const { children, mountNode = document.body, innerRef } = props;
  const renderComponent = () => {
    return (
      <span ref={innerRef} className="popper-portal">
        {children}
      </span>
    );
  };
  return ReactDOM.createPortal(renderComponent(), mountNode);
};

export const CreatePopupElement = (props: any) => {
  let contentRef = React.useRef();
  let triggerRef = React.useRef();
  const { open, children, mountNode, trigger, content } = props;

  let mouseLeaveTimer: any;
  let mouseEnterTimer: any;

  const handleTriggerClick = (e: any) => {
    const { closeOnTriggerClick, openOnTriggerClick, onOpen, onClose, open } =
      props;

    if (open && closeOnTriggerClick) {
      onClose();
    }
    if (!open && openOnTriggerClick) {
      onOpen();
    }
  };
  const closeWithTimeout = (e: any, delay: number) => {
    const { onClose } = props;
    const eventClone = { ...e };
    return setTimeout(() => onClose(eventClone), delay);
  };
  const openWithTimeout = (e: any, delay: number) => {
    const { onOpen } = props;
    const eventClone = { ...e };
    return setTimeout(() => onOpen(eventClone), delay);
  };
  const handleTriggerMouseLeave = (e: any) => {
    clearTimeout(mouseEnterTimer);
    const { closeOnTriggerMouseLeave, mouseLeaveDelay } = props;
    if (!closeOnTriggerMouseLeave) return;
    mouseLeaveTimer = closeWithTimeout(e, mouseLeaveDelay);
  };

  const handleTriggerMouseEnter = (e: any) => {
    clearTimeout(mouseLeaveTimer);
    const { mouseEnterDelay, openOnTriggerMouseEnter } = props;
    if (!openOnTriggerMouseEnter) return;
    mouseEnterTimer = openWithTimeout(e, mouseEnterDelay);
  };

  const handleTriggerFocus = (e: any) => {
    const { openOnTriggerFocus, onOpen } = props;
    if (!openOnTriggerFocus) return;
    onOpen(e);
  };

  const handleTriggerBlur = (e: any) => {
    const { closeOnTriggerBlur, onClose } = props;
    if (!closeOnTriggerBlur) return;
    onClose(e);
  };

  const handleTriggerRef = (node: any) => {
    triggerRef.current = node;
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(mouseEnterTimer);
      clearTimeout(mouseLeaveTimer);
    };
  }, []);

  return (
    <>
      {open && (
        <Portal innerRef={handleTriggerRef} mountNode={mountNode}>
          {content}
        </Portal>
      )}

      {trigger &&
        React.cloneElement(trigger, {
          onClick: handleTriggerClick,
          onMouseLeave: handleTriggerMouseLeave,
          onMouseEnter: handleTriggerMouseEnter,
          onFocus: handleTriggerFocus,
          onBlur: handleTriggerBlur,
        })}
    </>
  );
};
