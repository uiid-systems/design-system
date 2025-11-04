import { Collapsible } from "@base-ui-components/react";

import { ChevronsUpDown } from "@uiid/icons";
import { Text } from "@uiid/typography";

import { ConditionalRender } from "../../conditional-render/conditional-render";
import { Stack } from "../../stack/stack";
import { SwitchRender } from "../../switch-render/switch-render";

import type { ListItemGroupProps } from "../list.types";

import styles from "./list-item-group.module.css";
import { ListItem } from "./list-item";

export const ListItemGroup = ({
  category,
  collapsible,
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
              className={styles["list-item-group-collapsible-trigger"]}
            />
          }
        >
          <Text
            render={<h3 />}
            level={0}
            bold
            data-is-collapsible={collapsible}
            className={styles["list-item-group-category"]}
          >
            {category}
          </Text>
          {collapsible && <ChevronsUpDown size={14} strokeWidth={3} />}
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
