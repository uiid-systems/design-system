import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

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

  it("renders a FieldHint as action content", () => {
    render(
      <Field label="Email" action={<FieldHint text="Optional" />}>
        <input />
      </Field>,
    );
    expect(screen.getByText("Optional")).toBeInTheDocument();
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
    expect(root(container)?.className).toMatch(/toggle-fullwidth/);
  });
});
