import React from "react";

import { SizeContext } from "../utils/config-provider/SizeContext";
import { ConfigConsumer } from "../utils/config-provider/context";
import { WrapperInput } from "./WrapperInput";

import "./input.style.scss";

export const Input = React.forwardRef((props: any, ref) => {
  const [state, setState] = React.useState<{
    value: string | undefined;
    focused: boolean;
  }>({
    value: undefined,
    focused: false,
  });

  let input = (ref as any) || React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    setState({
      ...state,
      value: props.value || props.defaultValue,
    });
  }, []);
  const setValue = (value: string) => {
    if (props.value === undefined) {
      setState({ ...state, value });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleReset = () => {
    setValue("");
  };
  const saveWrapperInput = (node: any) => (input = node);
  const handleBlur = (e: React.FocusEventHandler<HTMLInputElement>) => {
    setState({ ...state, focused: false });
  };
  const handleFocus = (e: React.FocusEventHandler<HTMLInputElement>) => {
    setState({ ...state, focused: true });
  };
  const handleInputKeyDown = () => {};

  const renderInput = (input: any) => {
    // const {} = props
    // const classes = classnames()
    return (
      <input
        {...props}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleInputKeyDown}
        onChange={handleChange}
        ref={input}
      />
    );
  };

  const renderComponent = () => {
    const { value, focused } = state;
    return (
      <SizeContext.Consumer>
        {(size) => (
          <WrapperInput
            size={size}
            {...props}
            value={value}
            inputType="input"
            focused={focused}
            ref={saveWrapperInput}
            element={renderInput(input)}
            handleReset={handleReset}
          />
        )}
      </SizeContext.Consumer>
    );
  };

  return <ConfigConsumer>{renderComponent}</ConfigConsumer>;
});

export default Input;
