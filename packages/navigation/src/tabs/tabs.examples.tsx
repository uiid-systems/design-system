"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "./subcomponents";
import { Tabs } from "./tabs";
import type { TabsItemData } from "./tabs.types";

const ITEMS: TabsItemData[] = [
  {
    label: "Overview",
    value: "overview",
    content: <Text>A summary of the project and its goals.</Text>,
  },
  {
    label: "Activity",
    value: "activity",
    content: <Text>Recent changes, newest first.</Text>,
  },
  {
    label: "Settings",
    value: "settings",
    content: <Text>Who can see the project, and how it notifies you.</Text>,
  },
];

/* The first item's tab is active until another is chosen. */
export const Default = () => <Tabs items={ITEMS} />;

export const DefaultValue = () => (
  <Tabs items={ITEMS} defaultValue="activity" />
);

/* `value` and `onValueChange` hold the active tab in your own state. */
export const Controlled = () => {
  const [tab, setTab] = useState("overview");

  return (
    <Stack gap={3} w="full">
      <Tabs items={ITEMS} value={tab} onValueChange={setTab} />
      <Text size={-1} emphasis="muted">
        Active tab: {tab}
      </Text>
    </Stack>
  );
};

/* The list's tier matches the form-control rows. */
export const Sizes = () => (
  <Stack gap={6} w="full">
    {(["xsmall", "small", "medium", "large"] as const).map((size) => (
      <Tabs key={size} items={ITEMS} size={size} />
    ))}
  </Stack>
);

/* `ghost` drops the list's background and border. */
export const Ghost = () => <Tabs items={ITEMS} variant="ghost" />;

/* The list keeps its content width; `w="full"` stretches it. */
export const FullWidth = () => <Tabs items={ITEMS} ListProps={{ w: "full" }} />;

/* `keepMounted` leaves inactive panels in the DOM, hidden, instead of
   unmounting them, so their state survives switching tabs. */
export const KeepMounted = () => <Tabs items={ITEMS} keepMounted />;

/* Compose the parts when a tab or panel needs more than the item shape. */
export const Composed = () => (
  <TabsRoot defaultValue="files" gap={4} w="full">
    <TabsList>
      <TabsTab value="files">Files</TabsTab>
      <TabsTab value="history">History</TabsTab>
      <TabsTab value="archived" disabled>
        Archived
      </TabsTab>
      <TabsIndicator />
    </TabsList>
    <TabsPanel value="files" gap={2} ax="start">
      <Text weight="bold">12 files</Text>
      <Text emphasis="muted">Last uploaded this morning.</Text>
    </TabsPanel>
    <TabsPanel value="history" ax="start">
      <Text>No changes this week.</Text>
    </TabsPanel>
    <TabsPanel value="archived" ax="start">
      <Text>Nothing archived.</Text>
    </TabsPanel>
  </TabsRoot>
);
