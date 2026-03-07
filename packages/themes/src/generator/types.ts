/**
 * Minimal interface that the theme generator requires from a token registry.
 *
 * This allows the generator to work with any compatible registry implementation
 * (e.g., TokenGenerator from @uiid/tokens) via dependency injection.
 */
export interface TokenRegistry {
  /** Flat map of dot-path → token object (e.g., "shade.1" → { $value, $extensions, ... }) */
  registry: Map<string, TokenEntry>;
  /** Resolve a token reference like "{shade.background}" to light/dark hex pair */
  resolveToHexPair(ref: string): { light: string; dark: string };
  /** Apply a map of token-path → hex overrides to the registry */
  applyOverrides(overrides: Map<string, string>): void;
  /** Discover JSON token files in the default directory */
  discoverJsonFiles(dir: string): string[];
  /** Build the registry from discovered JSON files */
  buildRegistry(files: string[]): void;
  /** Path to the JSON token source directory */
  jsonDir: string;
}

export interface TokenEntry {
  $value?: string;
  $type?: string;
  $extensions?: {
    "org.uiid.derive"?: {
      method: "mix" | "light-dark";
      light?: string;
      dark?: string;
      color1?: string;
      color2?: string;
      ratio?: number;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ContrastWarning {
  level: "error" | "warning";
  pair: string;
  mode: string;
  ratio: number;
  required: number;
  message: string;
}
