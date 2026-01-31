import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { BoxPropsSchema } from "../box";
import { groupPreviews } from "./previews";

/**
 * Group component props schema.
 * Horizontal flex layout (row direction by default).
 */
export const GroupPropsSchema = BoxPropsSchema;

export type GroupProps = z.infer<typeof GroupPropsSchema>;

export const GroupEntry: ComponentEntry<typeof GroupPropsSchema> = {
  name: "Group",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: GroupPropsSchema,
  description:
    "Horizontal flex layout (row). ax controls horizontal alignment, ay controls vertical",
  category: "layout",
  defaults: {},
  previews: groupPreviews,
  usage: "Use Group for horizontal layouts. Children flow left-to-right. ax controls horizontal alignment, ay vertical.",
};
