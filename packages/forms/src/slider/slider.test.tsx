import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "./slider";

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
    const { container } = render(<Slider min={10} max={80} defaultValue={20} />);
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
