export function toUnmaskedIndex(opts: {
  masked: string;
  pattern: string;
  caret: number;
}): number {
  const { masked, pattern, caret } = opts;

  let idx = 0;
  for (let i = 0; i < caret && i < masked.length && i < pattern.length; i++) {
    if (pattern[i] === "#") {
      idx++;
    }
  }

  return idx;
}
