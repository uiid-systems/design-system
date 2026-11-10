import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, onTestFinished, vi } from "vitest";

import type { ToolState } from "../ai.types";
import { Tool } from "./tool";
import { TOOL_STATES } from "./tool.constants";
import * as Examples from "./tool.examples";
import type { ToolPart } from "./tool.types";

import styles from "./tool.module.css";

const part = (overrides: Partial<ToolPart> = {}): ToolPart => ({
  type: "tool-search",
  state: "output-available",
  input: { q: "weather" },
  output: { temperature: 21 },
  ...overrides,
});

/* `JSON.stringify` rethrows from `toJSON`; with no prototype, `String` then
   throws too, for want of a `toString`. */
const throwing = (proto: object | null) =>
  Object.assign(Object.create(proto) as Record<string, unknown>, {
    toJSON() {
      throw new Error("no");
    },
  });

const LABELS = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting approval",
  "approval-responded": "Responded",
  "output-available": "Done",
  "output-error": "Failed",
  "output-denied": "Skipped",
} satisfies Record<ToolState, string>;

const getRoot = () => document.querySelector<HTMLElement>("[data-slot='tool']");
const getStatus = () =>
  document.querySelector<HTMLElement>("[data-slot='tool-status']");
const getInput = () =>
  document.querySelector<HTMLElement>("[data-slot='tool-input']");
const getOutput = () =>
  document.querySelector<HTMLElement>("[data-slot='tool-output']");

