export function applyPercentageMask(value: string): string {
  if (!value) return "";

  const parts = value.split(".");
  let result = parts[0] ?? "0";

  if (value.includes(".")) {
    result += `.${(parts[1] ?? "").substring(0, 2)}`;
  }

  return `${result}%`;
}
