import React from "react";
import classnames from "classnames";

import { CloseCircle } from "../icons";
import { getInputClassName } from "./utils";
import { tuple, SizeType } from "../utils/typing/type";

const WrapperInputType = tuple("text", "input");

interface BasicProps {
  prefixCls: string;
  inputType: typeof WrapperInputType[number];
  value?: any;
  allowClear?: boolean;
  element: React.ReactElement;
  handleReset: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  focused?: boolean;
  readOnly?: boolean;
  bordered?: boolean;
}

export interface ClearableInputProps extends BasicProps {
  size?: SizeType;
  suffix?: React.ReactNode | any;
  prefix?: React.ReactNode | any;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  triggerFocus?: () => void;
}

export const WrapperInput = (props: ClearableInputProps) => {
  let containerRef = React.useRef(null);

  const prefixCls = "input";

  const renderClearIcon = () => {
    const { allowClear, handleReset, disabled, value, suffix } = props;
    if (!allowClear) {
      return;
    }
    const className = `${prefixCls}-clear-icon`;
    const needClear = !disabled && value;
    return (
      <CloseCircle
        onClick={handleReset}
        role="button"
        className={classnames({
          [`${className}-hidden`]: needClear,
          [`${className}-has-suffix`]: !!suffix,
        })}
      />
    );
  };

  const renderSuffix = (prefixCls: string) => {
    const { suffix, allowClear, handleReset } = props;

    if (suffix || allowClear) {
      return (
        <span className={`${prefixCls}-suffix`} onClick={handleReset}>
          {renderClearIcon()}
          {suffix}
        </span>
      );
    }
  };

  const renderLabeledIcon = (
    prefixCls: string,
    element: React.ReactElement
  ) => {
    const {
      prefix,
      suffix,
      allowClear,
      value,
      focused,
      disabled,
      size,
      style,
    } = props;

    const suffixNode = renderSuffix(prefixCls);

    const prefixNode = prefix ? (
      <span className={`${prefixCls}-prefix`}>{prefix}</span>
    ) : null;

    const classes = classnames(`${prefixCls}-wrapper`, {
      [`${prefixCls}-wrapper-focused`]: focused,
      [`${prefixCls}-wrapper-disabled`]: disabled,
      [`${prefixCls}-wrapper-sm`]: size === "small",
      [`${prefixCls}-wrapper-large`]: size === "large",
      [`${prefixCls}-wrapper-input-with-clear-btn`]:
        suffix && allowClear && value,
    });

    return (
      <span className={classes} style={style} ref={containerRef}>
        {prefixNode}
        {React.cloneElement(element, {
          value,
          className: getInputClassName(prefixCls, undefined, size, disabled),
        })}
        {suffixNode}
      </span>
    );
  };

  const renderTextAreaWithClearIcon = (
    prefixCls: string,
    element: React.ReactElement
  ) => {
    return element;
  };

  const { element } = props;

  return (
    <>
      {renderTextAreaWithClearIcon(
        prefixCls,
        renderLabeledIcon(prefixCls, element)
      )}
    </>
  );
};

export default WrapperInput;
