// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as indicators from "./index";

// Components, their parts and their prop types. Constants and variant
// functions are internal.
const values = [
  "Avatar",
  "AvatarContainer",
  "AvatarDescription",
  "AvatarImage",
  "AvatarInitials",
  "AvatarLayers",
  "AvatarName",
  "Badge",
  "Kbd",
  "Progress",
  "ProgressHeader",
  "ProgressIndicator",
  "ProgressLabel",
  "ProgressRoot",
  "ProgressTrack",
  "ProgressValue",
  "Status",
];

const types = [
  "AvatarContainerProps",
  "AvatarDescriptionProps",
  "AvatarImageProps",
  "AvatarInitialsProps",
  "AvatarLayersProps",
  "AvatarNameProps",
  "AvatarProps",
  "AvatarType",
  "AvatarVariants",
  "BadgeProps",
  "BadgeVariants",
  "KbdProps",
  "ProgressColor",
  "ProgressHeaderProps",
  "ProgressIndicatorProps",
  "ProgressLabelProps",
  "ProgressProps",
  "ProgressRootProps",
  "ProgressTrackProps",
  "ProgressValueProps",
  "ProgressVariants",
  "StatusProps",
  "StatusVariants",
];

describe("@uiid/indicators barrel", () => {
  it("exports exactly the components and parts", () => {
    expect(Object.keys(indicators).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