describe("Tool", () => {
  // ============================================
  // ROOT
  // ============================================

  it("renders a bordered full-width root with the slot and the part's state", () => {
    render(<Tool part={part()} />);

    const root = getRoot()!;
    expect(root).toHaveAttribute("data-state", "output-available");
    expect(root).toHaveAttribute("data-ui-fullwidth");
    expect(root).toHaveAttribute("data-ui-b", "1");
    // Stretch, so a wide input scrolls inside the panel instead of widening it.
    expect(root).toHaveAttribute("data-ui-ay", "stretch");
    expect(root).toHaveClass(styles["tool"]);
  });

  it("lets a caller's b, className and ref reach the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Tool part={part()} b={2} className="custom" ref={ref} />);

    const root = getRoot()!;
    expect(root).toHaveAttribute("data-ui-b", "2");
    expect(root).toHaveClass("custom");
    expect(root).toHaveClass(styles["tool"]);
    expect(ref.current).toBe(root);
  });

  // ============================================
  // HEADER
  // ============================================

  it.each([
    ["a static part's type without its prefix", part(), "search"],
    [
      "a dynamic part's toolName",
      part({ type: "dynamic-tool", toolName: "lookup" }),
      "lookup",
    ],
    [
      "a title over both",
      part({ type: "dynamic-tool", toolName: "lookup", title: "Lookup" }),
      "Lookup",
    ],
  ])("names the tool from %s", (_, value, name) => {
    render(<Tool part={value} />);
    expect(screen.getByRole("button")).toHaveTextContent(name);
  });

  it.each(
    (Object.keys(TOOL_STATES) as ToolState[]).map((state) => [
      state,
      LABELS[state],
    ]),
  )("labels the %s state %s and colors it", (state, label) => {
    render(<Tool part={part({ state })} />);

    const status = getStatus()!;
    expect(status).toHaveTextContent(label);
    expect(status).toHaveClass(`palette-${TOOL_STATES[state].color}`);
  });

  it("gives every state its own label and hue", () => {
    const entries = Object.values(TOOL_STATES);
    expect(new Set(entries.map((entry) => entry.label)).size).toBe(
      entries.length,
    );
    expect(new Set(entries.map((entry) => entry.color)).size).toBe(
      entries.length,
    );
  });

  // ============================================
  // OPEN STATE
  // ============================================

  it("is closed by default and opens from its trigger", async () => {
    const user = userEvent.setup();
    render(<Tool part={part()} />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Parameters")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Parameters")).toBeInTheDocument();
  });

  it("passes Base UI's open props to the root", () => {
    render(<Tool part={part()} defaultOpen />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  // ============================================
  // BODY
  // ============================================

  it("pads an inner stack, so the panel itself can close to zero height", () => {
    render(<Tool part={part()} ax="start" defaultOpen />);

    const panel = document.querySelector("[data-slot='tool-panel']")!;
    expect(panel).not.toHaveAttribute("data-ui-p");
    // Full width whatever `ax` the root takes.
    expect(panel).toHaveAttribute("data-ui-w", "full");
    expect(panel.firstElementChild).toHaveAttribute("data-slot", "tool-body");
    expect(panel.firstElementChild).toHaveAttribute("data-ui-p", "4");
    expect(panel.firstElementChild).toContainElement(getInput());
  });

  it("marks a disabled trigger, which keeps the card closed", async () => {
    const user = userEvent.setup();
    render(<Tool part={part()} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("data-disabled");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("pretty-prints the input under a Parameters heading", () => {
    render(<Tool part={part()} defaultOpen />);

    const input = getInput()!;
    expect(input).toHaveTextContent("Parameters");
    expect(input.querySelector("pre")!.textContent).toContain(
      '\n  "q": "weather"\n',
    );
  });

  it("renders a string output as code under a Result heading", () => {
    render(<Tool part={part({ output: "Sunny, 21°C" })} defaultOpen />);

    const output = getOutput()!;
    expect(output).toHaveTextContent("Result");
    expect(output.querySelector("pre")).toHaveTextContent("Sunny, 21°C");
  });

  it("pretty-prints an object output", () => {
    render(<Tool part={part()} defaultOpen />);

    expect(getOutput()!.querySelector("pre")!.textContent).toContain(
      '\n  "temperature": 21\n',
    );
  });

  it("prints a BigInt as its digits and keeps the fields around it", () => {
    const value = { id: 10n, name: "acct", rows: [1n, 2] };
    render(<Tool part={part({ input: value, output: 10n })} defaultOpen />);

    expect(getInput()!.querySelector("pre")!.textContent).toBe(
      JSON.stringify({ id: "10", name: "acct", rows: ["1", 2] }, null, 2),
    );
    expect(getOutput()!.querySelector("pre")!.textContent).toBe('"10"');
  });

  it("marks a cycle and keeps the fields around it, printing a shared value twice", () => {
    const shared = { unit: "celsius" };
    const value: Record<string, unknown> = {
      name: "acct",
      a: shared,
      b: shared,
      list: [] as unknown[],
    };
    value.self = value;
    (value.list as unknown[]).push({ parent: value });
    render(<Tool part={part({ input: value })} defaultOpen />);

    expect(JSON.parse(getInput()!.querySelector("pre")!.textContent)).toEqual({
      name: "acct",
      a: shared,
      b: shared,
      list: [{ parent: "[Circular]" }],
      self: "[Circular]",
    });
  });

  it.each([
    ["a function", function lookup() {}, "function lookup() {}"],
    [
      "an object whose toJSON throws",
      throwing(Object.prototype),
      "[object Object]",
    ],
    ["one with no prototype besides", throwing(null), "[object Object]"],
  ])(
    "falls back to a string for %s, which JSON cannot hold",
    (_, value, text) => {
      render(<Tool part={part({ input: value, output: value })} defaultOpen />);

      expect(getInput()!.querySelector("pre")!.textContent).toBe(text);
      expect(getOutput()!.querySelector("pre")!.textContent).toBe(text);
    },
  );

  it("puts each code block in the tab order, so a long line scrolls from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Tool part={part()} defaultOpen />);

    const [input, output] = document.querySelectorAll("pre");
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
    await user.tab();
    expect(output).toHaveFocus();
  });

  it("builds the JSON only while the panel is open, and once per input and output", async () => {
    const user = userEvent.setup();
    const stringify = vi.spyOn(JSON, "stringify");
    onTestFinished(() => stringify.mockRestore());
    // Other code stringifies too, so count the calls on this part's values.
    const built = (target: unknown) =>
      stringify.mock.calls.filter(([arg]) => arg === target).length;
    const value = part();
    const { rerender } = render(<Tool part={value} />);
    expect(built(value.input)).toBe(0);
    expect(built(value.output)).toBe(0);

    await user.click(screen.getByRole("button"));
    expect(built(value.input)).toBe(1);
    expect(built(value.output)).toBe(1);

    // A new part object around the same input and output, as a stream sends.
    rerender(<Tool part={{ ...value, title: "Search" }} />);
    expect(built(value.input)).toBe(1);
    expect(built(value.output)).toBe(1);

    const next = { temperature: 22 };
    rerender(<Tool part={{ ...value, output: next }} />);
    expect(built(value.input)).toBe(1);
    expect(built(next)).toBe(1);
  });

  it("renders an element output as itself", () => {
    render(
      <Tool
        part={part({ output: <div data-testid="weather-card">21°C</div> })}
        defaultOpen
      />,
    );

    expect(screen.getByTestId("weather-card")).toBeInTheDocument();
    expect(getOutput()!.querySelector("pre")).not.toBeInTheDocument();
  });

  it("renders error text under an Error heading, with or without output", () => {
    render(
      <Tool
        part={part({
          state: "output-error",
          output: undefined,
          errorText: "Rate limited",
        })}
        defaultOpen
      />,
    );

    const output = getOutput()!;
    expect(output).toHaveTextContent("Error");
    expect(output).not.toHaveTextContent("Result");
    expect(screen.getByText("Rate limited")).toHaveClass("palette-red");
  });

  it("omits the output section with neither output nor error", () => {
    render(
      <Tool
        part={part({ state: "input-available", output: undefined })}
        defaultOpen
      />,
    );

    expect(getInput()).toBeInTheDocument();
    expect(getOutput()).not.toBeInTheDocument();
  });

  it("omits the input section without input", () => {
    render(<Tool part={part({ input: undefined })} defaultOpen />);

    expect(getInput()).not.toBeInTheDocument();
    expect(getOutput()).toBeInTheDocument();
  });

  it("lets children replace the body", () => {
    render(
      <Tool part={part()} defaultOpen>
        <div data-testid="custom-body">custom</div>
      </Tool>,
    );

    expect(screen.getByTestId("custom-body")).toBeInTheDocument();
    expect(getInput()).not.toBeInTheDocument();
    expect(getOutput()).not.toBeInTheDocument();
  });

  it.each([
    ["false", false],
    ["null", null],
    ["an empty string", ""],
    ["a list of false conditions", [false, null, undefined]],
    ["an empty fragment", <></>],
    [
      "a fragment of false conditions",
      <>
        {false}
        <>{null}</>
      </>,
    ],
  ])("keeps the default body when children are %s", (_, children) => {
    render(
      <Tool part={part()} defaultOpen>
        {children}
      </Tool>,
    );

    expect(getInput()).toBeInTheDocument();
    expect(getOutput()).toBeInTheDocument();
  });

  it("lets a zero or a component that renders nothing replace the body", () => {
    const Nothing = () => null;
    const { rerender } = render(
      <Tool part={part()} defaultOpen>
        {0}
      </Tool>,
    );
    expect(getInput()).not.toBeInTheDocument();

    rerender(
      <Tool part={part()} defaultOpen>
        <Nothing />
      </Tool>,
    );
    expect(getInput()).not.toBeInTheDocument();
  });
});

describe("examples", () => {
  it("renders one card per state", () => {
    render(<Examples.States />);

    const labels = Object.values(TOOL_STATES).map((state) => state.label);
    const statuses = document.querySelectorAll("[data-slot='tool-status']");
    expect(Array.from(statuses, (el) => el.textContent)).toEqual(labels);
  });

  it("renders a long name, URL and error in a narrow card", () => {
    render(<Examples.LongContent />);

    // The wrapping itself is CSS; these are the hooks it hangs on.
    const trigger = screen.getByRole("button");
    expect(trigger.querySelector(`.${styles["name"]}`)).toHaveTextContent(
      "fetch_customer_subscription_invoice_history_by_account_identifier",
    );
    expect(getStatus()).toHaveClass(styles["status"]);
    expect(screen.getByText(/returned 429/)).toHaveClass(styles["error"]);
    expect(getRoot()!.parentElement).toHaveAttribute("data-ui-w", "320");
  });

  it("renders a tool call between the reasoning and the reply", () => {
    render(<Examples.InMessage />);

    expect(
      screen.getByRole("button", { name: /Thought for/ }),
    ).toBeInTheDocument();
    expect(getStatus()).toHaveTextContent("Done");
    expect(
      document.querySelector("[data-slot='message-response']"),
    ).not.toBeNull();
  });
});
