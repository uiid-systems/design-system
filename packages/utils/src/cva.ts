import { defineConfig, type VariantProps } from "cva";
import { twMerge } from "tailwind-merge";

const config = defineConfig({
  hooks: {
    onComplete: (className: string) => twMerge(className),
  },
});

const cva = config.cva;
const compose = config.compose;

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
  const merged = config.cx(...args);
  return merged.trim() ? merged : undefined;
}

/**
 * `cx` for a Base UI part's `className`. The caller's value may be a function
 * of the part's state, which `cx` has no state to call, so this returns a
 * function for Base UI to call instead: it resolves any function argument with
 * the part's state, then merges everything in order as `cx` would.
 *
 * With no function among the arguments it returns the merged string, as `cx`
 * would. A function prop cannot cross from a server component into a client
 * one, so a part composed on the server must still receive a string.
 */
function cxState<State>(
  ...args: (ClassValue | ((state: State) => string | undefined))[]
): string | ((state: State) => string | undefined) | undefined {
  if (!args.some((arg) => typeof arg === "function")) {
    return cx(...(args as ClassValue[]));
  }
  return (state) =>
    cx(...args.map((arg) => (typeof arg === "function" ? arg(state) : arg)));
}

export { cva, compose, cx, cxState };
export type { VariantProps };
