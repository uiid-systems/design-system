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

      <PaginationButton
        disabled
        aria-label="First page"
        icon={<ChevronsLeft />}
      />
      <PaginationButton
        disabled
        aria-label="Previous page"
        icon={<ChevronLeft />}
      />

      {/* <PaginationButton active>1</PaginationButton>
      <PaginationButton>2</PaginationButton>
      <PaginationButton>3</PaginationButton> */}

      <PaginationButton aria-label="Next page" icon={<ChevronRight />} />
      <PaginationButton aria-label="Last page" icon={<ChevronsRight />} />
    </Group>
  );
};
Pagination.displayName = "Pagination";
