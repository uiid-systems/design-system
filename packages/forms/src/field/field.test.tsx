import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Field } from "./field";
import {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldItem,
  FieldValidity,
  FieldHint,
} from "./subcomponents";

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
});
