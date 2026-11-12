import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { InputControl } from "../input/subcomponents";
import { Field } from "./field";
import {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldItem,
  FieldRow,
  FieldValidity,
  FieldHint,
  FieldAction,
  FieldDescription,
} from "./subcomponents";

import styles from "./field.module.css";

describe("Field", () => {
  it("renders children", () => {
    render(
      <Field>
        <input data-testid="child" />
      </Field>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    const { container } = render(<Field>content</Field>);
    expect(
      container.querySelector("[data-slot='field-root']"),
    ).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(
      <Field label="Email">
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders with a description", () => {
    render(
      <Field description="We'll never share your email.">
        <input />
      </Field>,
    );
    expect(
      screen.getByText("We'll never share your email."),
    ).toBeInTheDocument();
  });

  it("shows required indicator on label", () => {
    render(
      <Field label="Email" required>
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).toHaveAttribute("data-required", "true");
  });

  it("does not show required indicator when not required", () => {
    render(
      <Field label="Email">
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).not.toHaveAttribute("data-required");
  });

  it("applies floating class when errorType is absolute", () => {
    const { container } = render(
      <Field label="Email" errorType="absolute">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/field-root-floating/);
  });

  it("does not apply floating class for inline error", () => {
    const { container } = render(
      <Field label="Email" errorType="inline">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).not.toMatch(/field-root-floating/);
  });

  it("forwards className to root", () => {
    const { container } = render(
      <Field RootProps={{ className: "custom-field" }}>
        <input />
      </Field>,
    );
    expect(container.querySelector("[data-slot='field-root']")).toHaveClass(
      "custom-field",
    );
  });
});

describe("FieldControl", () => {
  it("renders an input carrying its data-slot", () => {
    const { container } = render(
      <FieldRoot>
        <FieldControl />
      </FieldRoot>,
    );
    const control = container.querySelector("[data-slot='field-control']");
    expect(control).toBeInTheDocument();
    expect(control?.tagName).toBe("INPUT");
  });

  it("retargets the rendered element through render", () => {
    const { container } = render(
      <FieldRoot>
        <FieldControl render={<textarea />} />
      </FieldRoot>,
    );
    expect(
      container.querySelector("[data-slot='field-control']")?.tagName,
    ).toBe("TEXTAREA");
  });

  it("adopts the control into the field's label association", () => {
    render(
      <FieldRoot>
        <FieldLabel>Email</FieldLabel>
        <FieldControl />
      </FieldRoot>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "data-slot",
      "field-control",
    );
  });
});

describe("FieldItem", () => {
  it("renders a div carrying its data-slot", () => {
    const { container } = render(
      <FieldRoot>
        <FieldItem>content</FieldItem>
      </FieldRoot>,
    );
    const item = container.querySelector("[data-slot='field-item']");
    expect(item).toBeInTheDocument();
    expect(item?.tagName).toBe("DIV");
  });

  it("scopes each label to its own control rather than the root's", () => {
    render(
      <FieldRoot>
        <FieldItem>
          <FieldLabel>First</FieldLabel>
          <FieldControl />
        </FieldItem>
        <FieldItem>
          <FieldLabel>Second</FieldLabel>
          <FieldControl />
        </FieldItem>
      </FieldRoot>,
    );
    expect(screen.getByLabelText("First")).not.toBe(
      screen.getByLabelText("Second"),
    );
  });
});

describe("FieldValidity", () => {
  it("hands validity state to its children function", () => {
    let received: Record<string, unknown> | undefined;
    render(
      <FieldRoot>
        <FieldControl />
        <FieldValidity>
          {(state) => {
            received = state as unknown as Record<string, unknown>;
            return null;
          }}
        </FieldValidity>
      </FieldRoot>,
    );
    expect(received).toHaveProperty("validity");
  });
});

describe("field subcomponents barrel", () => {
  it("exports FieldHint", () => {
    expect(FieldHint).toBeDefined();
  });

  it("exports FieldAction", () => {
    expect(FieldAction).toBeDefined();
  });
});

describe("Field action slot", () => {
  it("renders any node into the label row", () => {
    const { container } = render(
      <Field label="Severity" action={<button type="button">Reset</button>}>
        <input />
      </Field>,
    );
    const action = container.querySelector("[data-slot='field-action']");
    expect(action).toBeInTheDocument();
    expect(action?.querySelector("button")?.textContent).toBe("Reset");
  });

  /* The end group carries the auto start margin that keeps an action on the
     right when no label pushes it there. */
  it("puts the action inside the label row's end group when there is no label", () => {
    const { container } = render(
      <Field action={<button type="button">Reset</button>}>
        <input />
      </Field>,
    );
    const action = container.querySelector("[data-slot='field-action']");
    expect(action?.parentElement).toHaveClass(styles["field-label-end"]);
    expect(
      container.querySelector("[data-slot='field-label']"),
    ).not.toBeInTheDocument();
  });

  it("renders a FieldHint as action content", () => {
    render(
      <Field label="Email" action={<FieldHint text="Optional" />}>
        <input />
      </Field>,
    );
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("renders an ActionProps.children of 0 rather than falling back to action", () => {
    const { container } = render(
      <Field
        label="Count"
        action={<span>from action</span>}
        ActionProps={{ children: 0 }}
      >
        <input />
      </Field>,
    );
    expect(
      container.querySelector("[data-slot='field-action']")?.textContent,
    ).toBe("0");
  });

  it("lets ActionProps.children win over action", () => {
    render(
      <Field
        label="Email"
        action={<span>from action</span>}
        ActionProps={{ children: <span>from ActionProps</span> }}
      >
        <input />
      </Field>,
    );
    expect(screen.getByText("from ActionProps")).toBeInTheDocument();
    expect(screen.queryByText("from action")).not.toBeInTheDocument();
  });

  it("forwards ActionProps to the action wrapper", () => {
    const { container } = render(
      <Field
        label="Email"
        action="Optional"
        ActionProps={{ className: "custom-action" }}
      >
        <input />
      </Field>,
    );
    expect(container.querySelector("[data-slot='field-action']")).toHaveClass(
      "custom-action",
    );
  });

  it("renders no action wrapper when no action is passed", () => {
    const { container } = render(
      <Field label="Email">
        <input />
      </Field>,
    );
    expect(
      container.querySelector("[data-slot='field-action']"),
    ).not.toBeInTheDocument();
  });

  it("stops being bare once it has only an action", () => {
    const { container } = render(
      <Field action={<button type="button">Reset</button>}>
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).not.toMatch(/field-root-bare/);
  });
});

describe("Field bare mode", () => {
  it("renders bare when it paints no chrome of its own", () => {
    const { container } = render(
      <Field>
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/field-root-bare/);
  });

  it("stops being bare once it has a label", () => {
    const { container } = render(
      <Field label="Email">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).not.toMatch(/field-root-bare/);
  });

  it("adds no layout box until an inline error renders", async () => {
    const { container, rerender } = render(
      <Field>
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']")!;
    expect(getComputedStyle(root).display).toBe("contents");

    rerender(
      <Field ErrorProps={{ match: true, children: "Required" }}>
        <input />
      </Field>,
    );
    expect(
      root.querySelector(":scope > [data-slot='field-error']"),
    ).toBeInTheDocument();
    expect(getComputedStyle(root).display).not.toBe("contents");

    rerender(
      <Field ErrorProps={{ match: false, children: "Required" }}>
        <input />
      </Field>,
    );
    await waitFor(() =>
      expect(
        root.querySelector(":scope > [data-slot='field-error']"),
      ).not.toBeInTheDocument(),
    );
    expect(getComputedStyle(root).display).toBe("contents");
  });

  it("stops being bare when the error renders out of flow", () => {
    const { container } = render(
      <Field errorType="absolute">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).not.toMatch(/field-root-bare/);
  });
});

describe("Field className merging", () => {
  it("keeps a className passed directly to Field", () => {
    const { container } = render(
      <Field className="direct-class">
        <input />
      </Field>,
    );
    expect(container.querySelector("[data-slot='field-root']")).toHaveClass(
      "direct-class",
    );
  });

  it("keeps both a direct className and RootProps.className", () => {
    const { container } = render(
      <Field className="direct-class" RootProps={{ className: "root-class" }}>
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root).toHaveClass("direct-class");
    expect(root).toHaveClass("root-class");
  });
});

/* Base UI calls a function `className` with the part's state. The wrapper's
   own classes have to merge with what it returns, not drop it. */
describe("Field state-function className", () => {
  const onState = (prefix: string) => (state: { disabled: boolean }) =>
    `${prefix}-${state.disabled ? "disabled" : "enabled"}`;

  it("resolves a state-function className and RootProps.className on Field alongside its own class", () => {
    const { container } = render(
      <Field
        disabled
        className={onState("fn")}
        RootProps={{ className: onState("fn-root") }}
      >
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");

    expect(root).toHaveClass("fn-disabled");
    expect(root).toHaveClass("fn-root-disabled");
    expect(root).toHaveClass(styles["size-medium"]);
  });

  it("resolves a state-function className on the root alongside its own class", () => {
    const { container } = render(
      <FieldRoot disabled className={onState("fn")}>
        <input />
      </FieldRoot>,
    );
    const root = container.querySelector("[data-slot='field-root']");

    expect(root).toHaveClass("fn-disabled");
    expect(root).toHaveClass(styles["field-root"]);
  });
});

describe("Field invalid language", () => {
  it("carries the palette class on a required label", () => {
    render(
      <Field label="Email" required>
        <input />
      </Field>,
    );
    expect(screen.getByText("Email").className).toMatch(/palette-red/);
  });

  it("does not carry it when the field is optional", () => {
    render(
      <Field label="Email">
        <input />
      </Field>,
    );
    expect(screen.getByText("Email").className).not.toMatch(/palette-red/);
  });
});

describe("Field chrome scale", () => {
  it("carries the tier its size names", () => {
    const { container } = render(
      <Field label="Email" size="small">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/size-small/);
  });

  it("falls back to the medium tier when no size is given", () => {
    const { container } = render(
      <Field label="Email">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/size-medium/);
  });

  it("leaves the gap to the tier rather than pinning it inline", () => {
    const { container } = render(
      <Field label="Email" size="small">
        <input />
      </Field>,
    );
    const root = container.querySelector<HTMLElement>(
      "[data-slot='field-root']",
    );
    // An inline gap would outrank the tier's `--field-gap` and freeze every
    // field at one spacing, which is what the prop-driven version did.
    expect(root).not.toHaveAttribute("data-ui-gap");
  });

  it("still lets a caller pin the gap themselves", () => {
    const { container } = render(
      <Field label="Email" size="small" gap={6}>
        <input />
      </Field>,
    );
    const root = container.querySelector<HTMLElement>(
      "[data-slot='field-root']",
    );
    expect(root).toHaveAttribute("data-ui-gap", "6");
  });

  it("keeps the base class on a bare root so it still resolves a gap", () => {
    const { container } = render(
      <FieldRoot>
        <FieldLabel>Email</FieldLabel>
      </FieldRoot>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/field-root/);
    expect(root?.className).not.toMatch(/size-/);
  });
});

describe("FieldRow chrome scale", () => {
  it("scales the row's own text off the row's tier", () => {
    const { container } = render(
      <FieldRow size="small" label="Agree" description="Terms">
        <input type="checkbox" />
      </FieldRow>,
    );
    const row = container.querySelector("[data-slot='field-row']");
    expect(row?.className).toMatch(/field-row/);
    expect(row?.className).toMatch(/row-size-small/);
  });

  it("keeps a nested row on its own tier, not the enclosing field's", () => {
    const { container } = render(
      <Field label="Channels" size="large">
        <FieldRow size="small" label="Email">
          <input type="checkbox" />
        </FieldRow>
      </Field>,
    );
    expect(
      container.querySelector("[data-slot='field-root']")?.className,
    ).toMatch(/size-large/);
    expect(
      container.querySelector("[data-slot='field-row']")?.className,
    ).toMatch(/row-size-small/);
  });
});

describe("FieldRoot layout props", () => {
  const root = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[data-slot='field-root']");

  it("stretches its children across the field by default", () => {
    const { container } = render(
      <FieldRoot>
        <FieldLabel>Email</FieldLabel>
      </FieldRoot>,
    );
    expect(root(container)).toHaveAttribute("data-ui-ay", "stretch");
  });

  /*
   * `ax` used to be a literal on the root's `Stack`. Base UI merges the render
   * element's own props over the part's, so it beat the caller's.
   */
  it("forwards layout props to the root Stack", () => {
    const { container } = render(
      <FieldRoot ax="start" fullwidth>
        <FieldLabel>Email</FieldLabel>
      </FieldRoot>,
    );
    expect(root(container)).toHaveAttribute("data-ui-ay", "start");
    expect(root(container)).toHaveAttribute("data-ui-fullwidth", "");
  });
});

/* Base UI stamps `data-disabled` on the label and description from the root,
   and the shared `composes-disabled` state reads that attribute, so a Field's
   chrome dims together with the control it annotates. */
describe("Field disabled chrome", () => {
  it("composes the shared disabled state on the label and description", () => {
    render(<Field label="Email" description="Work address" disabled />);
    expect(screen.getByText("Email").className).toMatch(/composes-disabled/);
    expect(screen.getByText("Work address").className).toMatch(
      /composes-disabled/,
    );
  });
});

describe("Field ReactNode chrome", () => {
  it("renders a node as its label and description", () => {
    render(
      <Field
        label={<span data-testid="label-node">Email</span>}
        description={<em data-testid="description-node">Work only</em>}
      >
        <input />
      </Field>,
    );
    expect(
      screen.getByTestId("label-node").closest("[data-slot='field-label']"),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId("description-node")
        .closest("[data-slot='field-description']"),
    ).toBeInTheDocument();
  });

  it("renders a zero label rather than dropping it", () => {
    const { container } = render(
      <Field label={0}>
        <input />
      </Field>,
    );
    expect(
      container.querySelector("[data-slot='field-label']")?.textContent,
    ).toBe("0");
  });

  it("paints no chrome for unrenderable label and description", () => {
    const { container } = render(
      <Field label={false} description={[null, ""]}>
        <input />
      </Field>,
    );
    expect(
      container.querySelector("[data-slot='field-label']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='field-description']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='field-root']")?.className,
    ).toMatch(/field-root-bare/);
  });

  it("renders a node label on a FieldRow", () => {
    render(
      <FieldRow label={<strong data-testid="row-label">Email</strong>}>
        <input type="checkbox" />
      </FieldRow>,
    );
    expect(
      screen.getByTestId("row-label").closest("[data-slot='field-label']"),
    ).toBeInTheDocument();
  });
});

describe("Field required", () => {
  const root = (container: HTMLElement) =>
    container.querySelector("[data-slot='field-root']");

  it("marks the root when required", () => {
    const { container } = render(
      <Field label="Email" required>
        <input />
      </Field>,
    );
    expect(root(container)).toHaveAttribute("data-required", "true");
  });

  it("leaves data-required off when required is false", () => {
    const { container } = render(
      <Field label="Email" required={false}>
        <input />
      </Field>,
    );
    expect(root(container)).not.toHaveAttribute("data-required");
    expect(screen.getByText("Email")).not.toHaveAttribute("data-required");
  });

  it("hands required to a FieldControl inside it", () => {
    render(
      <Field label="Email" required>
        <FieldControl />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeRequired();
  });

  it("hands required to an InputControl inside it", () => {
    render(
      <Field label="Email" required>
        <InputControl />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeRequired();
  });

  it("leaves a control outside any Field unrequired", () => {
    render(<FieldControl aria-label="Email" />);
    expect(screen.getByLabelText("Email")).not.toBeRequired();
  });

  it("lets the control's own required win", () => {
    render(
      <Field label="Email" required>
        <FieldControl required={false} />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).not.toBeRequired();
  });

  it("does not leak required into a nested field", () => {
    render(
      <Field label="Outer" required>
        <Field label="Inner">
          <FieldControl />
        </Field>
      </Field>,
    );
    expect(screen.getByLabelText("Inner")).not.toBeRequired();
  });

  it("forwards LabelProps to the label", () => {
    render(
      <Field label="Email" LabelProps={{ className: "custom-label" }}>
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).toHaveClass("custom-label");
  });
});

describe("FieldDescription shade", () => {
  it("defaults to the muted shade", () => {
    render(
      <FieldRoot>
        <FieldDescription>Help</FieldDescription>
      </FieldRoot>,
    );
    expect(screen.getByText("Help")).toHaveAttribute("data-ui-shade", "muted");
  });

  it("takes a caller's shade", () => {
    render(
      <FieldRoot>
        <FieldDescription shade="foreground">Help</FieldDescription>
      </FieldRoot>,
    );
    expect(screen.getByText("Help")).toHaveAttribute(
      "data-ui-shade",
      "foreground",
    );
  });
});
