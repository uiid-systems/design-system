import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { Box } from "../box/box";
import { ConditionalRender } from "../conditional-render/conditional-render";
import { Group } from "../group/group";
import { Stack } from "../stack/stack";
import { SwitchRender } from "../switch-render/switch-render";

import type { SeparatorProps } from "./separator.types";
import { separatorVariants } from "./separator.variants";
import styles from "./separator.module.css";

export const Separator = ({
  shade,
  orientation = "horizontal",
  className,
  children,
  render: _render,
  ...props
}: SeparatorProps) => {
  if (children) {
    const lineClass = cx(
      styles["separator"],
      styles["line"],
      styles[`line-${orientation}`],
      separatorVariants({ shade }),
    );

    return (
      <SwitchRender
        condition={orientation === "horizontal"}
        render={{
          true: <Group ay="center" gap={2} fullwidth />,
          false: <Stack ax="center" gap={2} fullheight />,
        }}
        role="separator"
        data-slot="separator"
        data-orientation={orientation}
        className={className}
        {...props}
      >
        <Box className={lineClass} />
        <ConditionalRender
          condition={typeof children === "string"}
          render={<Text shade="muted" weight="bold" />}
        >
          {children}
        </ConditionalRender>
        <Box className={lineClass} />
      </SwitchRender>
    );
  }

  return (
    <BaseSeparator
      data-slot="separator"
      render={_render ?? <Box />}
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
