import { defineConfig, type VariantProps } from "cva";
import { twMerge } from "tailwind-merge";

const config = defineConfig({
  hooks: {
    onComplete: (className: string) => twMerge(className),
  },
});

const cva = config.cva;
const compose = config.compose;

function cx(...args: Parameters<typeof config.cx>): string | undefined {
  const merged = config.cx(...args);
  return merged.trim() ? merged : undefined;
}

export { cva, compose, cx };
export type { VariantProps };
