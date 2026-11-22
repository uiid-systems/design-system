export type ModuleSpecifier = {
  /** The specifier as written between its quotes. */
  specifier: string;
  /** Offset of the specifier's first character, just after the opening quote. */
  start: number;
  /** Offset just past the specifier's last character, at the closing quote. */
  end: number;
};

export declare function moduleSpecifiers(text: string): ModuleSpecifier[];
