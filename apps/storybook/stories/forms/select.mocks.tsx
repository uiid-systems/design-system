import type { SelectItemProps } from "@uiid/design-system";
import { BugIcon } from "@uiid/icons/bug";
import { GhostIcon } from "@uiid/icons/ghost";
import { HammerIcon } from "@uiid/icons/hammer";
import { HomeIcon } from "@uiid/icons/house";
import { StarIcon } from "@uiid/icons/star";

export const MOCK_SELECT_ITEMS: SelectItemProps[] = [
  { label: "Select font", value: "", icon: HomeIcon, disabled: true },
  { label: "Sans-serif", value: "sans", icon: StarIcon },
  { label: "Serif", value: "serif", icon: GhostIcon },
  { label: "Monospace", value: "mono", icon: HammerIcon },
  { label: "Cursive", value: "cursive", icon: BugIcon },
];
