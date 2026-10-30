import type { Icon } from "@uiid/icons";
import { BanIcon } from "@uiid/icons/ban";
import { CircleCheckIcon } from "@uiid/icons/circle-check";
import { CircleDashedIcon } from "@uiid/icons/circle-dashed";
import { CircleXIcon } from "@uiid/icons/circle-x";
import { ClockIcon } from "@uiid/icons/clock";
import { LoaderCircleIcon } from "@uiid/icons/loader-circle";
import type { BadgeProps } from "@uiid/indicators";

import type { ToolState } from "../ai.types";

type ToolStateEntry = {
  label: string;
  icon: Icon;
  color: NonNullable<BadgeProps["color"]>;
  /** The icon turns while the tool runs. */
  spin?: true;
};

/**
 * One row per `ToolState`: the badge's label, icon and hue. Seven states on
 * seven hues, so no two badges share a color.
 */
export const TOOL_STATES: Record<ToolState, ToolStateEntry> = {
  "input-streaming": {
    label: "Pending",
    icon: CircleDashedIcon,
    color: "neutral",
  },
  "input-available": {
    label: "Running",
    icon: LoaderCircleIcon,
    color: "blue",
    spin: true,
  },
  "approval-requested": {
    label: "Awaiting approval",
    icon: ClockIcon,
    color: "yellow",
  },
  "approval-responded": {
    label: "Responded",
    icon: CircleCheckIcon,
    color: "indigo",
  },
  "output-available": {
    label: "Completed",
    icon: CircleCheckIcon,
    color: "green",
  },
  "output-error": { label: "Error", icon: CircleXIcon, color: "red" },
  "output-denied": { label: "Denied", icon: BanIcon, color: "orange" },
};

export const TOOL_LABELS = {
  input: "Parameters",
  output: "Result",
  error: "Error",
} as const;
