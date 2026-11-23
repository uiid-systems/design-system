import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Slider } from "./slider";
import { SliderLabel, SliderRoot } from "./subcomponents";

import fieldStyles from "../field/field.module.css";
import inputStyles from "../input/input.module.css";
import styles from "./slider.module.css";

describe("Slider", () => {
  it("renders a slider element", () => {
    render(<Slider />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    const { container } = render(<Slider />);
    expect(
      container.querySelector("[data-slot='slider-root']"),
    ).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Slider label="Volume" />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  it("renders with a description", () => {
    render(<Slider label="Volume" description="Adjust the volume level" />);
    expect(screen.getByText("Adjust the volume level")).toBeInTheDocument();
  });

  it("renders with defaultValue", () => {
    render(<Slider defaultValue={50} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });

  it("supports controlled value via RootProps", async () => {
    const handleChange = vi.fn();

    const ControlledSlider = () => {
      const [value, setValue] = useState(25);
      return (
        <Slider
          RootProps={{
            value: value,
            onValueChange: (v) => {
              const num = Array.isArray(v) ? v[0] : v;
              setValue(num);
              handleChange(num);
            },
          }}
        />
      );
    };

    render(<ControlledSlider />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "25");
  });

  it("respects min and max values", () => {
    const { container } = render(
      <Slider min={10} max={80} defaultValue={20} />,
    );
    const root = container.querySelector("[data-slot='slider-root']");
    expect(root).toBeInTheDocument();
    // Slider renders with constrained value within range
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "20");
  });

  it("supports disabled state", () => {
    const { container } = render(<Slider disabled />);
    const root = container.querySelector("[data-slot='slider-root']");
    expect(root).toHaveAttribute("data-disabled", "");
  });

  it("renders slider value output", () => {
    const { container } = render(<Slider defaultValue={75} />);
    expect(
      container.querySelector("[data-slot='slider-value']"),
    ).toBeInTheDocument();
  });
});

/* The monolithic Slider destructures a fixed prop list and spreads the rest,
   so both change signals reach Base UI only by falling through `...props`.
   Adding either to that destructure would swallow it silently — and a
   swallowed `onValueCommitted` sends callers back to the expensive handler. */
describe("Slider change signals", () => {
  const pressArrow = async (user: ReturnType<typeof userEvent.setup>) => {
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
  };

  it("forwards onValueChange to the root", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Slider defaultValue={40} onValueChange={onValueChange} />);
    await pressArrow(user);

    expect(onValueChange).toHaveBeenCalled();
  });

  it("forwards onValueCommitted to the root", async () => {
    const user = userEvent.setup();
    const onValueCommitted = vi.fn();

    render(<Slider defaultValue={40} onValueCommitted={onValueCommitted} />);
    await pressArrow(user);

    expect(onValueCommitted).toHaveBeenCalled();
  });

  it("forwards both through RootProps as well", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommitted = vi.fn();

    render(
      <Slider
        defaultValue={40}
        RootProps={{ onValueChange, onValueCommitted }}
      />,
    );
    await pressArrow(user);

    expect(onValueChange).toHaveBeenCalled();
    expect(onValueCommitted).toHaveBeenCalled();
  });
});

