// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as cards from "./index";

// Components, their parts and their prop types. Constants and the padding
// helpers are internal.
const values = [
  "Card",
  "CardAction",
  "CardContainer",
  "CardDescription",
  "CardFooter",
  "CardThumbnail",
  "CardTitle",
  "CollapsibleCard",
];

const types = [
  "CardActionProps",
  "CardColor",
  "CardContainerProps",
  "CardDescriptionProps",
  "CardFooterProps",
  "CardHeaderProps",
  "CardProps",
  "CardThumbnailProps",
  "CardTitleProps",
  "CollapsibleCardProps",
  "InnerContainerProps",
];

describe("@uiid/cards barrel", () => {
  it("exports exactly the components and parts", () => {
    expect(Object.keys(cards).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
