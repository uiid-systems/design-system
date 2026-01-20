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
 * Full UIID guidelines for LLMs - directly from AGENTS.md
 * This comprehensive guide ensures accurate UI tree generation.
 */
const UIID_GUIDELINES = `
# LLM Guidelines for UIID Component Tree Generation

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
      "key": "card",
      "type": "Card",
      "props": {
        "title": "Title",
        "description": "Description text"
      },
      "children": ["content"]
    },
    "content": {
      "key": "content",
      "type": "Text",
      "props": { "children": "Card body content here" },
      "parentKey": "card"
    }
  }
}
\`\`\`

**This pattern applies to most UIID components:**

| Component | Use props for...                         | Use children for... |
| --------- | ---------------------------------------- | ------------------- |
| Card      | title, description, icon, footer         | Custom body content |
| Input     | label, description, placeholder          | N/A (no children)   |
| Checkbox  | label, description                       | N/A (no children)   |
| Select    | label, description, items                | N/A (no children)   |
| Button    | N/A                                      | Button label text   |
| Switch    | label, description                       | N/A (no children)   |
| Textarea  | label, description, placeholder          | N/A (no children)   |

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
      "key": "root-key",
      "type": "Stack",
      "props": { "gap": 4 },
      "children": ["child-1", "child-2"]
    },
    "child-1": {
      "key": "child-1",
      "type": "Text",
      "props": { "children": "Hello World" },
      "parentKey": "root-key"
    },
    "child-2": {
      "key": "child-2",
      "type": "Button",
      "props": { "children": "Click Me" },
      "parentKey": "root-key"
    }
  }
}
\`\`\`

### Element Properties

| Property    | Type     | Required | Description                                            |
| ----------- | -------- | -------- | ------------------------------------------------------ |
| key         | string   | Yes      | Unique identifier for the element                      |
| type        | string   | Yes      | Component type from the registry                       |
| props       | object   | Yes      | Component props (can be empty {})                      |
| children    | string[] | No       | Array of child element keys (for container components) |
| parentKey   | string   | No       | Key of parent element (null for root)                  |

---

## Available Components

### Layout Components

#### Stack
Vertical flex layout (column direction).

| Prop      | Type    | Description                                                              |
| --------- | ------- | ------------------------------------------------------------------------ |
| gap       | number  | Space between children (0,1,2,3,4,6,8,10,12,16,20,24)                    |
| p, px, py | number  | Padding (same scale as gap)                                              |
| ax        | string  | Cross-axis alignment: start, center, end, stretch                        |
| ay        | string  | Main-axis alignment: start, center, end, space-between, stretch          |
| fullwidth | boolean | Set width to 100%                                                        |

#### Group
Horizontal flex layout (row direction). Same props as Stack, but axes are swapped.

#### Separator
Visual divider line.

| Prop        | Type   | Description                                                  |
| ----------- | ------ | ------------------------------------------------------------ |
| orientation | string | horizontal or vertical                                       |
| shade       | string | background, surface, accent, halftone, muted, foreground     |

---

### Typography

#### Text
All text content must use the Text component.

| Prop       | Type    | Description                                                |
| ---------- | ------- | ---------------------------------------------------------- |
| children   | string  | **Required.** The text content                             |
| size       | number  | Font size: -1, 0, 1, 2, 3, 4, 5, 6, 7, 8                   |
| weight     | string  | thin, light, normal, bold                                  |
| shade      | string  | background, surface, accent, halftone, muted, foreground   |
| tone       | string  | positive, negative, warning, info                          |

**Text Size Guide:**
- -1, 0: Small/caption text
- 1, 2: Body text (default)
- 3, 4: Subheadings
- 5, 6: Headings
- 7, 8: Large display text

---

### Buttons

#### Button

| Prop      | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| children  | string  | **Required.** Button label                |
| size      | string  | xsmall, small, medium, large              |
| variant   | string  | subtle, inverted (omit for default)       |
| tone      | string  | positive, negative, warning, info         |
| disabled  | boolean | Disable the button                        |
| fullwidth | boolean | Full width button                         |
| ghost     | boolean | Transparent background                    |
| pill      | boolean | Fully rounded corners                     |

---

### Form Components

#### Input

| Prop        | Type    | Description                                   |
| ----------- | ------- | --------------------------------------------- |
| label       | string  | Field label                                   |
| description | string  | Helper text below the input                   |
| placeholder | string  | Placeholder text                              |
| type        | string  | text, email, password, number, etc.           |
| name        | string  | Form field name                               |
| required    | boolean | Mark as required                              |
| fullwidth   | boolean | Full width input                              |

#### Textarea

| Prop        | Type    | Description                                   |
| ----------- | ------- | --------------------------------------------- |
| label       | string  | Field label                                   |
| description | string  | Helper text                                   |
| placeholder | string  | Placeholder text                              |
| rows        | number  | Number of visible rows                        |
| name        | string  | Form field name                               |
| required    | boolean | Mark as required                              |

#### Checkbox

| Prop        | Type    | Description                  |
| ----------- | ------- | ---------------------------- |
| label       | string  | Checkbox label               |
| description | string  | Helper text                  |
| name        | string  | Form field name              |
| required    | boolean | Mark as required             |
| bordered    | boolean | Add border around field      |

#### Switch

| Prop        | Type    | Description                  |
| ----------- | ------- | ---------------------------- |
| label       | string  | Switch label                 |
| description | string  | Helper text                  |
| name        | string  | Form field name              |

#### Select

| Prop        | Type    | Description                                          |
| ----------- | ------- | ---------------------------------------------------- |
| label       | string  | Field label                                          |
| description | string  | Helper text                                          |
| placeholder | string  | Placeholder when no selection                        |
| items       | array   | Options: { label, value, description?, disabled? }   |
| name        | string  | Form field name                                      |
| fullwidth   | boolean | Full width select                                    |

#### Form

Container that provides error context to form fields. **Important:** The JSON tree generates a static form structure. Interactive validation requires React state and handlers - see the JSX output tab for copy-pasteable React code with validation boilerplate.

| Prop   | Type   | Description                                      |
| ------ | ------ | ------------------------------------------------ |
| errors | object | Object mapping field names to error messages     |
| render | node   | Layout wrapper (use Stack with ax: "stretch")    |

---

### Cards

#### Card

| Prop        | Type    | Description                                   |
| ----------- | ------- | --------------------------------------------- |
| title       | string  | Card title (rendered automatically in header) |
| description | string  | Card description (rendered below header)      |
| footer      | string  | Footer content                                |
| tone        | string  | positive, negative, warning, info             |
| inverted    | boolean | Inverted color scheme                         |
| ghost       | boolean | Minimal borders                               |
| transparent | boolean | Transparent background                        |

---

## Layout Patterns

### Form Layout

**Important:** Use \`ax: "stretch"\` on Stack components containing form elements so inputs expand to full width.

\`\`\`json
{
  "root": "form",
  "elements": {
    "form": {
      "key": "form",
      "type": "Stack",
      "props": { "gap": 4, "ax": "stretch" },
      "children": ["email", "password", "actions"]
    },
    "email": {
      "key": "email",
      "type": "Input",
      "props": { "label": "Email", "type": "email", "name": "email", "required": true },
      "parentKey": "form"
    },
    "password": {
      "key": "password",
      "type": "Input",
      "props": { "label": "Password", "type": "password", "name": "password", "required": true },
      "parentKey": "form"
    },
    "actions": {
      "key": "actions",
      "type": "Group",
      "props": { "gap": 2, "ax": "end" },
      "children": ["cancel", "submit"],
      "parentKey": "form"
    },
    "cancel": {
      "key": "cancel",
      "type": "Button",
      "props": { "variant": "subtle", "children": "Cancel" },
      "parentKey": "actions"
    },
    "submit": {
      "key": "submit",
      "type": "Button",
      "props": { "children": "Sign In" },
      "parentKey": "actions"
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
      "key": "grid",
      "type": "Group",
      "props": { "gap": 4, "evenly": true },
      "children": ["card-1", "card-2", "card-3"]
    },
    "card-1": {
      "key": "card-1",
      "type": "Card",
      "props": { "title": "Feature 1", "description": "Description here" },
      "parentKey": "grid"
    },
    "card-2": {
      "key": "card-2",
      "type": "Card",
      "props": { "title": "Feature 2", "description": "Description here" },
      "parentKey": "grid"
    },
    "card-3": {
      "key": "card-3",
      "type": "Card",
      "props": { "title": "Feature 3", "description": "Description here" },
      "parentKey": "grid"
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
3. Don't skip the key property - every element needs a unique key
4. Don't forget parentKey - all non-root elements need this
5. Don't use raw strings - all text must be in a Text component
6. Don't use style={{}} objects - use component props
7. Don't build components from subparts - use precomposed props

### Spacing Scale Reference
- 0 = 0px, 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px
- 6 = 24px, 8 = 32px, 10 = 40px, 12 = 48px

---

## Validation Checklist

Before outputting a tree, verify:
- root field matches the key of the root element
- Every element has a unique key
- Every element has type and props
- All non-root elements have parentKey
- All children arrays contain valid keys that exist in elements
- Text content is in props.children, not as structural children
- Component types match the registry: Stack, Group, Box, Text, Button, Input, Checkbox, Switch, Select, Card, Separator, Textarea, ToggleButton, Form, Modal, Layer
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

export type { UITree };
