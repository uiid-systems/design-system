# Template: Figma Component Construction

Step-by-step script for building a component in Figma using MCP tools. Replace placeholders (`{ComponentName}`, `{category}`, etc.) with actual values.

---

## 1. Pre-Flight

Before touching Figma, confirm you have everything needed:

- [ ] Registry entry exists for `{ComponentName}` in `packages/registry/src/components/`
- [ ] Token values are known — read `packages/tokens/src/json/` for colors, spacing, radii
- [ ] Props list is finalized — read the component's `.types.ts` or registry schema
- [ ] Conventions reviewed — see `docs/architecture/figma-file-structure.md`

## 2. Orient

Get the current state of the Figma file before building anything.

```
figma_get_design_system_summary   → understand existing components, variables, styles
figma_navigate                    → go to the {category} page
figma_search_components           → check if {ComponentName} already exists
figma_get_variables               → list available token variables for binding
```

If the component already exists, read it with `figma_get_component_details` before modifying.

## 3. Create Base Component

Build the default instance first. Use `figma_execute` with Figma Plugin API calls.

```javascript
// Create the base component
const comp = figma.createComponent();
comp.name = "{ComponentName}";

// Auto-layout (horizontal for most components)
comp.layoutMode = "HORIZONTAL";
comp.primaryAxisAlignItems = "CENTER";
comp.counterAxisAlignItems = "CENTER";
comp.paddingTop = {paddingTop};
comp.paddingBottom = {paddingBottom};
comp.paddingLeft = {paddingLeft};
comp.paddingRight = {paddingRight};
comp.itemSpacing = {itemSpacing};

// Sizing
comp.primaryAxisSizingMode = "AUTO";    // hug contents on main axis
comp.counterAxisSizingMode = "AUTO";    // hug contents on cross axis

// Corner radius
comp.cornerRadius = {cornerRadius};

// Add text child
const text = figma.createText();
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
text.fontName = { family: "Inter", style: "Medium" };
text.characters = "{DefaultText}";
text.fontSize = {fontSize};
comp.appendChild(text);
```

**Critical:** Always use `figma.loadFontAsync()` before setting text properties.

## 4. Bind Token Variables

Never hardcode colors. Bind fills and strokes to Figma variables that correspond to design tokens.

```javascript
// Find the variable by name
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collection = collections.find(c => c.name === "{CollectionName}");
const variables = collection.variableIds.map(id =>
  figma.variables.getVariableByIdAsync(id)
);
const resolved = await Promise.all(variables);
const bgVar = resolved.find(v => v.name === "{token-name}");

// Bind fill to variable
comp.fills = [figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
  "color",
  bgVar
)];

// Bind text color
const fgVar = resolved.find(v => v.name === "{text-token-name}");
text.fills = [figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
  "color",
  fgVar
)];
```

## 5. Add Component Properties

Map code props to Figma properties. See `figma-file-structure.md` for the full mapping table.

| Code Prop Type | Figma Property Type | Method |
|---|---|---|
| Enum (`variant`, `size`, `tone`, `shape`) | Variant property | Build as component set (step 6) |
| Boolean (`disabled`, `loading`, `fullwidth`) | Boolean property | `figma_add_component_property` |
| String (`children`, `label`, `placeholder`) | Text property | `figma_add_component_property` |

Add boolean and text properties to the base component:

```
figma_add_component_property
  nodeId: {componentNodeId}
  propertyName: "disabled"
  propertyType: "BOOLEAN"
  defaultValue: false

figma_add_component_property
  nodeId: {componentNodeId}
  propertyName: "children"
  propertyType: "TEXT"
  defaultValue: "{DefaultText}"
```

## 6. Build Variant Combinations (Component Set)

For enum props, create variant combinations using Figma's component set naming convention.

**Naming syntax:** `{ComponentName}, {prop1}={value1}, {prop2}={value2}`

```javascript
// Clone the base component for each variant combination
const variants = [];
const sizes = ["xsmall", "small", "medium", "large"];
const variantStyles = ["default", "subtle", "ghost", "inverted"];

for (const size of sizes) {
  for (const style of variantStyles) {
    const clone = comp.clone();
    clone.name = `{ComponentName}, size=${size}, variant=${style}`;
    // Apply size-specific values (padding, fontSize, etc.)
    // Apply variant-specific values (fills, strokes, etc.)
    variants.push(clone);
  }
}

// Combine into a component set
const componentSet = figma.combineAsVariants(
  [comp, ...variants],
  figma.currentPage
);
componentSet.name = "{ComponentName}";
```

**Important:** After `combineAsVariants`, the component set's name is what appears in the assets panel. Individual variant names use the comma-separated property syntax.

## 7. Arrange Section

Place the component set in a properly structured section on the page.

```javascript
// Find or create the section
let section = figma.currentPage.findOne(
  n => n.type === "SECTION" && n.name === "{ComponentName}"
);
if (!section) {
  section = figma.createSection();
  section.name = "{ComponentName}";
}

// Create group frames within the section
// Base | Variants | States | Compositions
// Spacing: 64px between groups, 16px within groups
```

**Section structure:**

```
Section: {ComponentName}
  ├── {ComponentName} / Base         → single default instance
  ├── {ComponentName} / Variants     → rows per variant axis
  ├── {ComponentName} / States       → default, hover, focus, active, disabled, loading
  └── {ComponentName} / Compositions → common multi-component patterns
```

Use `figma_arrange_component_set` to auto-arrange variant grids after creation.

## 8. Build State Instances

Create separate instances showing each interactive state. These are display-only (not variant properties) — they show what the component looks like in each state.

States to represent:
- **default** — base appearance
- **hover** — cursor over
- **focus** — keyboard focus ring
- **active** — pressed/clicking
- **disabled** — non-interactive (use `disabled` boolean property)
- **loading** — loading indicator (use `loading` boolean property)

## 9. Visual Validation

After each major step, take a screenshot and verify:

```
figma_take_screenshot → capture current state
```

**Validation checklist:**

- [ ] Component uses auto-layout (not absolute positioning)
- [ ] All fills/strokes bound to variables (no hardcoded hex)
- [ ] Text uses loaded fonts (not missing font indicators)
- [ ] Spacing matches token scale
- [ ] Component set shows correct variant grid
- [ ] Section is organized: Base → Variants → States → Compositions
- [ ] Property names are lowercase and match code prop names exactly
- [ ] Property values are lowercase and match code enum values exactly

## 10. Register Node ID

After the component is built and validated, update the registry entry:

```ts
// In packages/registry/src/components/{name}/index.ts
figma: { nodeId: "{nodeId}" }
```

Get the node ID from Figma (visible in the URL: `?node-id={nodeId}`) or from the `figma_get_selection` tool after selecting the component set.
