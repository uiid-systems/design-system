# Template: Figma Component Construction

Step-by-step script for building a component in Figma using MCP tools. Replace placeholders (`{ComponentName}`, `{category}`, etc.) with actual values.

---

## 1. Pre-Flight

Before touching Figma, confirm you have everything needed:

- [ ] Registry entry exists for `{ComponentName}` in `packages/registry/src/components/`
- [ ] Component source code read — `.tsx`, `.types.ts`, `.variants.ts`, `.module.css`
- [ ] Token values are known — read `packages/tokens/src/json/` for colors, spacing, radii
- [ ] Props list is finalized — read the component's `.types.ts` or registry schema
- [ ] Variant axis strategy decided — see `docs/architecture/figma-file-structure.md` § Variant Axis Strategy
- [ ] Conventions reviewed — see `docs/architecture/figma-file-structure.md`

**Reading the source code is mandatory.** The registry schema alone is not enough. Read the component's CSS Module to understand exact token references, the variants file for CVA definitions, and the stories file for visual examples.

## 2. Orient

Get the current state of the Figma file before building anything.

```
figma_get_design_system_summary   → understand existing components, variables, styles
figma_get_file_data (depth=2)     → check page structure
figma_search_components           → check if {ComponentName} already exists
figma_get_variables               → list available token variables for binding
```

If the component already exists, inspect it with `figma_execute` to understand its current structure before deciding whether to modify or rebuild.

**Important:** Use `figma.setCurrentPageAsync(page)` — not `figma.currentPage = page`. The synchronous setter throws in the plugin bridge environment.

## 3. Decide Variant Axes

Not every enum prop should become a variant axis. Follow the priority order from `figma-file-structure.md`:

1. **Always:** structural/sizing props (`size`)
2. **Usually:** visual identity props (`variant`)
3. **When commonly varied:** semantic props (`tone`)
4. **Display instances only:** single-property overrides (`shape`)

**Target:** Keep total variants under ~100. Calculate the product before building:
`axis1_values × axis2_values × axis3_values = total_variants`

Example — Button: `4 sizes × 4 variants × 5 tones = 80 variants` ✓
Anti-pattern — Button: `4 × 4 × 5 × 4 shapes = 320 variants` ✗

## 4. Build All Variant Components

Build every variant in a single `figma_execute` call. Each variant is a separate `figma.createComponent()` with its own auto-layout, fills, strokes, and text — all token-bound.

```javascript
const page = figma.root.children.find(p => p.name === '{category}');
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

// Token variable IDs — get these from figma_get_variables in step 2
const V = {
  'shade/foreground': 'VariableID:149:102',
  'shade/background': 'VariableID:149:101',
  // ... add all needed variable IDs
};

// Helper: create a paint bound to a token variable
async function boundPaint(varId) {
  const variable = await figma.variables.getVariableByIdAsync(varId);
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } },
    'color',
    variable
  );
}

// Define size values from token system
const sizes = {
  xsmall: { h: 28, px: 8, py: 5, fs: 12, lh: 18 },
  // ...
};

// Define visual styles per variant+tone combo
function getStyle(variantName, toneName) {
  // Return { bg: 'token/name', fg: 'token/name', border: 'token/name', bw: 2 }
  // Use null for bg/border when the variant has none (e.g., ghost)
}

const components = [];

for (const [sizeName, sz] of Object.entries(sizes)) {
  for (const variantName of variantNames) {
    for (const toneName of toneNames) {
      const style = getStyle(variantName, toneName);

      const comp = figma.createComponent();
      comp.name = `size=${sizeName}, variant=${variantName}, tone=${toneName}`;

      // Auto-layout FIRST, before adding children
      comp.layoutMode = 'HORIZONTAL';
      comp.primaryAxisAlignItems = 'CENTER';
      comp.counterAxisAlignItems = 'CENTER';
      comp.primaryAxisSizingMode = 'AUTO';
      comp.counterAxisSizingMode = 'FIXED';
      comp.resize(comp.width, sz.h);

      comp.paddingLeft = sz.px;
      comp.paddingRight = sz.px;
      comp.paddingTop = sz.py;
      comp.paddingBottom = sz.py;
      comp.itemSpacing = 8;
      comp.cornerRadius = 8;

      // Bind fills to token variables
      if (style.bg && V[style.bg]) {
        comp.fills = [await boundPaint(V[style.bg])];
      } else {
        comp.fills = [];
      }

      // Bind strokes to token variables
      if (style.bw > 0 && style.border && V[style.border]) {
        comp.strokes = [await boundPaint(V[style.border])];
        comp.strokeWeight = style.bw;
        comp.strokeAlign = 'INSIDE';
      }

      // Text child — bound to token variable for color
      const text = figma.createText();
      text.fontName = { family: "Inter", style: "Semi Bold" };
      text.characters = "{DefaultText}";
      text.fontSize = sz.fs;
      text.lineHeight = { value: sz.lh, unit: 'PIXELS' };
      text.fills = [await boundPaint(V[style.fg])];

      comp.appendChild(text);
      components.push(comp);
    }
  }
}

// Combine into component set
const cs = figma.combineAsVariants(components, page);
cs.name = '{ComponentName}';
```

**Critical notes:**
- Set `layoutMode` BEFORE adding children
- Use `counterAxisSizingMode = 'FIXED'` with explicit height for button-like components
- **Never hardcode hex values** — always use `boundPaint()` with variable IDs
- Variant naming syntax: `prop1=value1, prop2=value2` (no component name prefix)

## 5. Arrange the Component Set Grid

