export type Store = Record<string, StoreValue>;
export type StoreValue = any;
export type InternalNamePath = (string | number)[];
export type Rule = any;
export type NamePath = string | number | InternalNamePath;

type ValidateOptions = any;
type ValuedNotifyInfo = any;
type RuleError = any;
type ValidateMessages = any;

type FieldError = any;
type FieldData = any;
type Callbacks = any;

export interface Meta {
  touched: boolean;
  validating: boolean;
  errors: string[];
  warnings: string[];
  name: InternalNamePath;
}

export interface FieldEntity {
  onStoreChange: (
    store: Store,
    namePathList: InternalNamePath[] | null,
    info: ValuedNotifyInfo
  ) => void;
  isFieldTouched: () => boolean;
  isFieldDirty: () => boolean;
  isFieldValidating: () => boolean;
  isListField: () => boolean;
  isList: () => boolean;
  isPreserve: () => boolean;
  validateRules: (options?: ValidateOptions) => Promise<RuleError[]>;
  getMeta: () => Meta;
  getNamePath: () => InternalNamePath;
  getErrors: () => string[];
  getWarnings: () => string[];
  props: {
    name?: NamePath;
    rules?: Rule[];
    dependencies?: NamePath[];
    initialValue?: any;
  };
}

export interface FormInstance<Values = any> {
  //     // Origin Form API
  getFieldValue: (name: NamePath) => StoreValue;
  getFieldsValue(): Values;
  getFieldsValue(
    nameList: NamePath[] | true,
    filterFunc?: (meta: Meta) => boolean
  ): any;
  getFieldError: (name: NamePath) => string[];
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
  getFieldWarning: (name: NamePath) => string[];
  isFieldsTouched(nameList?: NamePath[], allFieldsTouched?: boolean): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched: (name: NamePath) => boolean;
  isFieldValidating: (name: NamePath) => boolean;
  isFieldsValidating: (nameList: NamePath[]) => boolean;
  resetFields: (fields?: NamePath[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldsValue: (values: any) => void;
  // setFieldsValue: (values: any) => void;
  // validateFields: ValidateFields<Values>;
  validateFields: any;
  submit: () => void;
}

export interface InternalHooks {
  dispatch: (action: any) => void;
  // initEntityValue: (entity: FieldEntity) => void;
  registerField: (entity: FieldEntity) => () => void;
  // useSubscribe: (subscribable: boolean) => void;
  setInitialValues: (values: Store, init: boolean) => void;
  setCallbacks: (callbacks: Callbacks) => void;
  getFields: (namePathList?: InternalNamePath[]) => FieldData[];
  setValidateMessages: (validateMessages: ValidateMessages) => void;
  // setPreserve: (preserve?: boolean) => void;
  getInitialValue: (namePath: InternalNamePath) => StoreValue;
}

export type InternalFormInstance = Omit<FormInstance, "validateFields"> & {
  validateFields: any;
  getInternalHooks: () => InternalHooks;
};
