"use client";

import { ChevronLeftIcon } from "@uiid/icons/chevron-left";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { ChevronsLeftIcon } from "@uiid/icons/chevrons-left";
import { ChevronsRightIcon } from "@uiid/icons/chevrons-right";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";
import { useState } from "react";

import { PAGINATION_DEFAULT_PAGE } from "./pagination.constants";
import type { PaginationProps } from "./pagination.types";
import { clampPage, getPaginationItems } from "./pagination.utils";
import { PaginationButton } from "./subcomponents";

import styles from "./pagination.module.css";

export const Pagination = ({
  totalPages,
  page: pageProp,
  defaultPage = PAGINATION_DEFAULT_PAGE,
  onPageChange,
  spread,
  renderLink,
  className,
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

  const controls = {
    first: { label: "First page", icon: <ChevronsLeftIcon />, target: 1 },
    previous: {
      label: "Previous page",
      icon: <ChevronLeftIcon />,
      target: page - 1,
    },
    next: { label: "Next page", icon: <ChevronRightIcon />, target: page + 1 },
    last: { label: "Last page", icon: <ChevronsRightIcon />, target: lastPage },
  };

  const renderControl = ({ label, icon, target }: typeof controls.first) => {
    // A control whose target clamps back to the current page has nowhere to go
    const disabled = clampPage(target, lastPage) === page;

    return (
      <PaginationButton
        key={label}
        aria-label={label}
        tooltip={label}
        shape="square"
        className={styles["pagination-cell"]}
        disabled={disabled}
        // A disabled control stays a button, so there's no link out of range
        render={disabled ? undefined : renderLink?.(target)}
        onClick={() => goTo(target)}
      >
        {icon}
      </PaginationButton>
    );
  };

  return (
    <Group
      render={<nav />}
      aria-label="Pagination"
      data-slot="pagination"
      data-layout={spread === undefined ? "compact" : "numbered"}
      className={cx(styles["pagination-panel"], className)}
      gap={0}
      ay="center"
      {...props}
    >
      {spread === undefined ? (
        <>
          <Text
            data-slot="pagination-label"
            aria-live="polite"
            className={cx(
              styles["pagination-cell"],
              styles["pagination-label"],
            )}
            size={0}
            shade="muted"
          >
            Page {page} of {lastPage}
          </Text>
          {Object.values(controls).map(renderControl)}
        </>
      ) : (
        <>
          {renderControl(controls.previous)}
          {getPaginationItems(page, lastPage, spread).map((item, index) =>
            item === "ellipsis" ? (
              <Text
                key={`ellipsis-${index}`}
                data-slot="pagination-ellipsis"
                aria-hidden
                className={cx(
                  styles["pagination-cell"],
                  styles["pagination-ellipsis"],
                )}
                size={0}
                shade="muted"
              >
                …
              </Text>
            ) : (
              <PaginationButton
                key={item}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                active={item === page}
                className={cx(
                  styles["pagination-cell"],
                  styles["pagination-item"],
                )}
                render={renderLink?.(item)}
                onClick={() => goTo(item)}
              >
                {item}
              </PaginationButton>
            ),
          )}
          {renderControl(controls.next)}
        </>
      )}
    </Group>
  );
};
Pagination.displayName = "Pagination";
