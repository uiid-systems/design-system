import { ConditionalRender, Stack } from "@uiid/layout";

import type { ListItemProps } from "../list.types";

import { ListLabel } from "./list-label";
import { ListDescription } from "./list-description";

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
      <ListLabel>{label}</ListLabel>
      {description && <ListDescription>{description}</ListDescription>}
    </ConditionalRender>
  );
};
ListTextBlock.displayName = "ListTextBlock";
