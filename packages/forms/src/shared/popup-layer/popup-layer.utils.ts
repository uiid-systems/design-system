/**
 * The text a popup row shows for an item value, resolved the way Base UI
 * resolves the input's text: the caller's formatter first, then a `label` on an
 * object value, then the value itself when it is a primitive. An object with
 * neither yields `undefined` rather than `String(value)`, so a row never reads
 * "[object Object]".
 */
export function resolveItemLabel<Value>(
  value: Value,
  itemToString?: (value: Value) => string,
): string | undefined {
  if (value == null) return undefined;
  if (itemToString) return itemToString(value);
  if (typeof value === "object") {
    const { label } = value as { label?: unknown };
    return label == null ? undefined : String(label);
  }
  return String(value);
}

/**
 * A React key for a row rendered from Root's `items`. A string or number value
 * is a stable key. An object one is only an identity, so the caller's
 * string formatter stands in when there is one, and the row's position when
 * there is not, as in `Select`.
 */
export function resolveItemKey<Value>(
  value: Value,
  index: number,
  itemToString?: (value: Value) => string,
): string | number {
  if (typeof value === "string" || typeof value === "number") return value;
  return (value != null && itemToString?.(value)) || index;
}
