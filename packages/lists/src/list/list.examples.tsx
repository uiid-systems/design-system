import {
  Bug,
  Code,
  FileText,
  Folder,
  Hammer,
  Image,
  Star,
} from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { List } from "./list";
import { ListGroup, ListItem } from "./subcomponents";

export const Default = () => (
  <List
    items={[
      { value: "1", label: "Item 1" },
      { value: "2", label: "Item 2" },
      { value: "3", label: "Item 3" },
    ]}
  />
);

export const WithIcons = () => (
  <List
    items={[
      { value: "feature", label: "Feature", icon: Star },
      { value: "fix", label: "Fix", icon: Hammer },
      { value: "bug", label: "Bug", icon: Bug, selected: true },
      { value: "docs", label: "Docs", icon: FileText, disabled: true },
    ]}
  />
);

export const WithDescriptions = () => (
  <List
    items={[
      {
        value: "feature",
        label: "Feature",
        description: "A net-new capability",
        icon: Star,
      },
      {
        value: "fix",
        label: "Fix",
        description: "Behavior correction on an existing feature",
        icon: Hammer,
      },
    ]}
  />
);

export const NestedGroups = () => (
  <List
    line
    items={[
      {
        category: "Source",
        icon: Folder,
        items: [
          {
            category: "Components",
            icon: Folder,
            items: [
              { value: "button.tsx", label: "button.tsx", icon: Code },
              { value: "card.tsx", label: "card.tsx", icon: Code },
            ],
          },
          {
            category: "Assets",
            icon: Folder,
            items: [
              { value: "logo.svg", label: "logo.svg", icon: Image },
              { value: "banner.png", label: "banner.png", icon: Image },
            ],
          },
          { value: "index.ts", label: "index.ts", icon: FileText },
        ],
      },
    ]}
  />
);

export const Markers = () => {
  const items = [
    { value: "1", label: "First" },
    { value: "2", label: "Second" },
    { value: "3", label: "Third" },
  ];
  return (
    <Group gap={8} ay="start">
      <Stack gap={2}>
        <Text size={0} weight="bold">none</Text>
        <List marker="none" items={items} />
      </Stack>
      <Stack gap={2}>
        <Text size={0} weight="bold">disc</Text>
        <List marker="disc" items={items} />
      </Stack>
      <Stack gap={2}>
        <Text size={0} weight="bold">decimal</Text>
        <List marker="decimal" items={items} />
      </Stack>
      <Stack gap={2}>
        <Text size={0} weight="bold">square</Text>
        <List marker="square" items={items} />
      </Stack>
    </Group>
  );
};

export const Composable = () => (
  <List>
    <ListItem label="First" icon={Star} />
    <ListItem label="Second" icon={Hammer} selected />
    <ListGroup
      category="Group"
      icon={Folder}
      items={[
        { value: "nested-1", label: "Nested 1", icon: Code },
        { value: "nested-2", label: "Nested 2", icon: Code },
      ]}
    />
  </List>
);
