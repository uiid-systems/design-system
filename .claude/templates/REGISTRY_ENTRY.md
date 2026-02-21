# Registry Entry Template

This template shows how to add a component to the `@uiid/registry` package.

## File Structure

Create these files in `packages/registry/src/components/{component-name}/`:

```
{component-name}/
├── index.ts      # Schema + ComponentEntry
└── previews.ts   # Preview configurations (optional but recommended)
```

## index.ts Template

```ts
import { z } from "zod";

import { Size, FormSize, Tone } from "../../shared"; // Import shared schemas as needed
import type { ComponentEntry } from "../../types";
import { componentPreviews } from "./previews"; // Optional

/**
 * {Component} component props schema.
 */
export const ComponentPropsSchema = z.object({
  /** Content */
  children: z.any().optional(),
  /** Size variant */
  size: FormSize.optional(), // or Size for non-form components
  /** Disabled state */
  disabled: z.boolean().optional(),
  // Add other props...
});

export type ComponentProps = z.infer<typeof ComponentPropsSchema>;

export const ComponentEntry: ComponentEntry<typeof ComponentPropsSchema> = {
  name: "Component",
  package: "@uiid/{package}",
  hasChildren: true, // false if component doesn't accept children
  propsSchema: ComponentPropsSchema,
  description: "Brief description for AI context",
  category: "forms", // layout | typography | buttons | cards | forms | indicators | interactive | overlays
  defaults: {
    size: "medium",
  },
  previews: componentPreviews, // Optional
  usage: "LLM-oriented usage guidance", // Optional
};
```

## previews.ts Template

```ts
import type { PreviewConfig } from "../../types";

export const componentPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "component",
      elements: {
        component: {
          key: "component",
          type: "Component",
          props: { children: "Example" },
        },
      },
    },
  },
];
```

## Components with Items (Select, RadioGroup, CheckboxGroup)

For components with an `items` prop, define an item schema:

```ts
/**
 * Item schema for options.
 */
export const ItemSchema = z.object({
  /** Display label */
  label: z.string(),
  /** Option value */
  value: z.string(),
  /** Disabled option */
  disabled: z.boolean().optional(),
});

export const ComponentPropsSchema = z.object({
  /** Options */
  items: z.array(ItemSchema).optional(),
  // ... other props
});
```

## Shared Schemas

Import from `../../shared` for common prop types:

| Schema              | Values                                             |
| ------------------- | -------------------------------------------------- |
| `Size`              | `xsmall`, `small`, `medium`, `large`               |
| `FormSize`          | `small`, `medium`, `large`                         |
| `Tone`              | `positive`, `critical`, `warning`, `info`          |
| `Shade`             | `background`, `surface`, `accent`, `halftone`, `muted`, `foreground` |
| `SpacingPropsSchema`| `gap`, `p`, `px`, `py`, `m`, etc.                  |
| `LayoutPropsSchema` | `ax`, `ay`, `direction`                            |

## Registration Steps

After creating the component files:

### 1. Export from components/index.ts

```ts
// packages/registry/src/components/index.ts
export * from "./{component-name}";
```

### 2. Add to manifest.ts

```ts
// packages/registry/src/manifest.ts

// Import
import { ComponentEntry } from "./components/{component-name}";

// Add to registry object
export const registry: Registry = {
  // ...existing entries
  Component: ComponentEntry,
};
```

### 3. Add to app component maps (for preview rendering)

If you created previews, add the component to the renderer maps in both apps:

**`apps/docs/components/tree-preview.tsx`:**

```ts
// Import
import { Component } from "@uiid/{package}";

// Add to componentMap (use `as unknown as` for components with required props like `items`)
const componentMap = {
  // ...existing entries
  Component: Component as React.ComponentType<Record<string, unknown>>,
  // Or for components with required props:
  Component: Component as unknown as React.ComponentType<Record<string, unknown>>,
};
```

**`apps/blocks/lib/components.tsx`:**

```ts
// Import
import { Component } from "@uiid/{package}";

// Add to registry
export const registry: ComponentRegistry = {
  // ...existing entries
  Component: ({ element, children }) => (
    <Component data-element-key={element.key} {...element.props}>
      {children}
    </Component>
  ),
};
```

For components with actions (form controls), add `onAction` handling:

```ts
Component: ({ element, onAction }) => {
  const { action, ...props } = element.props;
  return (
    <Component
      data-element-key={element.key}
      {...props}
      onValueChange={(value) => {
        if (action && onAction) {
          onAction({ ...action, params: { value } });
        }
      }}
    />
  );
},
```

### 4. Build and verify

```bash
pnpm build --filter=@uiid/registry
pnpm build --filter=docs --filter=blocks
```

## Checklist

- [ ] Schema covers all user-facing props
- [ ] Props have JSDoc comments (they become descriptions)
- [ ] `hasChildren` is set correctly
- [ ] `category` matches the component's package
- [ ] `defaults` includes sensible default values
- [ ] At least one preview exists (for docs/blocks app)
- [ ] Exported from `components/index.ts`
- [ ] Added to `manifest.ts`
- [ ] Added to `apps/docs/components/tree-preview.tsx` componentMap
- [ ] Added to `apps/blocks/lib/components.tsx` registry
- [ ] All packages build successfully
