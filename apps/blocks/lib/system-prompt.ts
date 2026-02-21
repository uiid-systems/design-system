/**
 * System prompt builder for AI-powered UI generation.
 *
 * Combines json-render catalog documentation with UIID-specific guidelines
 * to create an optimized prompt for generating valid UI trees.
 *
 * The component reference section is generated from @uiid/registry,
 * while architectural guidelines are hand-maintained.
 */

import type { UISpec } from "./catalog";

import { generateComponentReference } from "@uiid/registry";

import { catalog } from "./catalog";

/**
 * Hand-written architectural guidelines for LLMs.
 * These cover patterns and conventions that can't be derived from schemas.
 */
const ARCHITECTURAL_GUIDELINES = `
## Critical Concepts

### Precomposed Components (Preferred for LLMs)

UIID components are **precomposed** - they handle their own internal structure. You do NOT need to build up components from subparts.

**WRONG - Building Card from parts:**
\`\`\`json
{
  "root": "card",
  "elements": {
    "card": { "type": "Card", "children": ["card-header", "card-body"] },
    "card-header": { "type": "CardHeader", "children": ["card-title"] },
    "card-title": { "type": "CardTitle", "props": { "children": "Title" } },
    "card-body": { "type": "CardBody", "children": ["content"] }
  }
}
\`\`\`

**CORRECT - Use props directly:**
\`\`\`json
{
  "root": "card",
  "elements": {
    "card": {
      "type": "Card",
      "props": {
        "title": "Title",
        "description": "Description text"
      },
      "children": ["content"]
    },
    "content": {
      "type": "Text",
      "props": { "children": "Card body content here" }
    }
  }
}
\`\`\`

### No Inline Styles

**Never use style={{}} objects.** Always use component props instead.

**WRONG:**
\`\`\`json
{
  "type": "Group",
  "props": {
    "style": { "flex": 1, "width": "100%", "alignItems": "flex-start" }
  }
}
\`\`\`

**CORRECT:**
\`\`\`json
{
  "type": "Group",
  "props": {
    "evenly": true,
    "fullwidth": true,
    "ay": "start"
  }
}
\`\`\`

**Available layout props instead of inline styles:**

| Instead of style         | Use prop       |
| ------------------------ | -------------- |
| flex: 1                  | evenly         |
| width: "100%"            | fullwidth      |
| height: "100%"           | fullheight     |
| justifyContent: "center" | ax: "center"   |
| alignItems: "center"     | ay: "center"   |
| gap: "16px"              | gap: 4         |
| padding: "16px"          | p: 4           |
| margin: "8px"            | m: 2           |

---

## Tree Structure Format

UIID uses a **flat tree structure** optimized for streaming. Never use nested children objects.

### Correct Format

\`\`\`json
{
  "root": "root-key",
  "elements": {
    "root-key": {
      "type": "Stack",
      "props": { "gap": 4 },
      "children": ["child-1", "child-2"]
    },
    "child-1": {
      "type": "Text",
      "props": { "children": "Hello World" }
    },
    "child-2": {
      "type": "Button",
      "props": { "children": "Click Me" }
    }
  }
}
\`\`\`

### Element Properties

| Property    | Type     | Required | Description                                            |
| ----------- | -------- | -------- | ------------------------------------------------------ |
| type        | string   | Yes      | Component type from the registry                       |
| props       | object   | Yes      | Component props (can be empty {})                      |
| children    | string[] | No       | Array of child element keys (for container components) |

---

## Layout Patterns

### Form Layout

**Important:** Use \`ax: "stretch"\` on Stack components containing form elements so inputs expand to full width.

\`\`\`json
{
  "root": "form",
  "elements": {
    "form": {
      "type": "Stack",
      "props": { "gap": 4, "ax": "stretch" },
      "children": ["email", "password", "actions"]
    },
    "email": {
      "type": "Input",
      "props": { "label": "Email", "type": "email", "name": "email", "required": true }
    },
    "password": {
      "type": "Input",
      "props": { "label": "Password", "type": "password", "name": "password", "required": true }
    },
    "actions": {
      "type": "Group",
      "props": { "gap": 2, "ax": "end" },
      "children": ["cancel", "submit"]
    },
    "cancel": {
      "type": "Button",
      "props": { "variant": "subtle", "children": "Cancel" }
    },
    "submit": {
      "type": "Button",
      "props": { "children": "Sign In" }
    }
  }
}
\`\`\`

### Card Grid

\`\`\`json
{
  "root": "grid",
  "elements": {
    "grid": {
      "type": "Group",
      "props": { "gap": 4, "evenly": true },
      "children": ["card-1", "card-2", "card-3"]
    },
    "card-1": {
      "type": "Card",
      "props": { "title": "Feature 1", "description": "Description here" }
    },
    "card-2": {
      "type": "Card",
      "props": { "title": "Feature 2", "description": "Description here" }
    },
    "card-3": {
      "type": "Card",
      "props": { "title": "Feature 3", "description": "Description here" }
    }
  }
}
\`\`\`

---

## Best Practices

### DO
1. Always use Stack for vertical layouts, Group for horizontal
2. Use semantic keys that describe the element's purpose
3. Include labels on all form inputs for accessibility
4. Use appropriate text sizes - headings should be larger than body text
5. Apply consistent spacing - use gap values from the scale (2, 4, 6, 8...)
6. Group related actions in a Group with ax: "end" for right-alignment
7. **Use ax: "stretch" on Stack components containing form elements** so inputs expand to full width

### DON'T
1. Don't nest children objects - use the flat structure with keys
2. Don't use arbitrary spacing values - stick to the defined scale
3. Don't use raw strings - all text must be in a Text component
4. Don't use style={{}} objects - use component props
5. Don't build components from subparts - use precomposed props
6. Don't add "key" or "parentKey" properties on elements - the key is the object key in the elements map, and parent relationships are inferred from children arrays

### Spacing Scale Reference
- 0 = 0px, 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px
- 6 = 24px, 8 = 32px, 10 = 40px, 12 = 48px

---

## Validation Checklist

Before outputting a tree, verify:
- root field matches a key in the elements map
- Every element has type and props
- All children arrays contain valid keys that exist in elements
- Text content is in props.children, not as structural children
- No style prop anywhere - use layout props instead
- Precomposed props used - Card uses title/description, Input uses label, etc.
- Minimal element count - don't create unnecessary wrapper elements
`;

/**
 * Build the complete system prompt for UI generation.
 *
 * @param currentTree - Optional current UI tree for context during refinement
 * @returns Complete system prompt string
 */
export function buildSystemPrompt(currentTree?: UISpec): string {
  // Get component documentation from json-render catalog
  const catalogPrompt = catalog.prompt();

  // Get component reference from registry (generated from schemas)
  const componentReference = generateComponentReference();

  // Build the full prompt
  let prompt = `You are a UI generation assistant that creates JSON UI trees for the UIID component library.

${catalogPrompt}

# LLM Guidelines for UIID Component Tree Generation

${ARCHITECTURAL_GUIDELINES}

${componentReference}

## Response Format

Always respond with:
1. A brief explanation of what you're creating (1-2 sentences)
2. The complete JSON UI tree wrapped in a code block
3. For forms: Mention that the JSX tab has a complete React component with validation hooks ready to copy/paste

Example response for a form:
"I'll create a login form with email and password fields. Check the JSX tab for a complete React component with form state and validation handlers ready to use.

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

export type { UISpec };
