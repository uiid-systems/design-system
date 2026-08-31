import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Slider } from "./slider";
import { SliderLabel, SliderRoot } from "./subcomponents";

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