describe("Slider range support", () => {
  it("renders one thumb per value", () => {
    render(<Slider defaultValue={[20, 60]} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("still renders a single thumb for a scalar value", () => {
    render(<Slider defaultValue={40} />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });

  it("gives each thumb its index so a range renders server-side", () => {
    const { container } = render(<Slider defaultValue={[10, 30, 70]} />);
    expect(
      container.querySelectorAll("[data-slot='slider-thumb']").length,
    ).toBe(3);
  });

  it("shows every value, not just the first", () => {
    const { container } = render(<Slider defaultValue={[20, 60]} />);
    const output = container.querySelector("[data-slot='slider-value']");
    expect(output?.textContent).toContain("20");
    expect(output?.textContent).toContain("60");
  });
});

describe("SliderValue children contract", () => {
  it("uses a consumer-supplied render function instead of discarding it", () => {
    render(
      <Slider
        defaultValue={[25, 75]}
        ValueProps={{
          children: (formatted, values) =>
            `${values.length} handles: ${formatted.join(" to ")}`,
        }}
      />,
    );

    expect(screen.getByText(/2 handles: 25 to 75/)).toBeInTheDocument();
  });
});

describe("Slider label part", () => {
  it("exposes SliderLabel as a composable part", () => {
    const { container } = render(
      <SliderRoot defaultValue={10}>
        <SliderLabel>Volume</SliderLabel>
      </SliderRoot>,
    );

    const label = container.querySelector("[data-slot='slider-label']");
    expect(label).not.toBeNull();
    expect(label?.textContent).toBe("Volume");
  });
});

describe("Slider size variant", () => {
  const rootClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='slider-root']")?.className ?? "";

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the root",
    (size) => {
      const { container } = render(<Slider size={size} />);
      expect(rootClassName(container)).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier", () => {
    const { container } = render(<Slider />);
    expect(rootClassName(container)).toContain("size-medium");
  });

  it("applies one tier at a time", () => {
    const { container } = render(<Slider size="large" />);
    expect(rootClassName(container)).not.toContain("size-small");
    expect(rootClassName(container)).not.toContain("size-medium");
  });

  it("paints Slider's own tier, which carries the thumb and track scale", () => {
    const { container } = render(<Slider size="small" />);
    expect(rootClassName(container)).toContain(styles["size-small"]);
  });

  it("sizes the field chrome from the same prop, so the label scales too", () => {
    const { container } = render(<Slider label="Volume" size="large" />);
    const field = container.querySelector("[data-slot='field-root']");
    expect(field).toHaveClass(fieldStyles["size-large"]);
    expect(field).not.toHaveClass(fieldStyles["size-medium"]);
  });

  it("lets the readout inherit the tier's font size", () => {
    const { container } = render(<Slider defaultValue={40} />);
    const value = container.querySelector("[data-slot='slider-value']");
    expect(value).toHaveClass(styles["slider-value"]);
  });
});

describe("Slider control surface", () => {
  /* The root renders through `Group`, whose Box reset outranks the surface's
     edge, so it takes Input's restated one or its border is zero wide. */
  it("restates the edge the layout primitive would otherwise zero", () => {
    const { container } = render(<Slider />);
    expect(
      container.querySelector("[data-slot='slider-root']")?.className,
    ).toMatch(/input-edge/);
  });
});

describe("Slider color", () => {
  const rootClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='slider-root']")?.className ?? "";

  /* The root is an ancestor of track, indicator and thumb, so one class
     cascades to all three and the leaf subcomponents stay hue-unaware. */
  it("carries the palette hue and the fill treatment on the root", () => {
    const { container } = render(<Slider color="blue" defaultValue={40} />);

    expect(container.querySelector("[data-slot='slider-root']")).toHaveClass(
      "palette-blue",
    );
    expect(rootClassName(container)).toMatch(/composes-control-fill-color/);
  });

  /* Slider wears Input's control surface, but a hue marks the filled track
     rather than tinting that surface — so it must not pick up the field
     treatment. */
  it("takes the fill treatment, not the field surface tint", () => {
    const { container } = render(<Slider color="blue" defaultValue={40} />);
    expect(rootClassName(container)).not.toMatch(
      /composes-field-surface-color/,
    );
  });

  it("leaves the root on the shade scale with no color", () => {
    const { container } = render(<Slider defaultValue={40} />);
    expect(rootClassName(container)).not.toMatch(/composes-control-fill-color/);
  });
});

describe("Slider layout props", () => {
  const root = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[data-slot='slider-root']");
  const control = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[data-slot='slider-control']");

  it("keeps the root's and control's own layout by default", () => {
    const { container } = render(<Slider />);
    expect(root(container)).toHaveAttribute("data-ui-gap", "2");
    expect(root(container)).toHaveAttribute("data-ui-ay", "center");
    expect(control(container)).toHaveAttribute("data-ui-px", "3");
  });

  /*
   * Base UI merges the render element's own props over the part's, so a
   * default written as a literal on the `Group` would beat these.
   */
  it("forwards layout props to the root Group", () => {
    const { container } = render(<Slider gap={4} ay="end" />);
    expect(root(container)).toHaveAttribute("data-ui-gap", "4");
    expect(root(container)).toHaveAttribute("data-ui-ay", "end");
  });

  it("forwards layout props from ControlProps to the control Group", () => {
    const { container } = render(
      <Slider ControlProps={{ px: 5, fullwidth: false }} />,
    );
    expect(control(container)).toHaveAttribute("data-ui-px", "5");
    expect(control(container)).not.toHaveAttribute("data-ui-fullwidth");
  });
});

/* A part's `className` is a string, merged with its own module class. Its
   state is styled through the `data-*` attributes Base UI sets. Every
   part shares the root's state, so each one marks the root's `disabled`. */
describe("Slider className", () => {
  const part = (container: HTMLElement, slot: string) =>
    container.querySelector(`[data-slot='slider-${slot}']`);

  it("merges a caller's className on the root with its own class and marks its state", () => {
    const { container } = render(
      <Slider disabled defaultValue={40} RootProps={{ className: "caller" }} />,
    );

    expect(part(container, "root")).toHaveClass("caller");

    expect(part(container, "root")).toHaveAttribute("data-disabled");
    expect(part(container, "root")).toHaveClass(inputStyles["input"]);
  });

  it("merges a caller's className on the control with its own class and marks its state", () => {
    const { container } = render(
      <Slider
        disabled
        defaultValue={40}
        ControlProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "control")).toHaveClass("caller");

    expect(part(container, "control")).toHaveAttribute("data-disabled");
    expect(part(container, "control")).toHaveClass(styles["slider-control"]);
  });

  it("merges a caller's className on the track with its own class and marks its state", () => {
    const { container } = render(
      <Slider
        disabled
        defaultValue={40}
        TrackProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "track")).toHaveClass("caller");

    expect(part(container, "track")).toHaveAttribute("data-disabled");
    expect(part(container, "track")).toHaveClass(styles["slider-track"]);
  });

  it("merges a caller's className on the indicator with its own class and marks its state", () => {
    const { container } = render(
      <Slider
        disabled
        defaultValue={40}
        IndicatorProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "indicator")).toHaveClass("caller");

    expect(part(container, "indicator")).toHaveAttribute("data-disabled");
    expect(part(container, "indicator")).toHaveClass(
      styles["slider-indicator"],
    );
  });

  it("merges a caller's className on the thumb with its own class and marks its state", () => {
    const { container } = render(
      <Slider
        disabled
        defaultValue={40}
        ThumbProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "thumb")).toHaveClass("caller");

    expect(part(container, "thumb")).toHaveAttribute("data-disabled");
    expect(part(container, "thumb")).toHaveClass(styles["slider-thumb"]);
  });
});

describe("Slider RootProps precedence", () => {
  const root = (container: HTMLElement) =>
    container.querySelector("[data-slot='slider-root']");

  it("lets a top-level prop win over the same key in RootProps", () => {
    const { container } = render(
      <Slider aria-label="top" RootProps={{ "aria-label": "slot" }} />,
    );
    expect(root(container)).toHaveAttribute("aria-label", "top");
  });

  it("lets a top-level size win over RootProps.size", () => {
    const { container } = render(
      <Slider size="large" RootProps={{ size: "small" }} />,
    );
    expect(root(container)?.className).toContain("size-large");
    expect(root(container)?.className).not.toContain("size-small");
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    const { container } = render(<Slider RootProps={{ size: "small" }} />);
    expect(root(container)?.className).toContain("size-small");
  });
});
