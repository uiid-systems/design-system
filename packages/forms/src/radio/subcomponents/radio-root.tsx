import { Radio as BaseRadio } from "@base-ui-components/react/radio";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";
import styles from "../radio.module.css";

import type { RadioProps } from "../radio.types";

export type RadioRootProps = BaseRadio.Root.Props &
  Pick<RadioProps, "value" | "className" | "hideIndicator">;

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
      render={<Group uiid="radio" ax="center" ay="center" p={0} m={0} />}
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
