import React from "react";
import cn from "classnames";

import FormField from "./FormField";
import FormItemInput from "./FormItemInput";
import FormItemError from "./FormItemError";

import { InternalFormInstance, Meta } from "./interface";
import useDebounce from "./hooks/useDebaunce";
import { FormItemLabel } from "./FormItemLabel";

function genEmptyMeta(): Meta {
  return {
    errors: [],
    warnings: [],
    touched: false,
    validating: false,
    name: [],
  };
}

export const FormItem = (props: any) => {
  const { name, label } = props;

  // Meta data from field
  const [meta, setMeta] = React.useState<Meta>(() => genEmptyMeta());

  const onMetaChange = (nextMeta: Meta & { destroy?: boolean }) => {
    // Destroy will reset all the meta
    setMeta(nextMeta.destroy ? genEmptyMeta() : nextMeta);
  };

  // Errors data from field
  const [mergedErrors, mergedWarnings] = React.useMemo(() => {
    const errorList: string[] = [...meta.errors];
    const warningList: string[] = [...meta.warnings];

    return [errorList, warningList];
  }, [meta.errors, meta.warnings]);

  const debounceErrors = useDebounce(mergedErrors);

  const renderComponent = (childProps: any) => {
    const classess = cn("form-field", {});
    return (
      <div className={classess}>
        <FormItemLabel label={label} />
        <FormItemError debounceErrors={debounceErrors} />
        <FormItemInput {...childProps} />
      </div>
    );
  };

  return (
    <FormField {...props} onMetaChange={onMetaChange}>
      {(control: any, meta: any) => {
        let mainProps = props.children.props;
        let { children, ...controlProps } = control;

        let mergetProps = { ...controlProps, ...mainProps };

        return renderComponent(mergetProps);
      }}
    </FormField>
  );
};

export default FormItem;
