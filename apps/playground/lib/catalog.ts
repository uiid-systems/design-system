/**
 * Catalog adapter for json-render.
 *
 * Derives the catalog from the UIID registry — no manual duplication
 * of component schemas or hasChildren flags.
 */

import { defineCatalog } from "@json-render/core";
import type { Spec } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { getCatalogEntries } from "@uiid/registry";

/**
 * UIID catalog for json-render.
 *
 * Defines what components the AI can generate and their prop schemas.
 * The AI will only generate JSON that matches these schemas.
 */
export const catalog = defineCatalog(schema, {
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

/**
 * Spec type used throughout the playground.
 *
 * Uses the core `Spec` type from json-render rather than the catalog's
 * inferred `_specType`, which makes `visible` a required `unknown` field
 * and breaks structural compatibility with `Renderer`'s expected props.
 */
export type UISpec = Spec;

