import type { ComponentEntry } from "../types";

import { TextPropsSchema } from "../schemas/typography";

export const TextEntry: ComponentEntry<typeof TextPropsSchema> = {
  name: "Text",
  package: "@uiid/typography",
  hasChildren: true,
  propsSchema: TextPropsSchema,
  description:
    "Typography component with size scale, weight, color shades, and text decorations",
  category: "typography",
  defaults: {},
};
