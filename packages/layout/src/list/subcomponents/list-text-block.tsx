import { Text } from "@uiid/typography";

import { ConditionalRender } from "../../conditional-render/conditional-render";
import { Stack } from "../../stack/stack";

import type { ListItemProps } from "../list.types";

import styles from "./list-text-block.module.css";

type ListTextBlockProps = Pick<ListItemProps, "label" | "description">;

export const ListTextBlock = ({
  label,
  description,
  ...props
}: ListTextBlockProps) => {
  return (
    <ConditionalRender
      condition={!!description}
      render={<Stack data-slot="list-text-block" gap={2} {...props} />}
    >
      <Text
        data-slot="list-text-label"
        level={0}
        className={styles["list-text-label"]}
      >
        {label}
      </Text>
      {description && (
        <Text
          data-slot="list-text-description"
          level={0}
          className={styles["list-text-description"]}
        >
          {description}
        </Text>
      )}
    </ConditionalRender>
  );
};
ListTextBlock.displayName = "ListTextBlock";
