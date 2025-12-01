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
