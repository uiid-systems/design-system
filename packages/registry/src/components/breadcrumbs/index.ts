import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { breadcrumbsPreviews } from "./previews";

/**
 * Breadcrumbs item schema.
 */
export const BreadcrumbsItemSchema = z.object({
  /** Display label */
  label: z.string(),
  /** Link href value */
  value: z.string(),
});

/**
 * Breadcrumbs component props schema.
 */
export const BreadcrumbsPropsSchema = z.object({
  /** Breadcrumb items */
  items: z.array(BreadcrumbsItemSchema),
});

export type BreadcrumbsProps = z.infer<typeof BreadcrumbsPropsSchema>;

export const BreadcrumbsEntry: ComponentEntry<typeof BreadcrumbsPropsSchema> = {
  name: "Breadcrumbs",
  package: "@uiid/navigation",
  hasChildren: false,
  propsSchema: BreadcrumbsPropsSchema,
  description: "Breadcrumb navigation showing page hierarchy",
  category: "navigation",
  defaults: {},
  previews: breadcrumbsPreviews,
  usage: "Use to show navigation hierarchy. Last item is typically the current page.",
};
