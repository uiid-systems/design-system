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

export { cva, cx };
export type { VariantProps };
