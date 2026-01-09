# Component Test Template

> Guidelines and template for writing component tests using Vitest and React Testing Library.

## File Structure

Test files should be colocated with components:

```
{component-name}/
├── {component-name}.tsx
├── {component-name}.test.tsx  ← Test file
└── ...
```

## Test Template

```tsx
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { {ComponentName} } from "./{component-name}";

describe("{ComponentName}", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the component", () => {
    render(<{ComponentName} />);
    expect(screen.getByRole("{role}")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<{ComponentName} />);
    expect(screen.getByRole("{role}")).toHaveAttribute(
      "data-slot",
      "{component-name}",
    );
  });

  it("applies custom className", () => {
    render(<{ComponentName} className="custom-class" />);
    expect(screen.getByRole("{role}")).toHaveClass("custom-class");
  });

  it("forwards additional props to root element", () => {
    render(<{ComponentName} data-testid="test-component" />);
    expect(screen.getByTestId("test-component")).toBeInTheDocument();
  });

  // ============================================
  // VARIANTS (if applicable)
  // ============================================

  it("renders with size variant", () => {
    const { rerender } = render(<{ComponentName} size="small" />);
    // Assert small size styles/attributes

    rerender(<{ComponentName} size="large" />);
    // Assert large size styles/attributes
  });

  it("renders with variant prop", () => {
    render(<{ComponentName} variant="subtle" />);
    // Assert variant-specific behavior
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<{ComponentName} onClick={handleClick} />);
    await user.click(screen.getByRole("{role}"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard interaction", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<{ComponentName} onClick={handleClick} />);
    screen.getByRole("{role}").focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalled();
  });

  // ============================================
  // CONTROLLED/UNCONTROLLED STATE (if applicable)
  // ============================================

  it("supports controlled state", async () => {
    const handleChange = vi.fn();

    const Controlled{ComponentName} = () => {
      const [value, setValue] = useState(false);
      return (
        <{ComponentName}
          checked={value}
          onCheckedChange={(newValue) => {
            setValue(newValue);
            handleChange(newValue);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<Controlled{ComponentName} />);

    await user.click(screen.getByRole("{role}"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("supports uncontrolled state with defaultValue", () => {
    render(<{ComponentName} defaultChecked />);
    expect(screen.getByRole("{role}")).toHaveAttribute("data-checked");
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<{ComponentName} disabled />);
    expect(screen.getByRole("{role}")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not trigger events when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<{ComponentName} disabled onClick={handleClick} />);
    await user.click(screen.getByRole("{role}"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  // ============================================
  // LOADING STATE (if applicable)
  // ============================================

  it("shows loading state", () => {
    render(<{ComponentName} loading />);
    // Assert loading indicator is visible
    // Assert content is hidden/aria-hidden
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("has accessible name when label provided", () => {
    render(<{ComponentName} aria-label="Accessible name" />);
    expect(screen.getByRole("{role}")).toHaveAccessibleName("Accessible name");
  });

  // ============================================
  // SUBCOMPONENT PROPS (if applicable)
  // ============================================

  it("passes RootProps to root element", () => {
    render(<{ComponentName} RootProps={{ "aria-describedby": "help-text" }} />);
    expect(screen.getByRole("{role}")).toHaveAttribute(
      "aria-describedby",
      "help-text",
    );
  });

  // ============================================
  // BASE UI API (if applicable)
  // ============================================

  it("renders as custom element with render prop", () => {
    render(
      <{ComponentName} nativeButton={false} render={<a href="#" />}>
        Link
      </{ComponentName}>,
    );

    // Base UI adds role to maintain component semantics
    const element = screen.getByRole("{role}");
    expect(element.tagName).toBe("A");
    expect(element).toHaveAttribute("href", "#");
  });

  it("preserves render element attributes", () => {
    render(
      <{ComponentName}
        nativeButton={false}
        render={<a href="https://example.com" target="_blank" />}
      >
        External
      </{ComponentName}>,
    );

    const element = screen.getByRole("{role}");
    expect(element).toHaveAttribute("target", "_blank");
  });
});
```

## Testing Guidelines

### What to Test

1. **Rendering** - Component renders without crashing
2. **Data slots** - `data-slot` attributes are applied correctly
3. **Props** - Custom className, forwarded props work
4. **Variants** - Size, variant, tone props apply correct styles
5. **Interactions** - Click, keyboard, focus events work
6. **State** - Controlled and uncontrolled modes
7. **Disabled** - Disabled state prevents interaction
8. **Loading** - Loading state shows indicator, hides content
9. **Accessibility** - ARIA attributes, roles, accessible names
10. **Base UI API** - `render` prop, `nativeButton`, custom element rendering

### What NOT to Test

- Base UI internal behavior (already tested upstream)
- CSS styling details (use visual regression instead)
- Implementation details (internal state, refs)

### Query Priority

Use queries in this order of preference:

1. `getByRole` - Most accessible, preferred
2. `getByLabelText` - For form elements
3. `getByText` - For content
4. `getByTestId` - Last resort

### Async Interactions

Always use `userEvent` with `setup()` for user interactions:

```tsx
const user = userEvent.setup();
await user.click(element);
await user.type(input, "text");
await user.keyboard("{Enter}");
```

### Testing Patterns

#### Testing data attributes for state

```tsx
// For Base UI components that use data attributes
expect(element).toHaveAttribute("data-checked");
expect(element).toHaveAttribute("data-pressed", "true");
expect(element).not.toHaveAttribute("data-disabled");
```

#### Testing visibility

```tsx
// For elements that should be hidden
expect(element).toHaveAttribute("aria-hidden", "true");

// For conditional rendering
expect(screen.queryByRole("button")).not.toBeInTheDocument();
```

#### Testing className application

```tsx
expect(element).toHaveClass("expected-class");
expect(element.className).toContain("variant-");
```

## Running Tests

```bash
# Run all tests
pnpm test:run

# Watch mode
pnpm test

# Run tests for specific package
pnpm test:run packages/buttons

# Run tests for specific file
pnpm test:run button.test
```

---

<!--
TEMPLATE INSTRUCTIONS (delete when using)

Placeholders:
- {ComponentName} → PascalCase (e.g., "Button")
- {component-name} → kebab-case (e.g., "button")
- {role} → ARIA role (e.g., "button", "switch", "checkbox")

Sections to include/exclude:
- Variants: Only if component has size/variant/tone props
- Controlled/Uncontrolled: Only for stateful components
- Loading: Only if component supports loading state
- Subcomponent Props: Only if component uses RootProps pattern
- Base UI API: Only if component supports render/nativeButton props

Keep tests focused:
- One assertion per test when possible
- Group related tests with comments
- Use descriptive test names
-->
