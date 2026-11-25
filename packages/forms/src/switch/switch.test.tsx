import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { matchesComposition } from "../shared/matches-composition";
import { Switch } from "./switch";
import type { SwitchProps } from "./switch.types";

import checkboxStyles from "../checkbox/checkbox.module.css";
import fieldStyles from "../field/field.module.css";
import styles from "./switch.module.css";

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

/* The id lands on the hidden input, which is the element a label targets. A
   form `name` is not unique per page, so it must never double as that id. */
describe("Switch id", () => {
  const inputOf = (switchEl: HTMLElement) =>
    switchEl.parentElement?.querySelector("input[type='checkbox']");

  it("gives two switches sharing a name distinct ids", () => {
    render(
      <>
        <Switch name="enabled" label="First" />
        <Switch name="enabled" label="Second" />
      </>,
    );
    const [first, second] = screen.getAllByRole("switch").map(inputOf);

    expect(first?.id).toBeTruthy();
    expect(second?.id).toBeTruthy();
    expect(first?.id).not.toBe(second?.id);
    expect(first?.id).not.toBe("enabled");
  });

  it("toggles only its own switch when a label is clicked", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Switch name="enabled" label="First" />
        <Switch name="enabled" label="Second" />
      </>,
    );
    const [first, second] = screen.getAllByRole("switch");

    await user.click(screen.getByText("Second"));
    expect(second).toHaveAttribute("data-checked");
    expect(first).not.toHaveAttribute("data-checked");

    await user.click(screen.getByText("First"));
    expect(first).toHaveAttribute("data-checked");
    expect(second).toHaveAttribute("data-checked");
  });

  it("honors an explicit id", () => {
    render(<Switch id="notifications" name="enabled" label="Notify me" />);

    expect(inputOf(screen.getByRole("switch"))).toHaveAttribute(
      "id",
      "notifications",
    );
    expect(screen.getByText("Notify me")).toHaveAttribute(
      "for",
      "notifications",
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

/* A part's `className` is a string, merged with its own module class. Its
   state is styled through the `data-*` attributes Base UI sets. */
describe("Switch className", () => {
  it("merges a caller's className on the root with its own class and marks its state", () => {
    const { container } = render(
      <Switch defaultChecked RootProps={{ className: "caller" }} />,
    );
    const root = container.querySelector("[data-slot='switch-root']");

    expect(root).toHaveClass("caller");

    expect(root).toHaveAttribute("data-checked");
    expect(root).toHaveClass(styles["switch-root"]);
  });

  it("merges a caller's className on the thumb with its own class and marks its state", () => {
    const { container } = render(
      <Switch defaultChecked ThumbProps={{ className: "caller" }} />,
    );
    const thumb = container.querySelector("[data-slot='switch-thumb']");

    expect(thumb).toHaveClass("caller");

    expect(thumb).toHaveAttribute("data-checked");
    expect(thumb).toHaveClass(styles["switch-thumb"]);
  });
});

describe("Switch reversed", () => {
  it("shares the reversed row class with Checkbox", () => {
    const { container } = render(<Switch reversed label="Dark mode" />);
    expect(container.querySelector("[data-slot='field-row']")).toHaveClass(
      checkboxStyles["toggle-reversed"],
    );
  });
});

/* A row with no label or description paints no frame, so the frame classes stay
   off it. The caller's class is not part of that frame and stays on. */
describe("Switch FieldProps className", () => {
  it("merges a FieldProps className with the row's own classes", () => {
    const { container } = render(
      <Switch
        bordered
        reversed
        label="Dark mode"
        FieldProps={{ className: "custom-row" }}
      />,
    );
    const row = container.querySelector("[data-slot='field-row']");

    expect(row).toHaveClass("custom-row");
    expect(row).toHaveClass(styles["switch-label"]);
    expect(row).toHaveClass(checkboxStyles["toggle-bordered"]);
    expect(row).toHaveClass(checkboxStyles["toggle-reversed"]);
  });

  it("keeps a FieldProps className on a row with no label or description", () => {
    const { container } = render(
      <Switch bordered reversed FieldProps={{ className: "custom-row" }} />,
    );
    const row = container.querySelector("[data-slot='field-row']");

    expect(row).toHaveClass("custom-row");
    expect(row).toHaveClass(fieldStyles["field-row-bare"]);
    expect(row).not.toHaveClass(styles["switch-label"]);
    expect(row).not.toHaveClass(checkboxStyles["toggle-bordered"]);
    expect(row).not.toHaveClass(checkboxStyles["toggle-reversed"]);
  });
});

describe("Switch FieldProps", () => {
  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = <T,>(slot: Record<string, unknown>) => slot as T;

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects FieldProps the control owns", () => {
    // @ts-expect-error -- `label` is set on Switch itself
    void (<Switch FieldProps={{ label: "Other" }} />);
    // @ts-expect-error -- `description` is set on Switch itself
    void (<Switch FieldProps={{ description: "Other" }} />);
    // @ts-expect-error -- `size` is set on Switch itself
    void (<Switch FieldProps={{ size: "small" }} />);
    // @ts-expect-error -- `reversed` is set on Switch itself
    void (<Switch FieldProps={{ reversed: true }} />);
    // @ts-expect-error -- `bordered` is set on Switch itself
    void (<Switch FieldProps={{ bordered: true }} />);
    // @ts-expect-error -- the row's content is Switch's own control
    void (<Switch FieldProps={{ children: "Other" }} />);
    void (
      <Switch
        label="Dark mode"
        // @ts-expect-error -- `label` is the label's content
        FieldProps={{ LabelProps: { children: "Other" } }}
      />
    );
    void (
      <Switch
        description="Help"
        // @ts-expect-error -- `description` is the description's content
        FieldProps={{ DescriptionProps: { children: "Other" } }}
      />
    );
  });

  it("keeps a slot label when the top level leaves it unset", () => {
    render(
      <Switch
        FieldProps={untyped<SwitchProps["FieldProps"]>({ label: "Slot" })}
      />,
    );
    expect(screen.getByRole("switch", { name: "Slot" })).toBeInTheDocument();
  });

  it("lets the top-level values win over the same keys in FieldProps", () => {
    const { container } = render(
      <Switch
        label="Top"
        description="Top help"
        size="large"
        reversed={false}
        bordered={false}
        FieldProps={untyped<SwitchProps["FieldProps"]>({
          label: "Slot",
          description: "Slot help",
          size: "small",
          reversed: true,
          bordered: true,
        })}
      />,
    );
    const row = container.querySelector("[data-slot='field-row']");

    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Top help")).toBeInTheDocument();
    expect(screen.queryByText(/Slot/)).not.toBeInTheDocument();
    expect(row?.className).toContain("row-size-large");
    expect(row).not.toHaveClass(checkboxStyles["toggle-reversed"]);
    expect(row).not.toHaveClass(checkboxStyles["toggle-bordered"]);
  });
});

describe("Switch RootProps precedence", () => {
  it("lets a top-level prop win over the same key in RootProps", () => {
    render(<Switch aria-label="top" RootProps={{ "aria-label": "slot" }} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "top");
  });

  it("lets a top-level size win over RootProps.size", () => {
    render(<Switch size="large" RootProps={{ size: "small" }} />);
    expect(screen.getByRole("switch").className).toContain("size-large");
    expect(screen.getByRole("switch").className).not.toContain("size-small");
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    render(<Switch RootProps={{ size: "small" }} />);
    expect(screen.getByRole("switch").className).toContain("size-small");
  });
});

describe("Switch row disabled treatment", () => {
  const row = (container: HTMLElement) =>
    container.querySelector("[data-slot='field-row']");

  it("reads disabled off the switch, using the shared container composition", () => {
    const { container } = render(<Switch label="Dark mode" />);
    expect(row(container)?.className).toMatch(/composes-disabled-within/);
  });

  it("dims the row while the switch is disabled", () => {
    const { container } = render(<Switch label="Dark mode" disabled />);
    expect(matchesComposition(row(container), "disabled-within")).toBe(true);
  });

  it("leaves the row undimmed while the switch is enabled", () => {
    const { container } = render(<Switch label="Dark mode" />);
    expect(matchesComposition(row(container), "disabled-within")).toBe(false);
  });
});
