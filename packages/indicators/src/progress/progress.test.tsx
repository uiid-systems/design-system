import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Progress } from "./progress";
import * as Examples from "./progress.examples";
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

describe("Progress size", () => {
  const rootClassName = (container: HTMLElement) =>
    part(container, "progress")?.className ?? "";

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s tier on the root",
    (size) => {
      const { container } = render(<Progress value={40} size={size} />);
      expect(rootClassName(container)).toContain(styles[`size-${size}`]);
    },
  );

  it("falls back to the medium tier", () => {
    const { container } = render(<Progress value={40} />);
    expect(rootClassName(container)).toContain(styles["size-medium"]);
  });

  it("applies one tier at a time", () => {
    const { container } = render(<Progress value={40} size="large" />);
    expect(rootClassName(container)).not.toContain(styles["size-small"]);
    expect(rootClassName(container)).not.toContain(styles["size-medium"]);
  });
});

describe("Progress color", () => {
  const rootClassName = (container: HTMLElement) =>
    part(container, "progress")?.className ?? "";

  /* The root is an ancestor of track and indicator, so one class cascades to
     both and the leaf parts stay hue-unaware. */
  it("carries the palette hue and the fill treatment on the root", () => {
    const { container } = render(<Progress value={40} color="blue" />);
    expect(part(container, "progress")).toHaveClass("palette-blue");
    expect(rootClassName(container)).toMatch(/composes-control-fill-color/);
  });

  it("leaves the root on the shade scale with no color", () => {
    const { container } = render(<Progress value={40} />);
    expect(rootClassName(container)).not.toMatch(/composes-control-fill-color/);
    expect(rootClassName(container)).not.toMatch(/palette-/);
  });
});

/* The animation and its reduced-motion fallback live in CSS, which jsdom does
   not apply; these pin the state the stylesheet keys on. */
describe("Progress indeterminate", () => {
  it("marks the root and indicator indeterminate for a null value", () => {
    const { container } = render(<Progress value={null} />);
    expect(part(container, "progress")).toHaveAttribute("data-indeterminate");
    expect(part(container, "progress-indicator")).toHaveAttribute(
      "data-indeterminate",
    );
  });

  it("reports no current value", () => {
    render(<Progress value={null} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-valuetext", "indeterminate progress");
  });

  it("omits the empty readout beside a label", () => {
    const { container } = render(<Progress value={null} label="Checking" />);
    expect(part(container, "progress-label")).toBeInTheDocument();
    expect(part(container, "progress-value")).not.toBeInTheDocument();
  });

  it("leaves a composed readout empty", () => {
    const { container } = render(
      <ProgressRoot value={null}>
        <ProgressValue />
      </ProgressRoot>,
    );
    expect(part(container, "progress-value")).toBeEmptyDOMElement();
  });

  it("sets no inline width on the indicator, leaving it to the stylesheet", () => {
    const { container } = render(<Progress value={null} />);
    expect(
      (part(container, "progress-indicator") as HTMLElement).style.width,
    ).toBe("");
  });

  it("renders the compact toast case as a bare track", () => {
    const { container } = render(
      <Progress value={null} size="xsmall" hideValue />,
    );
    expect(part(container, "progress-header")).not.toBeInTheDocument();
    expect(part(container, "progress")).toHaveClass(styles["size-xsmall"]);
    expect(part(container, "progress-indicator")).toHaveAttribute(
      "data-indeterminate",
    );
  });

  it("marks a full bar complete", () => {
    const { container } = render(<Progress value={100} />);
    expect(part(container, "progress")).toHaveAttribute("data-complete");
  });
});

describe("Progress examples", () => {
  it.each(Object.entries(Examples))(
    "%s renders a progressbar",
    (_, Example) => {
      render(<Example />);
      expect(screen.getAllByRole("progressbar").length).toBeGreaterThan(0);
    },
  );
});

/* Base UI only wires `aria-labelledby` when a label part renders, so a bare
   bar needs a name from the caller. */
describe("Progress accessible name", () => {
  it("names a bare bar from aria-label", () => {
    render(<Progress value={40} hideValue aria-label="Syncing blunders" />);
    expect(
      screen.getByRole("progressbar", { name: "Syncing blunders" }),
    ).toBeInTheDocument();
  });

  it("ships every example with a named progressbar", () => {
    for (const Example of Object.values(Examples)) {
      const { unmount } = render(<Example />);
      for (const bar of screen.getAllByRole("progressbar")) {
        expect(bar).toHaveAccessibleName();
      }
      unmount();
    }
  });
});

describe("Progress header row", () => {
  /* An indeterminate readout is empty, so without a label the row would hold
     nothing but still push the track down by its gap. */
  it("skips the row for an unlabelled indeterminate bar", () => {
    const { container } = render(<Progress value={null} aria-label="Sync" />);
    expect(part(container, "progress-header")).not.toBeInTheDocument();
  });

  it("keeps the row for an indeterminate bar with a label", () => {
    const { container } = render(<Progress value={null} label="Checking" />);
    expect(part(container, "progress-header")).toBeInTheDocument();
  });

  it("keeps the row when a custom readout can render while indeterminate", () => {
    const { container } = render(
      <Progress
        value={null}
        aria-label="Sync"
        ValueProps={{ children: () => "Starting…" }}
      />,
    );
    expect(part(container, "progress-value")).toHaveTextContent("Starting…");
  });
});

describe("Progress layout props", () => {
  it("lets a caller's gap and fullwidth reach the root", () => {
    const { container } = render(
      <Progress value={40} gap={4} fullwidth={false} />,
    );
    const root = part(container, "progress");
    expect(root).toHaveAttribute("data-ui-gap", "4");
    expect(root).not.toHaveAttribute("data-ui-fullwidth");
  });

  it("lets HeaderProps override the header's defaults", () => {
    const { container } = render(
      <Progress value={40} label="Upload" HeaderProps={{ gap: 6 }} />,
    );
    expect(part(container, "progress-header")).toHaveAttribute(
      "data-ui-gap",
      "6",
    );
  });
});
