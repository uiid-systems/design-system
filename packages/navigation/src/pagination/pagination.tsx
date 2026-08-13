import { ChevronLeftIcon } from "@uiid/icons/chevron-left";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { ChevronsLeftIcon } from "@uiid/icons/chevrons-left";
import { ChevronsRightIcon } from "@uiid/icons/chevrons-right";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { PaginationButton } from "./subcomponents";

export const Pagination = () => {
  return (
    <Group gap={2} ay="center">
      <Text size={0} shade="muted" mr={2}>
        Page 1 of 10
      </Text>

      <PaginationButton disabled aria-label="First page">
        <ChevronsLeftIcon />
      </PaginationButton>

      <PaginationButton disabled aria-label="Previous page">
        <ChevronLeftIcon />
      </PaginationButton>

      <PaginationButton aria-label="Next page">
        <ChevronRightIcon />
      </PaginationButton>

      <PaginationButton aria-label="Last page">
        <ChevronsRightIcon />
      </PaginationButton>
    </Group>
  );
};
Pagination.displayName = "Pagination";
