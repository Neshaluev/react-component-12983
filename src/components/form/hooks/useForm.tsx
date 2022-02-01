import React from "react";
import { FieldEntity, FormInstance, NamePath, Store } from "../interface";
import { allPromiseFinish } from "../utils/asyncUtil";
import { setValue, setValues, getValue } from "../utils/helpers";
import { defaultValidateMessages } from "../utils/messages";

type ValidateOptions = any;
type FieldError = any;
type ValidateMessages = any;
type RuleError = any;
type ValidateErrorEntity = any;
type InternalNamePath = any;
type Meta = any;
type Callbacks = any;

export class FormStore {
  private store: Store = {};

  private fieldEntities: FieldEntity[] = [];

  private initialValues: any = {};

  private callbacks: Callbacks = {};

  private validateMessages: ValidateMessages = null;

  //@ts-ignore
  private lastValidatePromise: Promise<FieldError[]> = null;

  public getForm = () => ({
    setFieldsValue: this.setFieldsValue,
    getFieldValue: this.getFieldValue,
    validateFields: this.validateFields,
    submit: this.submit,

    getInternalHooks: this.getInternalHooks,
  });

  // getIternalHooks
  public getInternalHooks = () => ({
    setInitialValues: this.setInitialValues,
    setCallbacks: this.setCallbacks,
    getFieldValue: this.getFieldValue,
    registerField: this.registerField,
    dispatch: this.dispatch,
  });

  private setInitialValues = (initialValues: any, init: boolean) => {
    this.initialValues = initialValues || {};

    if (init) {
      this.store = setValues({}, initialValues, this.store);
    }
  };

  private setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = callbacks;
  };

  private getFieldValue = (name: any) => {
    return getValue(this.store, name);
  };

  private getFieldsValue = (
    nameList?: NamePath[] | true,
    filterFunc?: (meta: Meta) => boolean
  ) => {
    if (nameList === true && !filterFunc) {
      return this.store;
    }
  };

  // Field
  private registerField = (entity: FieldEntity) => {
    this.fieldEntities.push(entity);
    // console.log("entity register filed", entity);
    // console.log("entity register filed", this.fieldEntities);
    return true;
  };

  private getFieldEntities = (pure: boolean = false) => {
    if (!pure) {
      return this.fieldEntities;
    }

    return this.fieldEntities.filter((field) => field.getNamePath().length);
  };

  private setFieldsValue = (store: Store) => {
    if (store) {
      this.store = setValues(this.store, store);

      console.log(
        "setValues(this.store, name, value);",
        setValues(this.store, store),
        this.store
      );
    }
  };
  private updateValue = (name: any, value: any) => {
    const namePath = name;
    const prevStore = this.store;
    this.store = setValue(this.store, namePath, value);
  };

  private dispatch = (action: any) => {
    console.log("Dispatch", action);

    switch (action.type) {
      case "updateValue": {
        const { namePath, value } = action;
        this.updateValue(namePath, value);
        break;
      }
      case "validateField": {
        const { namePath, triggerName } = action;
        this.validateFields([namePath], { triggerName });
        break;
      }
      default:
    }
  };
  // Validate
  private validateFields = (
    nameList?: NamePath[],
    options?: ValidateOptions
  ) => {
    const provideNameList = !!nameList;
    console.log("validateFields nameList nameList", provideNameList, nameList);
    // Collect result in promise list
    const promiseList: Promise<FieldError>[] = [];
    let namePathList: any = [];

    this.getFieldEntities(true).forEach((field: any) => {
      // console.log("validateFields FIELD", field);
      // console.log("validateFields FIELD", field.props.rules);

      // Skip if without rule
      if (!field.props.rules || !field.props.rules.length) {
        return;
      }

      const fieldNamePath = field.getNamePath();

      // Add field validate rule in to promise list
      // if (!provideNameList || containsNamePath(namePathList, fieldNamePath)) {
      const promise = field.validateRules({
        validateMessages: {
          ...defaultValidateMessages,
          ...this.validateMessages,
        },
        ...options,
      });
      // const promise = field.validateRules();

      // console.log("validateFields FIELD Promise", promise);

      // Wrap promise with field
      promiseList.push(
        //@ts-ignore
        promise
          .then<any, RuleError>(() => ({
            name: fieldNamePath,
            errors: [],
            warnings: [],
          }))
          .catch((ruleErrors: RuleError[]) => {
            const mergedErrors: string[] = [];
            const mergedWarnings: string[] = [];

            ruleErrors.forEach(({ rule: { warningOnly }, errors }) => {
              if (warningOnly) {
                mergedWarnings.push(...errors);
              } else {
                mergedErrors.push(...errors);
              }
            });

            if (mergedErrors.length) {
              return Promise.reject({
                name: fieldNamePath,
                errors: mergedErrors,
                warnings: mergedWarnings,
              });
            }

            return {
              name: fieldNamePath,
              errors: mergedErrors,
              warnings: mergedWarnings,
            };
          })
      );
    });

    const summaryPromise = allPromiseFinish(promiseList);

    this.lastValidatePromise = summaryPromise;

    // console.log("summaryPromise", summaryPromise, promiseList);

    const returnPromise: Promise<Store | ValidateErrorEntity | string[]> =
      summaryPromise
        .then((): Promise<Store | string[]> => {
          if (this.lastValidatePromise === summaryPromise) {
            //@ts-ignore
            return Promise.resolve(this.getFieldsValue(namePathList));
          }
          return Promise.reject<string[]>([]);
        })
        .catch((results: { name: InternalNamePath; errors: string[] }[]) => {
          const errorList = results.filter(
            (result) => result && result.errors.length
          );
          return Promise.reject({
            values: this.getFieldsValue(namePathList),
            errorFields: errorList,
            outOfDate: this.lastValidatePromise !== summaryPromise,
          });
        });

    // Do not throw in console
    returnPromise.catch<ValidateErrorEntity>((e) => e);

    // console.log("returnPromise", returnPromise);
    return returnPromise as Promise<Store>;
  };

  //==============Submit=============
  private submit = () => {
    console.log("method class");
    this.validateFields()
      .then((values) => {
        const { onFinish } = this.callbacks;
        console.log("FINFISH ", onFinish, this.callbacks);
        if (onFinish) {
          try {
            onFinish(values);
          } catch (err) {
            // Should print error if user `onFinish` callback failed
            console.error(err);
          }
        }
      })
      .catch((e) => {
        const { onFinishFailed } = this.callbacks;
        if (onFinishFailed) {
          onFinishFailed(e);
        }
      });
  };
}

export function useForm<Values = any>(
  form?: FormInstance<Values>
): [FormInstance<Values>] {
  const formRef = React.useRef<FormInstance>();

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      //@ts-ignore
      formRef.current = formStore.getForm();
    }
  }
  //@ts-ignore
  return [formRef.current];
}
export default useForm;
