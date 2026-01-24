/**
 * Catalog adapter for json-render.
 *
 * Derives the catalog from the UIID registry — no manual duplication
 * of component schemas or hasChildren flags.
 */

import { createCatalog } from "@json-render/core";
import { getCatalogEntries } from "@uiid/registry";

/**
 * UIID catalog for json-render.
 *
 * Defines what components the AI can generate and their prop schemas.
 * The AI will only generate JSON that matches these schemas.
 */
export const catalog = createCatalog({
  components: getCatalogEntries(),
  actions: {
    submit: {
      description: "Submit a form",
    },
    navigate: {
      description: "Navigate to a different page or section",
    },
    toggle: {
      description: "Toggle a boolean state",
    },
    dismiss: {
      description: "Dismiss or close something",
    },
  },
});

export type Catalog = typeof catalog;