Use `figma_arrange_component_set` to create a labeled grid container.

```
figma_arrange_component_set
  componentSetId: {csId}
  options: { columnProperty: "{lastAxis}", gap: 20, cellPadding: 16 }
```

**⚠️ CRITICAL GOTCHA:** `figma_arrange_component_set` **recreates the component set** with a new node ID. This means:
- The old component set ID is invalid after this call
- **All non-variant properties (boolean, text) are dropped** — they must be re-added after arranging
- Always note the new component set ID from the response

**Correct ordering:**
1. Create variant components → `combineAsVariants` → get component set ID
2. Call `figma_arrange_component_set` → get **new** component set ID
3. Add boolean and text properties to the **new** ID (step 6)
4. Link text nodes (step 7)

## 6. Add Component Properties

After arranging (which gives you the final component set ID), add boolean and text properties.

```
figma_add_component_property  nodeId: {newCsId}  propertyName: "disabled"   type: BOOLEAN  defaultValue: false
figma_add_component_property  nodeId: {newCsId}  propertyName: "loading"    type: BOOLEAN  defaultValue: false
figma_add_component_property  nodeId: {newCsId}  propertyName: "fullwidth"  type: BOOLEAN  defaultValue: false
figma_add_component_property  nodeId: {newCsId}  propertyName: "children"   type: TEXT     defaultValue: "{DefaultText}"
```

**Note:** Each property gets a unique suffix (e.g., `children#156:703`). Save these full names — you'll need them for linking text nodes and any future edits.

## 7. Link Text Nodes to Text Properties

Text properties don't auto-link to text nodes. You must explicitly connect them via `componentPropertyReferences`.

```javascript
const cs = figma.root.findOne(n => n.type === 'COMPONENT_SET' && n.name === '{ComponentName}');
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

for (const variant of cs.children) {
  const textNode = variant.findOne(n => n.type === 'TEXT');
  if (textNode) {
    textNode.componentPropertyReferences = { characters: 'children#{suffix}' };
  }
}
```

Without this step, changing the `children` property on an instance won't update the text.

## 8. Build Section Layout

Below the component set container, create display groups per `figma-file-structure.md`.

### Base
Single default instance showing the component with all default props.

### Variants (display instances)
Rows for props that are NOT variant axes. For each non-axis enum prop, create instances with manual overrides applied.

Example — shape overrides on Button instances:
- `default` → no override (cornerRadius 8)
- `pill` → set `cornerRadius = 99999`
- `square` → set `cornerRadius = 8`, resize to square aspect, zero horizontal padding
- `circle` → set `cornerRadius = 99999`, resize to square aspect, zero horizontal padding

### States
Row of instances showing interactive states:
- **default** — no modifications
- **hover** — slight opacity reduction (0.85) to indicate lighter bg
- **focus** — add drop shadow effect simulating focus ring (`spread: 3, blur: 0, color: blue`)
- **active** — add inner shadow to simulate pressed state
- **disabled** — set `opacity = 0.4`
- **loading** — set `opacity = 0.7` (real spinner can't be shown statically)

### Compositions
Common multi-component patterns:
- Button group (default + subtle + ghost in a horizontal auto-layout frame)
- Tone buttons (positive + critical + warning + info in a row)
- Context-specific compositions (e.g., Button in Card footer)

**Spacing:** 64px between groups, 16px within groups. Label each group with a text node.

## 9. Visual Validation

After each major step, take a screenshot and verify:

```
figma_capture_screenshot  nodeId: {nodeId}  scale: 1
```

**Use `figma_capture_screenshot`** (plugin export) instead of `figma_take_screenshot` (REST API) — it reflects the current plugin state immediately and doesn't require a node-id in the URL.

**Validation checklist:**

- [ ] Component uses auto-layout (not absolute positioning)
- [ ] All fills/strokes bound to variables (no hardcoded hex)
- [ ] Text uses loaded fonts (not missing font indicators)
- [ ] Spacing matches token scale
- [ ] Component set shows correct variant grid
- [ ] Section is organized: Base → Variants → States → Compositions
- [ ] Property names are lowercase and match code prop names exactly
- [ ] Property values are lowercase and match code enum values exactly
- [ ] Text property is linked to text nodes (test by checking `componentPropertyReferences`)
- [ ] Variant count matches expected product (e.g., 4 × 4 × 5 = 80)

## 10. Register Node ID

After the component is built and validated, update the registry entry with the **final** component set ID (the one from step 5, after arrange).

```ts
// In packages/registry/src/components/{name}/index.ts
figma: { nodeId: "{nodeId}" }
```

Get the node ID from the `figma_arrange_component_set` response or from `figma_execute` querying the component set.

---

## Known Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| `Cannot call with documentAccess: dynamic-page` | Using `figma.currentPage = page` | Use `figma.setCurrentPageAsync(page)` |
| Properties disappear after arrange | `figma_arrange_component_set` recreates the set | Add properties AFTER arranging |
| Text property doesn't update instances | Text nodes not linked | Set `componentPropertyReferences` on each text node |
| `Cannot change defaultValue of variant property` | Figma API limitation | Variant defaults are set by the first variant created — build in the right order |
| Instance overrides don't apply | Trying to change variant props on instances | Use direct property overrides (cornerRadius, opacity, effects) — not variant switching |
| 533K+ response from `figma_get_file_data` | Component set has hundreds of variants | Use `figma_execute` for targeted inspection instead |
| Text shows with literal quotes | Default value passed as `'"Button"'` with extra quotes | Pass default as `Button` (no surrounding quotes in the value) |
