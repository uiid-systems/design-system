import { Text } from "@uiid/typography";

import { ConditionalRender } from "../../conditional-render/conditional-render";
import { Stack } from "../../stack/stack";

import type { ListItemProps } from "../list.types";

import styles from "./list-text-block.module.css";

type ListTextBlockProps = Pick<ListItemProps, "label" | "description">;

export const ListTextBlock = ({ label, description }: ListTextBlockProps) => {
  return (
    <ConditionalRender condition={!!description} render={<Stack gap={2} />}>
      <Text level={1} className={styles["list-text-label"]}>
        {label}
      </Text>
      {description && (
        <Text level={0} className={styles["list-text-description"]}>
          {description}
        </Text>
      )}
    </ConditionalRender>
  );
};
ListTextBlock.displayName = "ListTextBlock";
