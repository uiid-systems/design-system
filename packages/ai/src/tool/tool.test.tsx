import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

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

/* `JSON.stringify` throws on the BigInt, then `String` throws for want of a
   `toString`. */
const nullProto = () =>
  Object.assign(Object.create(null) as Record<string, unknown>, { id: 10n });

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

  it.each(Object.keys(TOOL_STATES) as ToolState[])(
    "labels and colors the %s state",
    (state) => {
      render(<Tool part={part({ state })} />);

      const status = getStatus()!;
      expect(status).toHaveTextContent(TOOL_STATES[state].label);
      expect(status).toHaveClass(`palette-${TOOL_STATES[state].color}`);
    },
  );

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

  it.each([
    ["a BigInt", 10n, "10"],
    [
      "a cycle",
      (() => {
        const cycle: Record<string, unknown> = {};
        cycle.self = cycle;
        return cycle;
      })(),
      "[object Object]",
    ],
    ["a function", function lookup() {}, "function lookup() {}"],
    [
      "an object with no prototype holding a BigInt",
      nullProto(),
      "[object Object]",
    ],
  ])(
    "falls back to a string for %s, which JSON cannot hold",
    (_, value, text) => {
      render(<Tool part={part({ input: value, output: value })} defaultOpen />);

      expect(getInput()!.querySelector("pre")).toHaveTextContent(text);
      expect(getOutput()!.querySelector("pre")).toHaveTextContent(text);
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

  it("renders a tool call between the reasoning and the reply", () => {
    render(<Examples.InMessage />);

    expect(
      screen.getByRole("button", { name: /Thought for/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Completed/ }),
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='message-response']"),
    ).not.toBeNull();
  });
});
