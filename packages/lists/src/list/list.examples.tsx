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

const MARKERS = ["none", "disc", "decimal", "square"] as const;

/**
 * Every row shape in one list, so the numbering reads across all of them: a
 * label, an icon row, composed `children`, and a group whose items restart.
 */
export const Markers = () => (
  <Group gap={8} ay="start">
    {MARKERS.map((marker) => (
      <Stack key={marker} gap={2}>
        <Text size={0} weight="bold">
          {marker}
        </Text>
        <List marker={marker}>
          <ListItem label="Label" />
          <ListItem label="Icon" icon={StarIcon} />
          <ListItem>
            <Text size={0}>Children</Text>
          </ListItem>
          <ListGroup
            category="Group"
            items={[{ label: "Nested" }, { label: "Nested" }]}
          />
        </List>
      </Stack>
    ))}
  </Group>
);

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
