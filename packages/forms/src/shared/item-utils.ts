type ItemToString<Value> = ((value: Value) => string) | undefined;

function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * The text a row shows for an item value, in Base UI's `stringifyAsLabel`
 * order: the caller's formatter, then an object's own `label`, then its
 * `value` field, then the value itself when it is a primitive. An object with
 * neither field, or whose `value` is itself an object, yields `undefined`
 * rather than `String(object)`, so a row never reads "[object Object]".
 */
export function resolveItemLabel<Value>(
  value: Value,
  itemToString?: ItemToString<Value>,
): string | undefined {
  if (value == null) return undefined;
  if (itemToString) return itemToString(value);
  if (typeof value === "object") {
    const item = value as { label?: unknown; value?: unknown };
    if (item.label != null) return String(item.label);
    return isPrimitive(item.value) ? String(item.value) : undefined;
  }
  return String(value);
}

/**
 * A React key for a row rendered from `items`. A string or number value is a
 * stable key. An object one is only an identity, so the caller's
 * `itemToStringValue` stands in, then `itemToStringLabel`, then the object's
 * own primitive `value` field, and the row's position when there is none.
 */
export function resolveItemKey<Value>(
  value: Value,
  index: number,
  {
    itemToStringValue,
    itemToStringLabel,
  }: {
    itemToStringValue?: ItemToString<Value>;
    itemToStringLabel?: ItemToString<Value>;
  } = {},
): string | number {
  if (typeof value === "string" || typeof value === "number") return value;
  if (value == null) return index;

  const formatted = itemToStringValue?.(value) || itemToStringLabel?.(value);
  if (formatted) return formatted;

  const own = (value as { value?: unknown }).value;
  return typeof own === "string" || typeof own === "number" ? own : index;
}
