import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { BoxPropsSchema } from "../box";
import { stackPreviews } from "./previews";

/**
 * Stack component props schema.
 * Vertical flex layout (column direction by default).
 * Note: ax/ay semantics are swapped from Box (ax controls vertical, ay controls horizontal).
 */
export const StackPropsSchema = BoxPropsSchema;

export type StackProps = z.infer<typeof StackPropsSchema>;

export const StackEntry: ComponentEntry<typeof StackPropsSchema> = {
  name: "Stack",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: StackPropsSchema,
  description:
    "Vertical flex layout (column). ax controls vertical alignment, ay controls horizontal",
  category: "layout",
  defaults: {},
  previews: stackPreviews,
  usage: "Use Stack for vertical layouts. Children flow top-to-bottom. ax controls vertical alignment, ay horizontal.",
};
