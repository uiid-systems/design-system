import { Collapsible } from "@base-ui/react";

import { ChevronsUpDown } from "@uiid/icons";
import { Text } from "@uiid/typography";

import { Group } from "../../group/group";
import { Stack } from "../../stack/stack";
import { SwitchRender } from "../../switch-render/switch-render";

import type { ListItemGroupProps } from "../list.types";

import styles from "./list-item-group.module.css";
import { ListItem } from "./list-item";
import { ICON_SIZE_LARGE } from "../list.constants";

export const ListItemGroup = ({
  category,
  collapsible,
  icon: Icon,
  items,
}: ListItemGroupProps) => {
  return (
    <Stack
      data-slot="list-item-group"
      ax="stretch"
      fullwidth
      className={styles["list-item-group"]}
      render={
        collapsible ? <Collapsible.Root render={<li />} defaultOpen /> : <li />
      }
    >
      {category && (
        <Group
          data-slot="list-item-group-collapsible-trigger"
          gap={2}
          py={1}
          ay="center"
          fullwidth
          className={styles["list-item-group-collapsible-trigger"]}
          render={collapsible ? <Collapsible.Trigger /> : <div />}
        >
          {Icon && (
            <Icon data-slot="list-item-group-icon" size={ICON_SIZE_LARGE} />
          )}
          <Text
            data-slot="list-item-group-category-text"
            render={<h3 />}
            className={styles["list-item-group-category"]}
            size={0}
            weight="bold"
            data-is-collapsible={collapsible}
          >
            {category}
          </Text>
          {collapsible && (
            <ChevronsUpDown
              size={14}
              strokeWidth={3}
              style={{ marginInlineStart: "auto" }}
            />
          )}
        </Group>
      )}

      <SwitchRender
        condition={Boolean(collapsible)}
        render={{
          true: (
            <Collapsible.Panel
              render={
                <ul
                  data-slot="list-item-panel"
                  className={styles["list-item-panel"]}
                />
              }
            />
          ),
          false: (
            <ul
              data-slot="list-item-panel"
              className={styles["list-item-panel"]}
            />
          ),
        }}
      >
        {items.map((item) => (
          <ListItem key={item.value} {...item} />
        ))}
      </SwitchRender>
    </Stack>
  );
};
ListItemGroup.displayName = "ListItemGroup";
