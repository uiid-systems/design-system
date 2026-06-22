"use client";

import { Collapsible } from "@base-ui/react";

import { ChevronsUpDown } from "@uiid/icons";
import { Text } from "@uiid/typography";
import { Group, Stack, SwitchRender } from "@uiid/layout";

import type { ListGroupProps } from "../list.types";

import { ListItem } from "./list-item";
import { ICON_SIZE_LARGE } from "../list.constants";
import styles from "../list.module.css";

export const ListGroup = ({
  category,
  collapsible,
  open,
  defaultOpen = true,
  onOpenChange,
  icon: Icon,
  items,
}: ListGroupProps) => {
  return (
    <Stack
      data-slot="list-group"
      ax="stretch"
      fullwidth
      className={styles["list-group"]}
      render={
        collapsible ? (
          <Collapsible.Root
            render={<li />}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
          />
        ) : (
          <li />
        )
      }
    >
      {category && (
        <Group
          data-slot="list-group-trigger"
          render={collapsible ? <Collapsible.Trigger /> : <div />}
          className={styles["list-group-trigger"]}
          ay="center"
          ax="start"
          gap={2}
          py={2}
          fullwidth
        >
          {collapsible && <ChevronsUpDown size={14} strokeWidth={3} />}
          {Icon && <Icon data-slot="list-group-icon" size={ICON_SIZE_LARGE} />}
          <Text
            data-slot="list-group-category"
            render={<h3 />}
            className={styles["list-group-category"]}
            data-is-collapsible={collapsible}
            mr={collapsible ? 8 : undefined}
            weight="bold"
            size={0}
          >
            {category}
          </Text>
        </Group>
      )}

      <SwitchRender
        condition={Boolean(collapsible)}
        render={{
          true: (
            <Collapsible.Panel
              render={
                <ul
                  data-slot="list-group-panel"
                  className={styles["list-group-panel"]}
                />
              }
            />
          ),
          false: (
            <ul
              data-slot="list-group-panel"
              className={styles["list-group-panel"]}
            />
          ),
        }}
      >
        {items.map((item) =>
          "items" in item ? (
            <ListGroup key={item.id ?? item.category} {...item} />
          ) : (
            <ListItem key={item.value} {...item} />
          ),
        )}
      </SwitchRender>
    </Stack>
  );
};
ListGroup.displayName = "ListGroup";
