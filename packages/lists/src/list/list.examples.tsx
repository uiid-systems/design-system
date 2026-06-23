import { Bug, Code, FileText, Folder, Hammer, Image, Star } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { List } from "./list";
import { ListGroup, ListItem } from "./subcomponents";

export const Default = () => (
  <List
    items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
  />
);

export const WithIcons = () => (
  <List
    items={[
      { label: "Feature", icon: Star },
      { label: "Fix", icon: Hammer },
      { label: "Bug", icon: Bug },
      { label: "Docs", icon: FileText },
    ]}
  />
);

export const WithDescriptions = () => (
  <List
    items={[
      {
        label: "Feature",
        description: "A net-new capability",
        icon: Star,
      },
      {
        label: "Fix",
        description: "Behavior correction on an existing feature",
        icon: Hammer,
      },
    ]}
  />
);

export const WithCategory = () => (
  <List
    category="Navigation"
    icon={Folder}
    items={[{ label: "Home" }, { label: "About" }, { label: "Contact" }]}
  />
);

export const NestedGroups = () => (
  <List
    items={[
      {
        category: "Source",
        icon: Folder,
        items: [
          {
            category: "Components",
            icon: Folder,
            items: [
              { label: "button.tsx", icon: Code },
              { label: "card.tsx", icon: Code },
            ],
          },
          {
            category: "Assets",
            icon: Folder,
            items: [
              { label: "logo.svg", icon: Image },
              { label: "banner.png", icon: Image },
            ],
          },
          { label: "index.ts", icon: FileText },
        ],
      },
    ]}
  />
);

export const Markers = () => {
  const items = [{ label: "First" }, { label: "Second" }, { label: "Third" }];
  return (
    <Group gap={8} ay="start">
      <Stack gap={2}>
        <Text size={0} weight="bold">
          none
        </Text>
        <List marker="none" items={items} />
      </Stack>
      <Stack gap={2}>
        <Text size={0} weight="bold">
          disc
        </Text>
        <List marker="disc" items={items} />
      </Stack>
      <Stack gap={2}>
        <Text size={0} weight="bold">
          decimal
        </Text>
        <List marker="decimal" items={items} />
      </Stack>
      <Stack gap={2}>
        <Text size={0} weight="bold">
          square
        </Text>
        <List marker="square" items={items} />
      </Stack>
    </Group>
  );
};

export const Composable = () => (
  <List>
    <ListItem label="First" icon={Star} />
    <ListItem label="Second" icon={Hammer} />
    <ListGroup
      category="Group"
      icon={Folder}
      items={[
        { label: "Nested 1", icon: Code },
        { label: "Nested 2", icon: Code },
      ]}
    />
  </List>
);
