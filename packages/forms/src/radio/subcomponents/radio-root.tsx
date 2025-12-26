import { Radio as BaseRadio } from "@base-ui/react/radio";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";
import styles from "../radio.module.css";

import type { RadioRootProps } from "../radio.types";

export const RadioRoot = ({
  value,
  className,
  hideIndicator,
  children,
  ...props
}: RadioRootProps) => {
  return (
    <BaseRadio.Root
      data-slot="radio"
      value={value}
      render={
        <Group
          render={<button />}
          uiid="radio"
          ax="center"
          ay="center"
          p={0}
          m={0}
        />
      }
      className={cx(styles["radio"], className, {
        "sr-only": hideIndicator,
      })}
      {...props}
    >
      {children}
    </BaseRadio.Root>
  );
};
RadioRoot.displayName = "RadioRoot";
