import { cva, cx as cvaCx, type VariantProps } from "cva";

/*
 * Plain concatenation, no Tailwind merging: every class a component passes is
 * a hashed CSS-module name, which never conflicts with a caller's class.
 */

/**
 * cva's `ClassDictionary` is `Record<string, any>`, which a function satisfies,
 * so a Base UI state-function `className` type-checked as a class value and was
 * then skipped at runtime. Every function has a `call` member, so forbidding
 * one here rejects functions while still admitting `{ "sr-only": hidden }`.
 */
type ClassDictionary = { [key: string]: unknown; call?: never };
type ClassArray = ClassValue[];
type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;

function cx(...args: ClassValue[]): string | undefined {
  const merged = cvaCx(...(args as Parameters<typeof cvaCx>));
  return merged.trim() ? merged : undefined;
}

/**
 * A Base UI part's props with `className` narrowed to a string. Base UI also
 * takes a function of the part's state there, but `cx` has no state to call
 * one with, so a UIID part takes a string and merges it with its own class.
 * Style a state through the `data-*` attribute Base UI sets for it instead.
 */
type WithStringClassName<Props> = Omit<Props, "className"> & {
  className?: string;
};

export { cva, cx };
export type { VariantProps, WithStringClassName };
