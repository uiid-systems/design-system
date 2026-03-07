/**
 * Strip JSONC (JSON with comments) to valid JSON.
 * Handles // line comments, /* block comments, and trailing commas.
 */
export function stripJsonc(input: string): string {
  let result = "";
  let i = 0;

  while (i < input.length) {
    // String literal — pass through unchanged
    if (input[i] === '"') {
      let j = i + 1;
      while (j < input.length && input[j] !== '"') {
        if (input[j] === "\\") j++; // skip escaped char
        j++;
      }
      result += input.slice(i, j + 1);
      i = j + 1;
    }
    // Line comment
    else if (input[i] === "/" && input[i + 1] === "/") {
      let j = i + 2;
      while (j < input.length && input[j] !== "\n") j++;
      i = j;
    }
    // Block comment
    else if (input[i] === "/" && input[i + 1] === "*") {
      let j = i + 2;
      while (j < input.length - 1 && !(input[j] === "*" && input[j + 1] === "/"))
        j++;
      i = j + 2;
    } else {
      result += input[i];
      i++;
    }
  }

  // Remove trailing commas before ] or }
  return result.replace(/,\s*([\]}])/g, "$1");
}
