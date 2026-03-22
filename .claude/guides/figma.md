# Figma Design Guide

How to build and maintain UIID components in Figma using MCP tools. For naming conventions, property mapping, and section layout rules, see `docs/architecture/figma-file-structure.md`. For the step-by-step construction script, see `.claude/templates/FIGMA_COMPONENT.md`.

## Two-Server Model

UIID uses two Figma MCP servers with distinct roles:

| Server | Connection | Role |
|--------|-----------|------|
| **figma-console-mcp** | Live plugin (WebSocket) | Builds things — executes Plugin API code, reads/writes variables, manages components |
| **claude_ai_Figma** (REST) | Figma REST API | Reads designs — screenshots, metadata, Code Connect mapping |

**Rule:** Use figma-console for all construction. Use claude_ai_Figma for reading designs you didn't build (e.g., inspecting an existing file someone shares via URL).

## MCP Tool Reference

### Reading & Navigation

| Tool | Purpose |
|------|---------|
| `figma_get_design_system_summary` | Overview of components, variables, styles in the file |
| `figma_get_variables` | List all variable collections and their values |
| `figma_search_components` | Find existing components by name |
| `figma_get_component_details` | Inspect a specific component's properties and structure |
| `figma_get_selection` | Get the currently selected node (useful for grabbing node IDs) |
| `figma_navigate` | Navigate to a specific page or node |
| `figma_get_file_data` | Read the full file structure |

### Construction

| Tool | Purpose |
|------|---------|
| `figma_execute` | **Primary build tool.** Runs arbitrary Figma Plugin API code. Used for creating frames, components, text, applying auto-layout, binding variables. |
| `figma_create_child` | Add a child node to an existing frame |
| `figma_clone_node` | Duplicate an existing node |
| `figma_set_fills` | Set fill paints on a node |
| `figma_set_strokes` | Set stroke paints on a node |
| `figma_set_text` | Update text content |
| `figma_resize_node` | Change width/height |
| `figma_move_node` | Reposition a node |
| `figma_rename_node` | Rename a node |
| `figma_delete_node` | Remove a node |

### Component API

| Tool | Purpose |
|------|---------|
| `figma_add_component_property` | Add a boolean, text, or instance-swap property |
| `figma_edit_component_property` | Modify an existing property |
| `figma_delete_component_property` | Remove a property |
| `figma_arrange_component_set` | Auto-arrange variant grid layout |
| `figma_instantiate_component` | Create an instance of a component |
| `figma_set_instance_properties` | Set property values on an instance |

### Variables & Tokens

| Tool | Purpose |
|------|---------|
| `figma_get_variables` | List variables and collections |
| `figma_create_variable` | Create a single variable |
| `figma_update_variable` | Update a variable's value |
| `figma_batch_create_variables` | Create up to 100 variables at once |
| `figma_batch_update_variables` | Update up to 100 variables at once |
| `figma_setup_design_tokens` | Create a complete token system atomically |

### Validation

| Tool | Purpose |
|------|---------|
| `figma_take_screenshot` | Capture current canvas state for visual verification |
| `figma_capture_screenshot` | Capture a specific node |
| `figma_check_design_parity` | Compare design against code implementation |

### Code Connect

| Tool | Purpose |
|------|---------|
| `figma_get_code_connect_map` | Read existing Code Connect mappings |
| `figma_add_code_connect_map` | Add a mapping between Figma component and code |
| `figma_get_code_connect_suggestions` | Get AI-suggested mappings |
| `figma_send_code_connect_mappings` | Push mappings to Figma |

## `figma_execute` Patterns

`figma_execute` is the most critical tool. It runs Figma Plugin API code directly. All construction happens through it.

### Creating an Auto-Layout Frame

```javascript
const frame = figma.createFrame();
frame.name = "Button";
frame.layoutMode = "HORIZONTAL";
frame.primaryAxisAlignItems = "CENTER";
frame.counterAxisAlignItems = "CENTER";
frame.paddingTop = 12;
frame.paddingBottom = 12;
frame.paddingLeft = 24;
frame.paddingRight = 24;
frame.itemSpacing = 8;
frame.primaryAxisSizingMode = "AUTO";
frame.counterAxisSizingMode = "AUTO";
frame.cornerRadius = 8;
```

**Common mistakes:**
- Setting `layoutMode` after adding children (set it first)
- Using `"FILL"` sizing without a parent with auto-layout
- Forgetting `primaryAxisSizingMode` / `counterAxisSizingMode` (defaults to fixed, causes lopsided layouts)

### Binding a Fill to a Token Variable

```javascript
// 1. Get variable collections
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const tokenCollection = collections.find(c => c.name === "tokens");

// 2. Resolve variable IDs to variable objects
const varIds = tokenCollection.variableIds;
const vars = await Promise.all(
  varIds.map(id => figma.variables.getVariableByIdAsync(id))
);

// 3. Find the target variable
const bgVar = vars.find(v => v.name === "buttons/background");

// 4. Create a bound paint
const boundPaint = figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 0, g: 0, b: 0 } },  // base paint (color is overridden)
  "color",
  bgVar
);

// 5. Apply to the node
node.fills = [boundPaint];
```

**Never hardcode hex values.** If a token variable doesn't exist yet, flag it — don't create ad-hoc variables.

### Adding Component Properties to a Component Set

```javascript
// After creating variant components and combining them:
const componentSet = figma.combineAsVariants(variantComponents, figma.currentPage);
componentSet.name = "Button";

// Boolean and text properties are added to the component set
// Variant properties are implicit from the naming convention:
//   "Button, size=medium, variant=default"
```

Boolean and text properties are added via `figma_add_component_property` after the component set exists. Variant properties come from the comma-separated naming on individual variant components.

