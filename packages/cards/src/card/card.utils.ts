/**
 * Whether `node` is plain text — strings, numbers, and the empty values React
 * skips — so it can sit inside a heading. Any element in it is not.
 */
export const isTextContent = (node: React.ReactNode): boolean =>
  Array.isArray(node)
    ? node.every(isTextContent)
    : node === null ||
      node === undefined ||
      typeof node === "string" ||
      typeof node === "number" ||
      typeof node === "boolean";
