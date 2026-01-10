export function fromUnmaskedIndex(opts: {
  masked: string;
  pattern: string;
  unmaskedIndex: number;
}): number {
  const { masked, pattern, unmaskedIndex } = opts;

  let seen = 0;
  for (let i = 0; i < masked.length && i < pattern.length; i++) {
    if (pattern[i] === "#") {
      seen++;
      if (seen === unmaskedIndex) {
        return i + 1;
      }
    }
  }

  return masked.length;
}
