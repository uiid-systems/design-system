import type { NumberFlowProps } from "@number-flow/react";

import type { TextProps } from "../text/text.types";

type InheritedNumberFlowProps = Pick<
  NumberFlowProps,
  | "value"
  | "format"
  | "locales"
  | "prefix"
  | "suffix"
  | "trend"
  | "animated"
  | "plugins"
>;

export type NumberProps = Omit<TextProps, "children" | "render"> &
  InheritedNumberFlowProps;
