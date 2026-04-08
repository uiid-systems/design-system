/**
 * Generates a CSS variable token name from a path array
 * e.g., ["button", "border", "width"] -> "$button-border-width"
 */
export const generateTokenName = (path: string[]): string => {
  return `$${path.join("-")}`;
};

/**
 * Flattens a nested token object into an array of token rows
 * with proper path-based token names
 */
export interface FlattenedToken {
  name: string;
  value: string;
  tokenName: string;
  type: string;
  path: string[];
}

export const flattenTokens = (
  obj: any,
  basePath: string[] = [],
  nameTransform?: (path: string[]) => string,
): FlattenedToken[] => {
  const tokens: FlattenedToken[] = [];

  const traverse = (current: any, path: string[]) => {
    if (!current || typeof current !== "object") {
      return;
    }

    // If this object has $value, it's a token
    if ("$value" in current) {
      const displayName = nameTransform
        ? nameTransform(path)
        : path
            .map((part, idx) =>
              idx === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
            )
            .join(" ");

      tokens.push({
        name: displayName,
        value: current.$value,
        tokenName: generateTokenName(path),
        type: current.$type || "string",
        path,
      });
      return;
    }

    // Otherwise, traverse deeper
    Object.entries(current).forEach(([key, value]) => {
      // Skip metadata keys
      if (key.startsWith("$")) {
        return;
      }

      traverse(value, [...path, key]);
    });
  };

  traverse(obj, basePath);
  return tokens;
};

/**
 * Filters tokens by path depth (how many segments in the path)
 */
export const filterByDepth = (
  tokens: FlattenedToken[],
  depth: number,
): FlattenedToken[] => {
  return tokens.filter((token) => token.path.length === depth);
};

/**
 * Filters tokens that include a specific path segment
 */
export const filterByPathIncludes = (
  tokens: FlattenedToken[],
  segment: string,
): FlattenedToken[] => {
  return tokens.filter((token) => token.path.includes(segment));
};

/**
 * Filters tokens that exclude specific path segments
 */
export const filterByPathExcludes = (
  tokens: FlattenedToken[],
  segments: string[],
): FlattenedToken[] => {
  return tokens.filter(
    (token) => !segments.some((segment) => token.path.includes(segment)),
  );
};

/**
 * Filters tokens at a specific depth and excludes certain path segments
 */
export const filterTopLevel = (
  tokens: FlattenedToken[],
  depth: number,
  excludeSegments: string[],
): FlattenedToken[] => {
  return tokens.filter(
    (token) =>
      token.path.length === depth &&
      !excludeSegments.includes(token.path[depth - 1]),
  );
};

/**
 * Transforms token display names by slicing path and formatting
 */
export const transformDisplayName = (
  token: FlattenedToken,
  sliceStart: number,
  formatter: (part: string, idx: number) => string,
): FlattenedToken => {
  const name = token.path.slice(sliceStart).map(formatter).join("").trim();

  return { ...token, name };
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
