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

/** Renders a React element as itself and a string, number, bigint or boolean
 * as text. Everything else is an empty cell: `null`, `undefined`, and the
 * objects, arrays, functions and symbols that have no meaningful text form. */
export function defaultFormatCell(value: unknown): React.ReactNode {
  if (isValidElement(value)) return value;

  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
      return String(value);
    default:
      return "";
  }
}
