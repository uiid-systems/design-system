import { Home, Star, Hammer, Bug, Ghost } from "@uiid/icons";

import type { SelectItemProps } from "./select.types";

export const MOCK_FONTS: SelectItemProps[] = [
  { label: "Select font", value: "", icon: Home, disabled: true },
  { label: "Sans-serif", value: "sans", icon: Star },
  { label: "Serif", value: "serif", icon: Ghost },
  { label: "Monospace", value: "mono", icon: Hammer },
  { label: "Cursive", value: "cursive", icon: Bug },
];
