import { Text } from "@uiid/typography";
import { ConditionalRender, Stack } from "@uiid/layout";

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
        size={0}
        className={styles["list-text-label"]}
      >
        {label}
      </Text>
      {description && (
        <Text
          data-slot="list-text-description"
          size={0}
          className={styles["list-text-description"]}
        >
          {description}
        </Text>
      )}
    </ConditionalRender>
  );
};
ListTextBlock.displayName = "ListTextBlock";
