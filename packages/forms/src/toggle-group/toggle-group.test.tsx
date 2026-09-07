import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Toggle, ToggleGroup } from "./toggle-group";

const SIZES = ["xsmall", "small", "medium", "large"] as const;

const renderGroup = (props: React.ComponentProps<typeof ToggleGroup> = {}) =>
  render(
    <ToggleGroup {...props}>
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="yearly">Yearly</Toggle>
    </ToggleGroup>,
  );

describe("ToggleGroup size", () => {
  it.each(SIZES)("marks the panel with the %s tier", (size) => {
    const { container } = renderGroup({ size });
    expect(
      container.querySelector(`[data-size="${size}"]`),
    ).toBeInTheDocument();
  });

  it.each(SIZES)(
    "hands the %s tier to every toggle, not just the panel",
    (size) => {
      renderGroup({ size });
      for (const toggle of screen.getAllByRole("button")) {
        expect(toggle.className).toMatch(new RegExp(`composes-size-${size}`));
      }
    },
  );

  it("defaults to the medium tier, matching the other form controls", () => {
    const { container } = renderGroup();
    expect(container.querySelector('[data-size="medium"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0].className).toMatch(
      /composes-size-medium/,
    );
  });

  it("keeps a consumer's own className alongside the tier", () => {
    render(
      <ToggleGroup size="large">
        <Toggle value="monthly" className="custom">
          Monthly
        </Toggle>
      </ToggleGroup>,
    );
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveClass("custom");
    expect(toggle.className).toMatch(/composes-size-large/);
  });
});

describe("ToggleGroup disabled", () => {
  it("gives every toggle the shared disabled treatment to dim against", () => {
    renderGroup();
    for (const toggle of screen.getAllByRole("button")) {
      expect(toggle.className).toMatch(/composes-disabled/);
    }
  });

  it("marks every toggle disabled when the group is", () => {
    renderGroup({ disabled: true });
    for (const toggle of screen.getAllByRole("button")) {
      expect(toggle).toBeDisabled();
      expect(toggle).toHaveAttribute("data-disabled");
    }
  });

  it("leaves the siblings of a single disabled toggle pressable", () => {
    render(
      <ToggleGroup defaultValue={["monthly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly" disabled>
          Yearly
        </Toggle>
      </ToggleGroup>,
    );
    const [monthly, yearly] = screen.getAllByRole("button");
    expect(yearly).toBeDisabled();
    expect(yearly).toHaveAttribute("data-disabled");
    expect(monthly).toBeEnabled();
    expect(monthly).not.toHaveAttribute("data-disabled");
  });
});

describe("ToggleGroup multiple", () => {
  const renderFormatting = (props = {}) =>
    render(
      <ToggleGroup multiple defaultValue={["bold"]} {...props}>
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
      </ToggleGroup>,
    );

  it("drops the indicator, which cannot sit behind several toggles at once", () => {
    const { container } = renderFormatting();
    expect(
      container.querySelector('[data-slot="toggle-group-indicator"]'),
    ).not.toBeInTheDocument();
  });

  it("keeps the indicator for a single-selection group", () => {
    const { container } = renderGroup();
    expect(
      container.querySelector('[data-slot="toggle-group-indicator"]'),
    ).toBeInTheDocument();
  });

  it("marks the panel so the toggles can paint their own pressed background", () => {
    const { container } = renderFormatting();
    expect(container.querySelector("[data-multiple]")).toBeInTheDocument();
  });

  it("holds every pressed toggle, not just the first", async () => {
    const user = userEvent.setup();
    renderFormatting();
    const [bold, italic] = screen.getAllByRole("button");

    await user.click(italic);

    expect(bold).toHaveAttribute("data-pressed");
    expect(italic).toHaveAttribute("data-pressed");
  });

  it("releases a pressed toggle when it is pressed again", async () => {
    const user = userEvent.setup();
    renderFormatting();
    const [bold] = screen.getAllByRole("button");

    await user.click(bold);

    expect(bold).not.toHaveAttribute("data-pressed");
  });
});

describe("ToggleGroup orientation", () => {
  const renderOriented = (orientation?: "horizontal" | "vertical") =>
    render(
      <ToggleGroup orientation={orientation} defaultValue={["a"]}>
        <Toggle value="a">A</Toggle>
        <Toggle value="b">B</Toggle>
      </ToggleGroup>,
    );

  it("reports its orientation on the panel, horizontal included", () => {
    const { container } = renderOriented();
    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("reports a vertical orientation on the panel", () => {
    const { container } = renderOriented("vertical");
    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("walks a horizontal group with the horizontal arrow keys", async () => {
    const user = userEvent.setup();
    renderOriented("horizontal");
    const [a, b] = screen.getAllByRole("button");

    a.focus();
    await user.keyboard("{ArrowRight}");
    expect(b).toHaveFocus();
  });

  it("walks a vertical group with the vertical arrow keys", async () => {
    const user = userEvent.setup();
    renderOriented("vertical");
    const [a, b] = screen.getAllByRole("button");

    a.focus();
    await user.keyboard("{ArrowDown}");
    expect(b).toHaveFocus();
  });

  it("ignores the cross-axis arrow keys in a vertical group", async () => {
    const user = userEvent.setup();
    renderOriented("vertical");
    const [a] = screen.getAllByRole("button");

    a.focus();
    await user.keyboard("{ArrowRight}");
    expect(a).toHaveFocus();
  });
});
