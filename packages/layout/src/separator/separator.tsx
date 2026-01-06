import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { Box } from "../box/box";

import { cx } from "@uiid/utils";

import type { SeparatorProps } from "./separator.types";
import { separatorVariants } from "./separator.variants";
import styles from "./separator.module.css";

export const Separator = ({
  shade,
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) => {
  return (
    <BaseSeparator
      data-slot="separator"
      render={<Box />}
      className={cx(
        styles["separator"],
        separatorVariants({ shade, orientation }),
        className,
      )}
      data-orientation={orientation}
      {...props}
    />
  );
};
Separator.displayName = "Separator";
