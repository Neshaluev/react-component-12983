import React from "react";

import { usePopper } from "react-popper";
import { CreatePopupElement } from "./CreatePopupElement";

import "./popup.style.scss";

export type PopupPlacementType = "top" | "bottom" | "left" | "right";
export type PopupOnType = "hover" | "click" | "focus";

export interface PopupProps {
  placement?: PopupPlacementType;
  on?: PopupOnType;
  trigger: React.ReactElement;
  content: React.ReactElement;
}

export const Popup = (props: PopupProps) => {
  const { placement = "top" } = props;

  const [visible, setVisibility] = React.useState(false);

  const [referenceRef, setReferenceRef] = React.useState<any>(null);
  const [popperRef, setPopperRef] = React.useState<any>(null);
  const [arrowRef, setArrowRef] = React.useState<any>(null);

  const { styles, attributes } = usePopper(referenceRef, popperRef, {
    placement: placement,
    strategy: "fixed",
    modifiers: [
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 10],
        },
      },
      {
        name: "arrow",
        enabled: false,
        options: {
          element: arrowRef,
        },
      },
    ],
  });

  const handleClose = () => {
    setVisibility(false);
  };

  const handleOpen = () => {
    setVisibility(true);
  };

  React.useEffect(() => {}, []);

  const getPortalProps = () => {
    const portalProps: any = {};
    const { on = "click" } = props;

    if (on === "hover") {
      portalProps.openOnTriggerMouseEnter = true;
      portalProps.closeOnTriggerMouseLeave = true;
      portalProps.openOnTriggerClick = false;
      portalProps.closeOnTriggerClick = false;

      portalProps.mouseLeaveDelay = 70;
      portalProps.mouseEnterDelay = 50;
    }
    if (on === "click") {
      portalProps.openOnTriggerClick = true;
      portalProps.closeOnTriggerClick = true;
      portalProps.closeOnDocumentClick = true;
    }
    if (on === "focus") {
      portalProps.openOnTriggerFocus = true;
      portalProps.closeOnTriggerBlur = true;
    }

    return portalProps;
  };

  const renderTrigger = () => {
    const { trigger } = props;
    const classes = "";
    return React.cloneElement(trigger, {
      ref: setReferenceRef,
    });
  };

  const renderContent = () => {
    const { content } = props;
    const classes = "";
    return (
      <div
        className="test-popup"
        id="tooltip"
        ref={setPopperRef}
        style={styles.popper}
        {...attributes.popper}
      >
        {React.cloneElement(content, { ...styles.offset })}
        <div data-popper-arrow ref={setArrowRef} id="arrow"></div>
      </div>
    );
  };

  let mergedPortalProps = { ...getPortalProps() };

  return (
    <>
      <CreatePopupElement
        {...mergedPortalProps}
        onClose={handleClose}
        onOpen={handleOpen}
        trigger={renderTrigger()}
        content={renderContent()}
        open={visible}
      />
    </>
  );
};

export default Popup;
