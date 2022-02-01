import React from "react";
import { FieldContext } from "./context/context";
import useForm from "./hooks/useForm";
import { FormInstance, InternalFormInstance, Store } from "./interface";

export const Form = (props: any) => {
  const {
    form,
    initialValues,
    component: Component = "form",
    validateTrigger = "onChange",
    onValuesChange,
    onFinish,
    onFinishFailed,
    children,
    ...restProps
  } = props;

  const [formInstance] = useForm(form);

  const { setCallbacks } = (
    formInstance as InternalFormInstance
  ).getInternalHooks();

  // Callbacks;
  setCallbacks({
    onValuesChange,
    onFinish: (values: Store) => {
      if (onFinish) {
        onFinish(values);
      }
    },
    onFinishFailed,
  });

  // Render component
  let childrenNode = children;
  const formContextValue = React.useMemo(
    () => ({
      ...(formInstance as InternalFormInstance),
      validateTrigger,
    }),
    [formInstance, validateTrigger]
  );

  let wrapperNode = (
    <FieldContext.Provider value={formContextValue}>
      {childrenNode}
    </FieldContext.Provider>
  );

  return (
    <Component
      {...restProps}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        formInstance.submit();
      }}
    >
      {wrapperNode}
    </Component>
  );
};

export default Form;
