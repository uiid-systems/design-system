import { Collapsible } from "@base-ui-components/react";

import { ChevronsUpDown } from "@uiid/icons";
import { Text } from "@uiid/typography";

import { ConditionalRender } from "../../conditional-render/conditional-render";
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
      ax="stretch"
      fullwidth
      className={styles["list-item-group"]}
      render={
        collapsible ? <Collapsible.Root render={<li />} defaultOpen /> : <li />
      }
    >
      {category && (
        <ConditionalRender
          condition={Boolean(collapsible)}
          render={
            <Collapsible.Trigger
              render={<Group gap={2} ay="center" fullwidth />}
              className={styles["list-item-group-collapsible-trigger"]}
            />
          }
        >
          {Icon && <Icon size={ICON_SIZE_LARGE} />}
          <Text
            render={<h3 />}
            level={0}
            bold
            data-is-collapsible={collapsible}
            className={styles["list-item-group-category"]}
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
        </ConditionalRender>
      )}

      <SwitchRender
        condition={Boolean(collapsible)}
        render={{
          true: (
            <Collapsible.Panel
              render={<ul className={styles["list-item-panel"]} />}
            />
          ),
          false: <ul className={styles["list-item-panel"]} />,
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
