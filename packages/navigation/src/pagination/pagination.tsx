"use client";

import { ChevronLeftIcon } from "@uiid/icons/chevron-left";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { ChevronsLeftIcon } from "@uiid/icons/chevrons-left";
import { ChevronsRightIcon } from "@uiid/icons/chevrons-right";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { PAGINATION_DEFAULT_PAGE } from "./pagination.constants";
import type { PaginationProps } from "./pagination.types";
import { clampPage } from "./pagination.utils";
import { PaginationButton } from "./subcomponents";

export const Pagination = ({
  totalPages,
  page: pageProp,
  defaultPage = PAGINATION_DEFAULT_PAGE,
  onPageChange,
  ...props
}: PaginationProps) => {
  const lastPage = Math.max(1, totalPages);

  // Controlled/uncontrolled state
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = pageProp !== undefined;
  const page = clampPage(isControlled ? pageProp : internalPage, lastPage);

  const goTo = (target: number) => {
    if (target === page) return;
    if (!isControlled) setInternalPage(target);
    onPageChange?.(target);
  };

  const controls = [
    { label: "First page", icon: <ChevronsLeftIcon />, target: 1 },
    { label: "Previous page", icon: <ChevronLeftIcon />, target: page - 1 },
    { label: "Next page", icon: <ChevronRightIcon />, target: page + 1 },
    { label: "Last page", icon: <ChevronsRightIcon />, target: lastPage },
  ];

  return (
    <Group
      render={<nav />}
      aria-label="Pagination"
      data-slot="pagination"
      gap={2}
      ay="center"
      {...props}
    >
      <Text
        data-slot="pagination-label"
        aria-live="polite"
        size={0}
        shade="muted"
        mr={2}
      >
        Page {page} of {lastPage}
      </Text>

      {controls.map(({ label, icon, target }) => (
        <PaginationButton
          key={label}
          aria-label={label}
          // A control whose target clamps back to the current page has nowhere to go
          disabled={clampPage(target, lastPage) === page}
          onClick={() => goTo(target)}
        >
          {icon}
        </PaginationButton>
      ))}
    </Group>
  );
};
Pagination.displayName = "Pagination";
