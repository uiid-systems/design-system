import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Progress } from "./progress";
import {
  ProgressRoot,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
} from "./subcomponents";

import styles from "./progress.module.css";

const part = (container: HTMLElement, slot: string) =>
  container.querySelector(`[data-slot='${slot}']`);

describe("Progress", () => {
  it("renders a progressbar", () => {
    render(<Progress value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("reports the value to assistive tech", () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets a data-slot on every part", () => {
    const { container } = render(<Progress value={40} label="Upload" />);
    for (const slot of [
      "progress",
      "progress-header",
      "progress-label",
      "progress-value",
      "progress-track",
      "progress-indicator",
    ]) {
      expect(part(container, slot)).toBeInTheDocument();
    }
  });

  it("names the progressbar from its label", () => {
    render(<Progress value={40} label="Uploading files" />);
    expect(
      screen.getByRole("progressbar", { name: "Uploading files" }),
    ).toBeInTheDocument();
  });

  it("renders no label part without a label", () => {
    const { container } = render(<Progress value={40} />);
    expect(part(container, "progress-label")).not.toBeInTheDocument();
  });

  it("renders the formatted value", () => {
    const { container } = render(<Progress value={40} />);
    expect(part(container, "progress-value")).toHaveTextContent("40%");
  });

  it("merges a className onto the root", () => {
    const { container } = render(<Progress value={40} className="custom" />);
    expect(part(container, "progress")).toHaveClass("custom");
    expect(part(container, "progress")).toHaveClass(styles["progress"]);
  });

  it("spreads remaining props to the root", () => {
    const { container } = render(<Progress value={40} id="sync" />);
    expect(part(container, "progress")).toHaveAttribute("id", "sync");
  });
});

describe("Progress parts", () => {
  it("compose into a working progressbar without the monolith", () => {
    render(
      <ProgressRoot value={25}>
        <ProgressLabel>Parts</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </ProgressRoot>,
    );
    const bar = screen.getByRole("progressbar", { name: "Parts" });
    expect(bar).toHaveAttribute("aria-valuenow", "25");
    expect(bar).toHaveTextContent("25%");
  });
});

/* Base UI calls a function `className` with the part's state. Every part
   shares the root's state, so each one reads the status off it. */
describe("Progress state-function className", () => {
  const onState = (state: { status: string }) => `fn-${state.status}`;

  it.each([
    ["progress", "RootProps"],
    ["progress-label", "LabelProps"],
    ["progress-value", "ValueProps"],
    ["progress-track", "TrackProps"],
    ["progress-indicator", "IndicatorProps"],
  ] as const)(
    "resolves one on %s alongside its own class",
    (slot, slotProps) => {
      const { container } = render(
        <Progress
          value={40}
          label="Upload"
          {...{ [slotProps]: { className: onState } }}
        />,
      );
      const el = part(container, slot);
      expect(el).toHaveClass("fn-progressing");
      expect(el).toHaveClass(styles[slot]);
    },
  );
});

describe("Progress API", () => {
  it("takes min and max at the top level", () => {
    const { container } = render(<Progress value={5} min={0} max={10} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "5");
    expect(bar).toHaveAttribute("aria-valuemax", "10");
    expect(part(container, "progress-value")).toHaveTextContent("50%");
  });

  it("formats the readout with format and locale", () => {
    const { container } = render(
      <Progress
        value={1234}
        max={5000}
        format={{ style: "decimal" }}
        locale="en-US"
      />,
    );
    expect(part(container, "progress-value")).toHaveTextContent("1,234");
  });

  it("derives aria-valuetext from getAriaValueText", () => {
    render(
      <Progress
        value={3}
        max={5}
        getAriaValueText={(_, value) => `${value} of 5 categories`}
      />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "3 of 5 categories",
    );
  });

  it("accepts a node as the label", () => {
    render(
      <Progress
        value={40}
        label={
          <>
            Syncing <strong>blitz</strong>
          </>
        }
      />,
    );
    expect(screen.getByText("blitz").tagName).toBe("STRONG");
    expect(
      screen.getByRole("progressbar", { name: "Syncing blitz" }),
    ).toBeInTheDocument();
  });

  it("honours a render function passed as ValueProps.children", () => {
    const { container } = render(
      <Progress
        value={3}
        max={5}
        ValueProps={{ children: (_, value) => `${value} / 5` }}
      />,
    );
    expect(part(container, "progress-value")).toHaveTextContent("3 / 5");
  });
});

describe("Progress hideValue", () => {
  it("drops the readout", () => {
    const { container } = render(
      <Progress value={40} label="Upload" hideValue />,
    );
    expect(part(container, "progress-value")).not.toBeInTheDocument();
    expect(part(container, "progress-label")).toBeInTheDocument();
  });

  it("keeps the value available to assistive tech", () => {
    render(<Progress value={40} hideValue />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
  });

  it("drops the header row when there is no label either", () => {
    const { container } = render(<Progress value={40} hideValue />);
    expect(part(container, "progress-header")).not.toBeInTheDocument();
    expect(part(container, "progress-track")).toBeInTheDocument();
  });

  it("shows the readout by default", () => {
    const { container } = render(<Progress value={40} />);
    expect(part(container, "progress-value")).toBeInTheDocument();
  });
});
