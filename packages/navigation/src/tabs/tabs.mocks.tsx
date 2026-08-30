import type { TabsProps } from "./tabs.types";

export const MOCK_TABS: TabsProps["items"] = [
  { label: "Tab 1", value: "tab-1", render: <p>Tab 1</p> },
  { label: "Tab 2", value: "tab-2", render: <p>Tab 2</p> },
  { label: "Tab 3", value: "tab-3", render: <p>Tab 3</p> },
];
