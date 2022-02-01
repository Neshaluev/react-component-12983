//@ts-nocheck
import React from "react";
import { FieldContext } from "./context/context";
import { toArray, getValue } from "./utils/helpers";

import { validateRules } from "./utils/validateUtils";

const EMPTY_ERRORS: any[] = [];

export class FormField extends React.Component<any, any> {
  public static contextType = FieldContext;
  public static defaultProps = {
    trigger: "onChange",
    valuePropName: "value",
  };

  private mounted = false;
  private touched: boolean = false;
  private validatePromise: Promise<string[]> | null = null;
  private prevValidating: boolean;

  private errors: string[] = EMPTY_ERRORS;
  private warnings: string[] = EMPTY_ERRORS;

  constructor(props: InternalFieldProps) {
    super(props);
  }
  componentDidMount() {
    const { fieldContext } = this.props;

    this.mounted = true;

    if (fieldContext) {
      const { getInternalHooks }: InternalFormInstance = fieldContext;
      const { registerField } = getInternalHooks();

      registerField(this);
    }
  }
  componentWillUnmount() {
    this.triggerMetaEvent(true);
    this.mounted = false;
  }

  public isFieldValidating = () => !!this.validatePromise;

  public isFieldTouched = () => this.touched;

  // Meta Data
  public getMeta = (): Meta => {
    // Make error & validating in cache to save perf
    this.prevValidating = this.isFieldValidating();

    const meta: Meta = {
      touched: this.isFieldTouched(),
      validating: this.prevValidating,
      errors: this.errors,
      warnings: this.warnings,
      name: this.getNamePath(),
    };

    return meta;
  };

  public triggerMetaEvent = (destroy?: boolean) => {
    const { onMetaChange } = this.props;
    // console.log("onMetaChange onMetaChange onMetaChange", onMetaChange);
    onMetaChange?.({ ...this.getMeta(), destroy });
  };

  public getNamePath = (): InternalNamePath => {
    const { name } = this.props;

    return name !== undefined ? name : [];
  };

  public getValue = (store?: Store) => {
    const { getFieldValue }: FormInstance = this.props.fieldContext;
    const namePath = this.getNamePath();
    const value = getFieldValue(namePath);

    // return getValue(this, namePath);
    return value;
  };

  // Validation
  public getRules() {
    const { rules = [], fieldContext } = this.props;

    return rules.map((rule: Rule): any => {
      if (typeof rule === "function") {
        return rule(fieldContext);
      }
      return rule;
    });
  }

  public validateRules(options?: any) {
    const namePath = this.getNamePath();
    const currentValue = this.getValue();

    // Force change to async to avoid rule OOD under renderProps field

    const rootPromise = Promise.resolve().then(() => {
      if (!this.mounted) {
        return [];
      }

      const { validateFirst = false, messageVariables } = this.props;

      let filteredRules = this.getRules();

      const promise = validateRules(
        namePath,
        currentValue,
        filteredRules,
        options,
        validateFirst,
        messageVariables
      );

      promise
        .catch((e) => e)
        .then((ruleErrors: any) => {
          if (this.validatePromise === rootPromise) {
            this.validatePromise = null;
            const nextErrors: string[] = [];
            const nextWarnings: string[] = [];

            // console.log("ruleErrors", ruleErrors);
            ruleErrors.forEach(
              ({ rule: { warningOnly }, errors = EMPTY_ERRORS }: any) => {
                if (warningOnly) {
                  nextWarnings.push(...errors);
                } else {
                  nextErrors.push(...errors);
                }
              }
            );

            this.errors = nextErrors;
            this.warnings = nextWarnings;
            this.triggerMetaEvent();

            // this.reRender();
          }
        });

      return promise;
    });

    //@ts-ignore
    this.validatePromise = rootPromise;
    this.dirty = true;
    this.errors = EMPTY_ERRORS;
    this.warnings = EMPTY_ERRORS;
    this.triggerMetaEvent();

    // Force trigger re-render since we need sync renderProps with new meta
    // this.reRender();

    return rootPromise;
  }

  public defaultGetValueFromEvent(args: any, valuePropName: any) {
    const event = args;
    if (event && event.target && valuePropName in event.target) {
      return (event.target as HTMLInputElement)[valuePropName];
    }
    return event.target;
  }

  // Event Controller
  public getControlled = (childProps: any) => {
    const {
      name: namePath,
      fieldContext,
      valuePropName,
      trigger,
      validateTrigger,
    } = childProps;

    const { getInternalHooks, getFieldsValue }: InternalFormInstance =
      fieldContext;

    const { dispatch } = getInternalHooks();

    let control = {
      ...childProps,
    };

    const mergedValidateTrigger =
      validateTrigger !== undefined
        ? validateTrigger
        : fieldContext.validateTrigger;

    const originTriggerFunc: any = childProps[trigger];

    control[trigger] = (args: any) => {
      this.touched = true;
      this.dirty = true;

      // add meta data
      this.triggerMetaEvent();

      let newValue: StoreValue;
      newValue = this.defaultGetValueFromEvent(args, valuePropName);

      dispatch({
        type: "updateValue",
        namePath,
        value: newValue,
      });

      if (originTriggerFunc) {
        originTriggerFunc(...args);
      }
    };

    const validateTriggerList: string[] = toArray(mergedValidateTrigger) || [];

    validateTriggerList.forEach((triggerName: string) => {
      // Wrap additional function of component, so that we can get latest value from store
      const originTrigger = control[triggerName];

      control[triggerName] = (...args: any) => {
        if (originTrigger) {
          originTrigger(...args);
        }

        const { rules } = this.props;
        if (rules && rules.length) {
          dispatch({
            type: "validateField",
            namePath,
            triggerName,
          });
        }
      };
    });

    return control;
  };

  public getChild(children: any): any {
    let meta = {};
    let control = this.getControlled(this.props);
    return children(control, meta);
  }

  render() {
    const { children } = this.props;
    const child = this.getChild(children);

    return <div>{child}</div>;
  }
}

function WrapperField<Values = any>({ name, ...restProps }) {
  const fieldContext = React.useContext(FieldContext);

  const namePath = toArray(name);

  return (
    <FormField name={namePath} fieldContext={fieldContext} {...restProps} />
  );
}

export default WrapperField;
