import classnames from "classnames";
import { SizeType } from "../../utils/typing/type";

export function getInputClassName(
  prefixCls: string,
  bordered?: boolean,
  size?: SizeType,
  disabled?: boolean
  // direction?: DirectionType,
) {
  return classnames(prefixCls, {
    [`${prefixCls}-small`]: size === "small",
    [`${prefixCls}-large`]: size === "large",
    [`${prefixCls}-disabled`]: disabled,
    //   [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-borderless`]: !bordered,
  });
}
