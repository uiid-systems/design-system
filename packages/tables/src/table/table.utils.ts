import { isValidElement } from "react";

export function defaultFormatHeader<T extends Record<string, unknown>>(
  key: keyof T,
): React.ReactNode {
  const str = String(key);
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/** The default `formatCell`. Renders a React element as itself and a string,
 * number, bigint or boolean as text. An object renders its string form when
 * its `toString` is not the one inherited from `Object.prototype` (a `Date`, a
 * `URL`). An array prints only when every entry is a primitive; anything
 * richer is what `formatCell` is for. Everything else renders nothing: `null`,
 * `undefined`, a plain object, a function, a symbol. */
export function defaultFormatCell(value: unknown): React.ReactNode {
  if (isValidElement(value)) return value;

  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
      return String(value);
    case "object":
      return hasOwnStringForm(value) ? String(value) : null;
    default:
      return null;
  }
}

/** False for `null`, for an object whose string form would be the inherited
 * `[object Object]` or that has no `toString` at all (a null prototype), and
 * for an array whose joined form would print an entry that way. */
function hasOwnStringForm(value: object | null): boolean {
  if (value === null) return false;
  if (Array.isArray(value)) return value.every(isPrintablePrimitive);

  return (
    typeof value.toString === "function" &&
    value.toString !== Object.prototype.toString
  );
}

function isPrintablePrimitive(value: unknown): boolean {
  if (value == null) return true;

  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
      return true;
    default:
      return false;
  }
}
