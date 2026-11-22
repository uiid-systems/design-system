# @uiid/design-system

> Every UIID package in one install: components, layout, typography, tokens, icons and utilities.

## Install

`@base-ui/react`, `react` and `react-dom` are peer dependencies, so install them alongside the package.

```bash
pnpm add @uiid/design-system @base-ui/react react react-dom
```

## Usage

Import the stylesheet once, at your app's root. It carries the design tokens and every component's styles, and components render unstyled without it.

```tsx
import "@uiid/design-system/globals.css";

import { Button, Stack } from "@uiid/design-system";

export function Actions() {
  return (
    <Stack gap={4}>
      <Button variant="subtle">Cancel</Button>
      <Button>Save changes</Button>
    </Stack>
  );
}
```

## Icons

Icons are not in the root barrel, so importing a component never pulls in the icon set. Import one icon from its own subpath, named after the icon on [lucide.dev/icons](https://lucide.dev/icons):

```tsx
import { GlobeIcon } from "@uiid/design-system/icons/globe";
```

The `@uiid/design-system/icons` barrel reaches every icon, at the cost of parsing the whole set in your build. Type-only imports from it are free:

```tsx
import type { Icon } from "@uiid/design-system/icons";
```

## Utilities

Utilities are not in the root barrel. The `cx` class-name helper from `@uiid/utils` is served at `@uiid/design-system/utils`, so you can use it without a second dependency:

```tsx
import { cx } from "@uiid/design-system/utils";
```

## Packages

This package re-exports each published `@uiid/*` component package and `@uiid/tokens`, with icons and utilities on their subpaths. To depend on fewer of them, install the individual packages instead; see the [repository README](https://github.com/uiid-systems/design-system#packages) for the list.
