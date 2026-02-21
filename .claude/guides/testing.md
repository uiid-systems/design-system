# Testing

## Setup

Tests are configured at the **root level** and run across all packages:

- `vitest.config.ts` (root) — shared Vitest configuration
- `vitest.setup.ts` (root) — test setup with jest-dom matchers

Test files live alongside components as `{component}.test.tsx`.

## Quick Reference

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Component } from "./component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    render(<Component onClick={vi.fn()} />);
    await user.click(screen.getByRole("button"));
  });
});
```

See the full template at `.claude/templates/COMPONENT_TEST.md` for patterns covering:
- Rendering and data-slot verification
- Variant props (size, variant, tone)
- User interactions (click, keyboard)
- Controlled/uncontrolled state
- Disabled and loading states
- Accessibility checks
- Subcomponent props

## Running Tests

```bash
pnpm test:run                          # Run all tests (from root)
pnpm test                              # Watch mode
pnpm test:run packages/buttons         # Specific package
```
