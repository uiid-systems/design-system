import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, it, expect } from "vitest";

import { Checkbox } from "../checkbox/checkbox";
import { Form } from "../form/form";
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

describe("Field error and description", () => {
  const DESCRIPTION = "We never share it.";
  const describedBy = (control: HTMLElement) =>
    (control.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
  const describedText = (control: HTMLElement) =>
    describedBy(control).map((id) => document.getElementById(id)?.textContent);

  it("shows the description and describes the control by it while valid", () => {
    render(
      <Field label="Email" description={DESCRIPTION}>
        <FieldControl />
      </Field>,
    );

    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
    expect(describedText(screen.getByRole("textbox"))).toEqual([DESCRIPTION]);
  });

  it("replaces the description with the error while invalid", () => {
    const { container } = render(
      <Field
        label="Email"
        description={DESCRIPTION}
        ErrorProps={{ match: true, children: "Enter an email" }}
      >
        <FieldControl />
      </Field>,
    );

    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='field-description']"),
    ).not.toBeInTheDocument();
    expect(describedText(screen.getByRole("textbox"))).toEqual([
      "Enter an email",
    ]);
  });

  it("renders the error last in the field, where the description was", () => {
    const { container } = render(
      <Field
        label="Email"
        description={DESCRIPTION}
        ErrorProps={{ match: true, children: "Enter an email" }}
      >
        <FieldControl />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");

    expect(root?.lastElementChild).toHaveAttribute("data-slot", "field-error");
  });

  it("replaces the description with every error a Form publishes", () => {
    render(
      <Form errors={{ email: ["Enter an email", "Use a work address"] }}>
        <Field name="email" label="Email" description={DESCRIPTION}>
          <FieldControl />
        </Field>
      </Form>,
    );
    const control = screen.getByRole("textbox");

    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument();
    expect(describedBy(control)).toHaveLength(1);
    const [text] = describedText(control);
    expect(text).toContain("Enter an email");
    expect(text).toContain("Use a work address");
  });

  it("puts the error in the same slot when there is no description", () => {
    render(
      <Field label="Email" ErrorProps={{ match: true, children: "Required" }}>
        <FieldControl />
      </Field>,
    );

    expect(describedText(screen.getByRole("textbox"))).toEqual(["Required"]);
  });

  it("brings the description back once the error clears", async () => {
    const { rerender } = render(
      <Field
        label="Email"
        description={DESCRIPTION}
        ErrorProps={{ match: true, children: "Enter an email" }}
      >
        <FieldControl />
      </Field>,
    );
    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument();

    rerender(
      <Field
        label="Email"
        description={DESCRIPTION}
        ErrorProps={{ match: false, children: "Enter an email" }}
      >
        <FieldControl />
      </Field>,
    );

    await waitFor(() =>
      expect(screen.getByText(DESCRIPTION)).toBeInTheDocument(),
    );
    expect(screen.queryByText("Enter an email")).not.toBeInTheDocument();
    expect(describedText(screen.getByRole("textbox"))).toEqual([DESCRIPTION]);
  });

  it("swaps the description and the error as validation runs", async () => {
    const user = userEvent.setup();
    render(
      <Field
        label="Email"
        description={DESCRIPTION}
        validationMode="onChange"
        validate={(value) =>
          String(value).includes("@") ? null : "Enter an email"
        }
      >
        <FieldControl />
      </Field>,
    );
    const control = screen.getByRole("textbox");

    await user.type(control, "a");
    await waitFor(() =>
      expect(describedText(control)).toEqual(["Enter an email"]),
    );
    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument();

    await user.type(control, "@b");
    await waitFor(() => expect(describedText(control)).toEqual([DESCRIPTION]));
    expect(screen.queryByText("Enter an email")).not.toBeInTheDocument();
  });

  it("keeps the description when match is forced with no message", () => {
    const { container } = render(
      <Field
        label="Email"
        description={DESCRIPTION}
        ErrorProps={{ match: true, children: undefined }}
      >
        <FieldControl />
      </Field>,
    );

    expect(
      container.querySelector("[data-slot='field-error']"),
    ).not.toBeInTheDocument();
    expect(describedText(screen.getByRole("textbox"))).toEqual([DESCRIPTION]);
  });

  it("hides the description in server markup that already holds the error", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToString(
      <Form errors={{ email: "Enter an email" }}>
        <Field name="email" label="Email" description={DESCRIPTION}>
          <FieldControl />
        </Field>
      </Form>,
    );
    document.body.append(host);

    const description = host.querySelector("[data-slot='field-description']");
    expect(host.querySelector("[data-slot='field-error']")).toHaveTextContent(
      "Enter an email",
    );
    expect(description).toBeInTheDocument();
    expect(getComputedStyle(description as Element).display).toBe("none");
    host.remove();
  });

  it("passes ErrorProps to the error element", () => {
    const { container } = render(
      <Field
        label="Email"
        ErrorProps={{
          match: true,
          children: "Enter an email",
          id: "email-error",
          className: "custom-error",
          title: "Error",
        }}
      >
        <FieldControl />
      </Field>,
    );
    const error = container.querySelector("[data-slot='field-error']");

    expect(error).toHaveAttribute("id", "email-error");
    expect(error).toHaveClass("custom-error");
    expect(error).toHaveAttribute("title", "Error");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "email-error",
    );
  });

  it("forwards a ref to the error element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Field
        label="Email"
        ErrorProps={{ match: true, children: "Required", ref }}
      >
        <FieldControl />
      </Field>,
    );

    expect(ref.current).toHaveAttribute("data-slot", "field-error");
  });

  it("renders no error while the field is valid", () => {
    const { container } = render(
      <Field label="Email">
        <FieldControl />
      </Field>,
    );

    expect(
      container.querySelector("[data-slot='field-error']"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby");
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

  /* A hint is static: an icon and text, with nothing to open. Guidance too
     long for the label row belongs in `description`. */
  it("renders a FieldHint icon as static content, not a trigger", () => {
    const Icon = () => <svg data-testid="hint-icon" />;
    const { container } = render(
      <Field label="Email" action={<FieldHint icon={Icon} text="Optional" />}>
        <input />
      </Field>,
    );
    expect(screen.getByTestId("hint-icon")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='field-hint'] [tabindex]"),
    ).not.toBeInTheDocument();
  });

  /* Type-level only: `pnpm typecheck` fails if either directive goes unused. */
  it("types FieldHint as a static hint that always has text", () => {
    const Icon = () => <svg />;
    // @ts-expect-error -- the `{ icon, tooltip }` form was removed (UI-398)
    void (<FieldHint icon={Icon} text="Optional" tooltip="Receipts only." />);
    // @ts-expect-error -- a hint always says something
    void (<FieldHint icon={Icon} />);
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

  it("stops being bare once it has only a description", () => {
    const { container } = render(
      <Field description="Optional">
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

/* A part's `className` is a string, merged with its own module class. Its
   state is styled through the `data-*` attributes Base UI sets. */
describe("Field className", () => {
  it("merges className and RootProps.className on Field with its own class and marks its state", () => {
    const { container } = render(
      <Field disabled className="caller" RootProps={{ className: "root" }}>
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");

    expect(root).toHaveClass("caller", "root", styles["size-medium"]);
    expect(root).toHaveAttribute("data-disabled");
  });

  it("merges a caller's className on the root with its own class and marks its state", () => {
    const { container } = render(
      <FieldRoot disabled className="caller">
        <input />
      </FieldRoot>,
    );
    const root = container.querySelector("[data-slot='field-root']");

    expect(root).toHaveClass("caller", styles["field-root"]);
    expect(root).toHaveAttribute("data-disabled");
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

describe("FieldRow error and description", () => {
  const DESCRIPTION = "Read them first.";
  const describedText = (control: HTMLElement) =>
    (control.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent);
  // Checkbox is a real FieldRow consumer: its control reads the row's item,
  // which a bare FieldControl does not.
  const row = (match: boolean) => (
    <Checkbox
      label="Terms"
      description={DESCRIPTION}
      FieldProps={{ ErrorProps: { match, children: "Accept the terms" } }}
    />
  );

  it("shows the description and describes the control by it while valid", () => {
    render(row(false));

    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
    expect(describedText(screen.getByRole("checkbox"))).toEqual([DESCRIPTION]);
  });

  it("replaces the description with the error while invalid", () => {
    const { container } = render(row(true));

    expect(
      container.querySelector("[data-slot='field-description']"),
    ).not.toBeInTheDocument();
    expect(describedText(screen.getByRole("checkbox"))).toEqual([
      "Accept the terms",
    ]);
  });

  it("brings the description back once the error clears", async () => {
    const { rerender } = render(row(true));
    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument();

    rerender(row(false));

    await waitFor(() =>
      expect(screen.getByText(DESCRIPTION)).toBeInTheDocument(),
    );
    expect(screen.queryByText("Accept the terms")).not.toBeInTheDocument();
    expect(describedText(screen.getByRole("checkbox"))).toEqual([DESCRIPTION]);
  });

  it("keeps the description when match is forced with no message", () => {
    render(
      <Checkbox
        label="Terms"
        description={DESCRIPTION}
        FieldProps={{ ErrorProps: { match: true, children: undefined } }}
      />,
    );

    expect(describedText(screen.getByRole("checkbox"))).toEqual([DESCRIPTION]);
  });

  it("stacks the error under a label that has no description", () => {
    const { container } = render(
      <Checkbox
        label="Terms"
        FieldProps={{ ErrorProps: { match: true, children: "Required" } }}
      />,
    );
    const label = container.querySelector("[data-slot='field-label']");

    expect(label?.parentElement).not.toHaveAttribute("data-slot", "field-row");
    expect(label?.nextElementSibling).toHaveAttribute(
      "data-slot",
      "field-error",
    );
  });

  it("hides the description in server markup that already holds the error", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToString(
      <Checkbox
        label="Terms"
        description={DESCRIPTION}
        FieldProps={{
          ErrorProps: { match: true, children: "Accept the terms" },
        }}
      />,
    );
    document.body.append(host);

    const description = host.querySelector("[data-slot='field-description']");
    expect(host.querySelector("[data-slot='field-error']")).toBeInTheDocument();
    expect(getComputedStyle(description as Element).display).toBe("none");
    host.remove();
  });

  it("forwards a ref to the error element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <FieldRow
        label="Terms"
        ErrorProps={{ match: true, children: "Required", ref }}
      >
        <FieldControl />
      </FieldRow>,
    );

    expect(ref.current).toHaveAttribute("data-slot", "field-error");
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

describe("FieldDescription emphasis", () => {
  it("defaults to muted emphasis", () => {
    render(
      <FieldRoot>
        <FieldDescription>Help</FieldDescription>
      </FieldRoot>,
    );
    const el = screen.getByText("Help");
    expect(el).toHaveAttribute("data-ui-emphasis", "muted");
    expect(el).not.toHaveAttribute("data-ui-shade");
  });

  it("drops the muted default when a color is set", () => {
    render(
      <FieldRoot>
        <FieldDescription color="red">Help</FieldDescription>
      </FieldRoot>,
    );
    const el = screen.getByText("Help");
    expect(el).toHaveAttribute("data-ui-color", "red");
    expect(el).not.toHaveAttribute("data-ui-emphasis");
  });

  it("takes a caller's emphasis", () => {
    render(
      <FieldRoot>
        <FieldDescription emphasis="default">Help</FieldDescription>
      </FieldRoot>,
    );
    expect(screen.getByText("Help")).toHaveAttribute(
      "data-ui-emphasis",
      "default",
    );
  });
});

describe("Field wiring", () => {
  it("labels the control it wraps, with a string or a node label", () => {
    render(
      <>
        <Field label="Email">
          <FieldControl />
        </Field>
        <Field label={<span>Phone</span>}>
          <FieldControl />
        </Field>
      </>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "data-slot",
      "field-control",
    );
    expect(screen.getByLabelText("Phone")).toHaveAttribute(
      "data-slot",
      "field-control",
    );
  });

  it("describes the control it wraps", () => {
    render(
      <Field label="Email" description="We'll never share your email.">
        <FieldControl />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
      "We'll never share your email.",
    );
  });

  it("disables an InputControl it wraps and hands it the field's name", () => {
    render(
      <Field label="Email" name="email" disabled>
        <InputControl />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
  });

  it("leaves a root nested in a required field unrequired", () => {
    render(
      <Field label="Address" required>
        <FieldControl />
        <FieldRoot>
          <FieldLabel>Line 2</FieldLabel>
          <FieldControl />
        </FieldRoot>
      </Field>,
    );
    expect(screen.getByLabelText("Address")).toBeRequired();
    expect(screen.getByLabelText("Line 2")).not.toBeRequired();
  });

  it("keeps the label's required in step with the field's", () => {
    render(
      <Field
        label="Email"
        // @ts-expect-error `required` belongs to Field, not its label
        LabelProps={{ required: true }}
      >
        <FieldControl />
      </Field>,
    );
    expect(screen.getByText("Email")).not.toHaveAttribute("data-required");
  });

  it("lets DescriptionProps override the description's muted emphasis", () => {
    render(
      <Field description="Help" DescriptionProps={{ emphasis: "default" }}>
        <FieldControl />
      </Field>,
    );
    expect(screen.getByText("Help")).toHaveAttribute(
      "data-ui-emphasis",
      "default",
    );
  });
});

describe("Field validation", () => {
  it("shows the validate message inline once the value fails", async () => {
    const user = userEvent.setup();
    render(
      <Field
        label="Username"
        validationMode="onChange"
        validate={(value) => (value === "admin" ? "That name is taken" : null)}
      >
        <FieldControl />
      </Field>,
    );
    expect(screen.queryByText("That name is taken")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Username"), "admin");

    expect(screen.getByText("That name is taken")).toHaveAttribute(
      "data-slot",
      "field-error",
    );
    expect(screen.getByLabelText("Username")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows an externally driven error through invalid and match", () => {
    render(
      <Field
        label="Email"
        invalid
        ErrorProps={{ match: true, children: "Email is required" }}
      >
        <FieldControl />
      </Field>,
    );
    expect(screen.getByText("Email is required")).toHaveAttribute(
      "data-slot",
      "field-error",
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("Field RootProps precedence", () => {
  const root = (container: HTMLElement) =>
    container.querySelector("[data-slot='field-root']");

  it("lets a top-level prop win over the same key in RootProps", () => {
    const { container } = render(
      <Field disabled={false} RootProps={{ disabled: true }}>
        <input />
      </Field>,
    );
    expect(root(container)).not.toHaveAttribute("data-disabled");
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    const { container } = render(
      <Field RootProps={{ disabled: true }}>
        <input />
      </Field>,
    );
    expect(root(container)).toHaveAttribute("data-disabled");
  });

  it("keeps a RootProps value when the top level passes undefined", () => {
    const { container } = render(
      <Field disabled={undefined} RootProps={{ disabled: true }}>
        <input />
      </Field>,
    );
    expect(root(container)).toHaveAttribute("data-disabled");
  });
});
