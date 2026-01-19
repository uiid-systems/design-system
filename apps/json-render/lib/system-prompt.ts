/**
 * System prompt builder for AI-powered UI generation.
 *
 * Combines json-render catalog documentation with UIID-specific guidelines
 * to create an optimized prompt for generating valid UI trees.
 */

import { generateCatalogPrompt } from "@json-render/core";
import type { UITree } from "@json-render/core";

import { catalog } from "./catalog";

/**
 * UIID-specific guidelines for LLMs.
 * Extracted from AGENTS.md - the critical rules for generating valid trees.
 */
const UIID_GUIDELINES = `
## Critical UIID Rules

### 1. Precomposed Components
UIID components are precomposed - use props directly instead of building from subparts.

**WRONG:**
\`\`\`json
{ "type": "Card", "children": ["card-header", "card-body"] }
\`\`\`

**CORRECT:**
\`\`\`json
{ "type": "Card", "props": { "title": "Title", "description": "Description" } }
\`\`\`

| Component | Use props for... | Use children for... |
|-----------|------------------|---------------------|
| Card | title, description, icon, footer | Custom body content |
| Input | label, description, placeholder | N/A |
| Checkbox | label, description | N/A |
| Select | label, description, items | N/A |
| Button | N/A | Button label text |

### 2. No Inline Styles
Never use style={{}} objects. Use component props instead:

| Instead of style | Use prop |
|------------------|----------|
| flex: 1 | evenly |
| width: "100%" | fullwidth |
| height: "100%" | fullheight |
| justifyContent | ax |
| alignItems | ay |
| gap: "16px" | gap: 4 |
| padding: "16px" | p: 4 |

### 3. Flat Tree Structure
Use a flat structure with keys, never nested children objects:

\`\`\`json
{
  "root": "root-key",
  "elements": {
    "root-key": {
      "key": "root-key",
      "type": "Stack",
      "props": { "gap": 4 },
      "children": ["child-1"]
    },
    "child-1": {
      "key": "child-1",
      "type": "Text",
      "props": { "children": "Hello" },
      "parentKey": "root-key"
    }
  }
}
\`\`\`

### 4. Required Element Properties
- key: string (required, unique)
- type: string (required, from registry)
- props: object (required, can be {})
- children: string[] (optional, array of child keys)
- parentKey: string (required for non-root elements)

### 5. Layout Components
- Stack: Vertical layout (column). ax = vertical align, ay = horizontal align
- Group: Horizontal layout (row). ax = horizontal align, ay = vertical align
- Box: Generic flex, use direction prop

### 6. Spacing Scale
gap/padding/margin values: 0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24
- gap: 2 = tight (8px)
- gap: 4 = standard (16px)
- gap: 6 = large (24px)

### 7. Text Sizes
-1, 0 = small/caption
1, 2 = body (default)
3, 4 = subheadings
5, 6 = headings
7, 8 = display

### 8. Validation Checklist
Before outputting, verify:
- root field matches root element key
- Every element has unique key, type, and props
- All non-root elements have parentKey
- All children arrays contain valid keys
- Text content is in props.children
- No style prop anywhere
- Precomposed props used (Card title, Input label, etc.)
`;

/**
 * Build the complete system prompt for UI generation.
 *
 * @param currentTree - Optional current UI tree for context during refinement
 * @returns Complete system prompt string
 */
export function buildSystemPrompt(currentTree?: UITree): string {
  // Get component documentation from json-render catalog
  const catalogPrompt = generateCatalogPrompt(catalog);

  // Build the full prompt
  let prompt = `You are a UI generation assistant that creates JSON UI trees for the UIID component library.

${catalogPrompt}

${UIID_GUIDELINES}

## Response Format

Always respond with:
1. A brief explanation of what you're creating (1-2 sentences)
2. The complete JSON UI tree wrapped in a code block

Example response:
"I'll create a login form with email and password fields.

\`\`\`json
{
  "root": "login-form",
  "elements": { ... }
}
\`\`\`"

When the user asks for modifications, update the existing tree rather than starting from scratch.
`;

  // Add current tree context for refinement
  if (currentTree) {
    prompt += `

## Current UI State

The user is refining this existing UI. Make modifications to this tree:

\`\`\`json
${JSON.stringify(currentTree, null, 2)}
\`\`\`

When the user asks for changes, modify the existing tree - add, remove, or update elements as requested.
`;
  }

  return prompt;
}

export type { UITree };
