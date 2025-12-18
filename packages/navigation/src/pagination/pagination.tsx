import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
} from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { PaginationButton } from "./subcomponents";

export const Pagination = () => {
  return (
    <Group gap={2} ay="center">
      <Text level={0} shade="accent" mr={2}>
        Page 1 of 10
      </Text>

      <PaginationButton disabled aria-label="First page">
        <ChevronsLeft />
      </PaginationButton>

      <PaginationButton disabled aria-label="Previous page">
        <ChevronLeft />
      </PaginationButton>

      <PaginationButton aria-label="Next page">
        <ChevronRight />
      </PaginationButton>

      <PaginationButton aria-label="Last page">
        <ChevronsRight />
      </PaginationButton>
    </Group>
  );
};
Pagination.displayName = "Pagination";
