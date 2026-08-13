import { BugIcon } from "@uiid/icons/bug";
import { CodeIcon } from "@uiid/icons/code";
import { FileTextIcon } from "@uiid/icons/file-text";
import { FolderIcon } from "@uiid/icons/folder";
import { HammerIcon } from "@uiid/icons/hammer";
import { ImageIcon } from "@uiid/icons/image";
import { StarIcon } from "@uiid/icons/star";
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
      { label: "Feature", icon: StarIcon },
      { label: "Fix", icon: HammerIcon },
      { label: "BugIcon", icon: BugIcon },
      { label: "Docs", icon: FileTextIcon },
    ]}
  />
);

export const WithDescriptions = () => (
  <List
    items={[
      {
        label: "Feature",
        description: "A net-new capability",
        icon: StarIcon,
      },
      {
        label: "Fix",
        description: "Behavior correction on an existing feature",
        icon: HammerIcon,
      },
    ]}
  />
);

export const WithCategory = () => (
  <List
    category="Navigation"
    icon={FolderIcon}
    items={[{ label: "Home" }, { label: "About" }, { label: "Contact" }]}
  />
);

export const NestedGroups = () => (
  <List
    items={[
      {
        category: "Source",
        icon: FolderIcon,
        items: [
          {
            category: "Components",
            icon: FolderIcon,
            items: [
              { label: "button.tsx", icon: CodeIcon },
              { label: "card.tsx", icon: CodeIcon },
            ],
          },
          {
            category: "Assets",
            icon: FolderIcon,
            items: [
              { label: "logo.svg", icon: ImageIcon },
              { label: "banner.png", icon: ImageIcon },
            ],
          },
          { label: "index.ts", icon: FileTextIcon },
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
    <ListItem label="First" icon={StarIcon} />
    <ListItem label="Second" icon={HammerIcon} />
    <ListGroup
      category="Group"
      icon={FolderIcon}
      items={[
        { label: "Nested 1", icon: CodeIcon },
        { label: "Nested 2", icon: CodeIcon },
      ]}
    />
  </List>
);
