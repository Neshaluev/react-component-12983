import React from "react";
import cn from "classnames";

import Tools from "./Tools";
import { Dialog } from "../dialog";

import RotateLeft from "../icons/RotateLeft";
import RotateRight from "../icons/RotateRight";
import ZoomIn from "../icons/ZoomIn";
import ZoomOut from "../icons/ZoomOut";
import CloseImage from "../icons/CloseImage";

export interface PreviewProps {
  visible: boolean;
  onClose: (...args: any) => void;
  src: string | undefined;
  alt?: string;
}

const initialPosition = {
  x: 0,
  y: 0,
};

const Preview = (props: PreviewProps) => {
  const { visible, onClose, src, alt } = props;

  let imgRef = React.useRef<HTMLImageElement>(null);
  const containerImgRef = React.useRef<HTMLImageElement>(null);

  const [isMoving, setMoving] = React.useState(false);

  const [scale, setScale] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);
  const [position, setPosition] = React.useState<{
    x: number;
    y: number;
  }>(initialPosition);

  const originPositionRef = React.useRef<{
    originX: number;
    originY: number;
    deltaX: number;
    deltaY: number;
  }>({
    originX: 0,
    originY: 0,
    deltaX: 0,
    deltaY: 0,
  });

  const onZoomIn = () => {
    setScale((value) => value + 1);
    setPosition(initialPosition);
  };

  const onZoomOut = () => {
    if (scale > 1) {
      setScale((value) => value - 1);
    }
    setPosition(initialPosition);
  };

  const onRotateRight = () => {
    setRotate((value) => value + 90);
  };

  const onRotateLeft = () => {
    setRotate((value) => value - 90);
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    originPositionRef.current.deltaX = event.pageX - position.x;
    originPositionRef.current.deltaY = event.pageY - position.y;
    originPositionRef.current.originX = position.x;
    originPositionRef.current.originY = position.y;

    setMoving(true);
  };

  const onMouseUp = () => {
    if (visible && isMoving) {
      setMoving(false);
    }
  };

  const onMouseMove = (event: any) => {
    if (visible && isMoving) {
      setPosition({
        x: event.pageX - originPositionRef.current.deltaX,
        y: event.pageY - originPositionRef.current.deltaY,
      });
    }
  };

  React.useEffect(() => {
    window.addEventListener("mouseup", onMouseUp, {
      passive: false,
    });

    window.addEventListener("mousemove", onMouseMove, {
      passive: false,
    });

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [visible, isMoving]);

  const handleClose = () => {
    onClose();
  };
  const prefixCls = "image-preview";

  const classess = cn(prefixCls);

  const tools = [
    {
      name: "zoom-in",
      onClick: onZoomIn,
      Component: ZoomIn,
    },
    {
      name: "zoom-out",
      onClick: onZoomOut,
      Component: ZoomOut,
    },
    {
      name: "rotate-right",
      onClick: onRotateRight,
      Component: RotateRight,
    },
    {
      name: "rotate-left",
      onClick: onRotateLeft,
      Component: RotateLeft,
    },
    {
      name: "close-image",
      onClick: handleClose,
      Component: CloseImage,
    },
  ];

  return (
    <>
      <div className="conatiner-img" ref={containerImgRef}></div>
      <Dialog visible={visible} getContainer={() => containerImgRef.current}>
        <div className={classess}>
          <div className="image-preview-tools">
            <Tools tools={tools} prefixCls={prefixCls} />
          </div>
          <img
            onMouseDown={onMouseDown}
            className="image-preview-img"
            src={src}
            alt={alt}
            ref={imgRef}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`,
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default Preview;
