import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  it("renders a switch element", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "data-slot",
      "switch-root",
    );
  });

  it("renders with a label after the switch by default", () => {
    render(<Switch label="Dark mode" />);
    const switchEl = screen.getByRole("switch");
    const label = screen.getByText("Dark mode");

    expect(label).toBeInTheDocument();
    // Label should come after switch in DOM order
    expect(switchEl.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders with reversed prop", () => {
    render(<Switch label="Dark mode" reversed />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("can be toggled by clicking", async () => {
    const user = userEvent.setup();
    render(<Switch />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(switchEl).toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(switchEl).not.toHaveAttribute("data-checked");
  });

  it("supports controlled checked state", async () => {
    const handleChange = vi.fn();

    const ControlledSwitch = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          checked={checked}
          onCheckedChange={(value) => {
            setChecked(value);
            handleChange(value);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledSwitch />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(switchEl).toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(switchEl).not.toHaveAttribute("data-checked");
  });

  it("supports defaultChecked for uncontrolled usage", () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-checked");
  });

  it("can be disabled", () => {
    render(<Switch disabled />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch disabled />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(switchEl).not.toHaveAttribute("data-checked");
  });

  it("passes RootProps to the switch root", () => {
    render(<Switch RootProps={{ "aria-label": "Custom label" }} />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-label",
      "Custom label",
    );
  });
});

describe("Switch field row scoping", () => {
  it("renders the control inside the field row, not before it", () => {
    const { container } = render(<Switch label="Dark mode" />);
    const row = container.querySelector("[data-slot='field-row']");
    expect(row).toBeInTheDocument();
    expect(row).toContainElement(screen.getByRole("switch"));
  });

  it("associates the label with its own control", () => {
    render(<Switch label="Dark mode" />);
    expect(screen.getAllByLabelText("Dark mode")).toContain(
      screen.getByRole("switch"),
    );
  });
});

describe("Switch invalid treatment", () => {
  it("adopts the shared invalid composition", () => {
    render(<Switch />);
    expect(screen.getByRole("switch").className).toMatch(/composes-invalid/);
  });
});

describe("Switch size variant", () => {
  const rowClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='field-row']")?.className ?? "";

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the track",
    (size) => {
      render(<Switch size={size} />);
      expect(screen.getByRole("switch").className).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier, matching Input", () => {
    render(<Switch />);
    expect(screen.getByRole("switch").className).toContain("size-medium");
  });

  it("applies one tier at a time", () => {
    render(<Switch size="large" />);
    expect(screen.getByRole("switch").className).not.toContain("size-small");
    expect(screen.getByRole("switch").className).not.toContain("size-medium");
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "carries the %s tier onto the row, which is what scales bordered padding",
    (size) => {
      const { container } = render(
        <Switch bordered size={size} label="Dark mode" />,
      );
      expect(rowClassName(container)).toContain(`row-size-${size}`);
    },
  );
});

describe("Switch color", () => {
  it("carries the palette hue and the fill treatment on the root", () => {
    render(<Switch color="blue" label="Dark mode" />);

    const root = screen.getByRole("switch");

    expect(root).toHaveClass("palette-blue");
    expect(root.className).toMatch(/composes-control-fill-color/);
  });

  /* The thumb reads --control-on-fill off the root, so the pairing has to land
     on the root rather than on the thumb itself. */
  it("leaves the root on the shade scale with no color", () => {
    render(<Switch label="Dark mode" />);
    expect(screen.getByRole("switch").className).not.toMatch(
      /composes-control-fill-color/,
    );
  });
});