## Token Binding

**Principle:** Every visual value in Figma must be bound to a token variable. No hardcoded hex colors, no magic numbers for spacing.

| Visual property | Token source | Binding method |
|----------------|-------------|----------------|
| Background fill | `packages/tokens/src/json/primitives/colors.tokens.json` | `setBoundVariableForPaint` on fills |
| Text color | `packages/tokens/src/json/primitives/colors.tokens.json` | `setBoundVariableForPaint` on text fills |
| Border color | `packages/tokens/src/json/semantic/` (globals, shade, tone) | `setBoundVariableForPaint` on strokes |
| Corner radius | `packages/tokens/src/json/primitives/` | Direct numeric value from token |
| Padding/spacing | `packages/tokens/src/json/primitives/spacing.tokens.json` | Direct numeric value from token |
| Font size | `packages/tokens/src/json/primitives/typography.tokens.json` | Direct numeric value from token |

For colors, always use variable binding. For numeric values (spacing, radii, font sizes), use the token value directly — Figma doesn't support variable binding for all numeric properties.

## Component Construction Sequence

High-level order for building any component. See `.claude/templates/FIGMA_COMPONENT.md` for the detailed script with code examples.

1. **Pre-flight** — read registry entry, component source code (`.tsx`, `.types.ts`, `.variants.ts`, `.module.css`), and tokens
2. **Orient** — read the file, navigate to the correct page, check for existing components, get variable IDs
3. **Decide variant axes** — follow the strategy in `figma-file-structure.md` § Variant Axis Strategy. Keep under ~100 variants.
4. **Build all variants** — create all variant components in one `figma_execute` call with auto-layout, token-bound fills/strokes, text
5. **Combine & arrange** — `combineAsVariants`, then `figma_arrange_component_set` (note: this recreates the set with a new ID)
6. **Add properties** — boolean and text properties via `figma_add_component_property` on the **new** component set ID (must come AFTER arrange)
7. **Link text nodes** — explicitly connect text nodes to text properties via `componentPropertyReferences`
8. **Build section layout** — Base / Variants (display instances for non-axis props) / States / Compositions
9. **Validate** — screenshot, verify checklist
10. **Register** — update `figma.nodeId` in the registry entry with the final ID

**Critical ordering:** Properties must be added AFTER `figma_arrange_component_set`, because arrange recreates the component set and drops non-variant properties. This is the most common mistake.

## Validation Workflow

After every major construction step (base created, variants built, section arranged), take a screenshot and verify:

```
figma_capture_screenshot  nodeId: {nodeId}  scale: 1
```

**Prefer `figma_capture_screenshot`** over `figma_take_screenshot`. The capture tool uses the plugin's `exportAsync` API and reflects the current plugin state immediately. The take tool uses the REST API, which may lag behind recent changes and requires a node-id in the URL.

**What to check:**

1. **Auto-layout correctness** — no absolute positioning, children flow correctly
2. **Token binding** — fills show variable names (not hex) in the properties panel
3. **Naming** — component name is PascalCase, matches registry exactly
4. **Properties** — names are lowercase, match code prop names
5. **Values** — variant values are lowercase, match code enum values
6. **Spacing** — 64px between groups, 16px within groups
7. **Fonts** — no missing font indicators (always `loadFontAsync` before text operations)
8. **Text property linking** — `componentPropertyReferences` set on all text nodes
9. **Variant count** — matches expected product (e.g., 4 × 4 × 5 = 80, not 320)
10. **No quoted text** — text shows `Button`, not `"Button"` (check default values)

**Iteration limit:** Fix issues and re-screenshot up to 3 times per step. If something can't be resolved, flag it rather than iterating endlessly.

## Known Gotchas

Lessons learned from building components. These are the most common pitfalls:

1. **`figma_arrange_component_set` recreates the component set.** The old ID is dead. All non-variant properties (boolean, text) are dropped. Always add properties AFTER arranging, and always use the new ID from the response.

2. **Use `figma.setCurrentPageAsync(page)`, not `figma.currentPage = page`.** The synchronous setter throws `Cannot call with documentAccess: dynamic-page` in the plugin bridge.

3. **Text properties don't auto-link.** After adding a text property to a component set, you must explicitly link each variant's text node via `textNode.componentPropertyReferences = { characters: 'propertyName#suffix' }`. Without this, changing the property on an instance does nothing.

4. **Variant default values can't be changed via API.** `figma_edit_component_property` cannot change `defaultValue` on variant properties. The default is determined by the first variant created. Build variants in the right order if the default matters.

5. **Don't explode variant axes.** A full cartesian product of all enum props creates hundreds of variants. Follow the Variant Axis Strategy in `figma-file-structure.md` to keep the count manageable (under ~100).

6. **Text default values with extra quotes.** If you pass `"\"Button\""` or `'"Button"'` as a default value, the text will render with literal quote characters. Pass just `Button`.

7. **`figma_get_file_data` on large component sets is expensive.** A 320-variant component set produced 533K chars. Use `figma_execute` for targeted inspection instead.

8. **Instance overrides are limited.** You can override `cornerRadius`, `opacity`, `effects`, and `resize` on instances. You cannot switch variant property values on instances via the Plugin API — that requires `figma_set_instance_properties`.

## Code Connect

After a component is built and validated, map it to code:

1. Get existing mappings: `figma_get_code_connect_map`
2. Get suggestions: `figma_get_code_connect_suggestions`
3. Review and send: `figma_send_code_connect_mappings`

Code Connect relies on property names matching exactly between Figma and code. If the naming conventions in `figma-file-structure.md` were followed, mappings should be straightforward.
