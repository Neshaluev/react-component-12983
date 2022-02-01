//@ts-nocheck
import React from "react";
import cn from "classnames";

import { Preloader } from "../Preloader";

import "./button.style.scss";

type Loading = number | boolean;

const tuple = <T extends string[]>(...args: T) => args;
const ButtonTypes = tuple(
  "default",
  "primary",
  "ghost",
  "dashed",
  "text",
  "danger"
);
export type ButtonType = typeof ButtonTypes[number];
const ButtonShapes = tuple("circle", "round");
export type ButtonShape = typeof ButtonShapes[number];
const ButtonHTMLTypes = tuple("submit", "button", "reset");
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

export type SizeType = "small" | "middle" | "large" | undefined;

interface baseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  size?: SizeType;
  loading?: boolean;
  className?: string;
  block?: boolean;
  children: React.ReactNode;
  link?: boolean;
}

const InternalButton: React.ForwardRefRenderFunction<any, baseButtonProps> = (
  props,
  ref
) => {
  const {
    size,
    children,
    className,
    loading = false,
    type = "default",
    shape,
    icon,
    block,
    link = false,
    ...rest
  } = props;

  const refButton = React.useRef<HTMLElement>();

  const [isLoading, setIsLoading] = React.useState<Loading>(!!loading);

  const handleClick = (e: React.MouseEvent | HTMLAnchorElement) => {
    const { onClcik, disabled } = props;
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    (
      onClcik as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
    )?.(e);
  };

  React.useEffect(() => {
    setIsLoading(!!loading);
  }, [loading]);

  const prefixCls = "btn";

  const classes = cn(prefixCls, {
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${size}`]: size,
    [`${prefixCls}-link`]: link,
    [`${prefixCls}-block`]: block,
    [`${prefixCls}-loading`]: isLoading,
  });

  const renderIconNode = () => {
    const props = {
      ...icon.props,
      size,
      type,
    };
    if (icon && !isLoading) {
      return React.cloneElement(icon, props);
    } else {
      return React.cloneElement(<Preloader />, { size, type });
    }
  };

  if (link) {
    return (
      <a className={classes} onClick={handleClick} ref={refButton} {...rest}>
        {renderIconNode()}
        {children}
      </a>
    );
  }

  const buttonNode = (
    <button className={classes} onClick={handleClick} ref={refButton} {...rest}>
      {renderIconNode()}
      {children}
    </button>
  );

  return <>{buttonNode}</>;
};

export const Button = React.forwardRef(InternalButton);
