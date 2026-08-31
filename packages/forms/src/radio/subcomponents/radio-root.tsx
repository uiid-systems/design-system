"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { RADIO_DEFAULT_SIZE } from "../radio.constants";
import type { RadioRootProps } from "../radio.types";
import { radioVariants } from "../radio.variants";

import styles from "../radio.module.css";

export const RadioRoot = ({
  value,
  size = RADIO_DEFAULT_SIZE,
  className,
  hideIndicator,
  children,
  ...props
}: RadioRootProps) => {
  return (
    <BaseRadio.Root
      data-slot="radio"
      value={value}
      nativeButton
      render={<Group render={<button />} ax="center" ay="center" p={0} m={0} />}
      className={cx(styles["radio"], radioVariants({ size }), className, {
        "sr-only": hideIndicator,
      })}
      {...props}
    >
      {children}
    </BaseRadio.Root>
  );
};
RadioRoot.displayName = "RadioRoot";
