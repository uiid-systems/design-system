"use client";

import NumberFlow from "@number-flow/react";

import { Text } from "../text/text";

import type { NumberProps } from "./number.types";

export const Number = ({
  value,
  format,
  locales,
  prefix,
  suffix,
  trend,
  animated,
  plugins,
  ...props
}: NumberProps) => {
  return (
    <Text
      data-slot="number"
      {...props}
      render={
        <NumberFlow
          value={value}
          format={format}
          locales={locales}
          prefix={prefix}
          suffix={suffix}
          trend={trend}
          animated={animated}
          plugins={plugins}
        />
      }
    />
  );
};
Number.displayName = "Number";
