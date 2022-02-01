//@ts-nocheck
import { InternalNamePath, Store, StoreValue } from "../interface";

export function get(entity: any, path: (string | number)[]) {
  let current = entity;

  for (let i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[path[i]];
  }

  return current;
}

function internalSet<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined: boolean
): Output {
  if (!paths.length) {
    return value as unknown as Output;
  }

  const [path, ...restPath] = paths;

  let clone: Output;
  if (!entity && typeof path === "number") {
    clone = [] as unknown as Output;
  } else if (Array.isArray(entity)) {
    clone = [...entity] as unknown as Output;
  } else {
    clone = { ...entity } as unknown as Output;
  }

  // Delete prop if `removeIfUndefined` and value is undefined
  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]];
  } else {
    clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined);
  }

  return clone;
}

export function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined: boolean = false
): Output {
  // Do nothing if `removeIfUndefined` and parent object not exist
  if (
    paths.length &&
    removeIfUndefined &&
    value === undefined &&
    !get(entity, paths.slice(0, -1))
  ) {
    return entity as unknown as Output;
  }

  return internalSet(entity, paths, value, removeIfUndefined);
}

export function getValue(store: Store, namePath: InternalNamePath) {
  const value = get(store, namePath);
  return value;
}

export function setValue(
  store: Store,
  namePath: InternalNamePath,
  value: StoreValue,
  removeIfUndefined = false
): Store {
  const newStore = set(store, namePath, value, removeIfUndefined);
  return newStore;
}

/**
 * Copy values into store and return a new values object
 * ({ a: 1, b: { c: 2 } }, { a: 4, b: { d: 5 } }) => { a: 4, b: { c: 2, d: 5 } }
 */
function internalSetValues<T>(store: T, values: T): T {
  const newStore: T = (Array.isArray(store) ? [...store] : { ...store }) as T;

  if (!values) {
    return newStore;
  }

  Object.keys(values).forEach((key) => {
    const prevValue = newStore[key];
    const value = values[key];

    // If both are object (but target is not array), we use recursion to set deep value
    // const recursive = isObject(prevValue) && isObject(value);

    const recursive =
      typeof prevValue === "object" && typeof value === "object";

    newStore[key] = recursive
      ? internalSetValues(prevValue, value || {})
      : value;
  });

  return newStore;
}

export function setValues<T>(store: T, ...restValues: T[]): T {
  return restValues.reduce(
    (current: T, newStore: T): T => internalSetValues<T>(current, newStore),
    store
  );
}

export function toArray<T>(value?: T | T[] | null): T[] {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
