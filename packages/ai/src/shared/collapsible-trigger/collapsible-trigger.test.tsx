import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollapsiblePanel, CollapsibleRoot } from "@uiid/interactive";
import { describe, expect, it, vi } from "vitest";

import { CollapsibleTrigger } from "./collapsible-trigger";
import type { CollapsibleTriggerProps } from "./collapsible-trigger.types";

import styles from "./collapsible-trigger.module.css";

const renderTrigger = (props: Partial<CollapsibleTriggerProps> = {}) =>
  render(
    <CollapsibleRoot>
      <CollapsibleTrigger {...props}>Details</CollapsibleTrigger>
      <CollapsiblePanel data-testid="panel">Body</CollapsiblePanel>
    </CollapsibleRoot>,
  );

describe("CollapsibleTrigger", () => {
  it("is a Group that Base UI turns into a button, named by its children", () => {
    renderTrigger();

    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
    expect(trigger).toHaveAttribute("tabindex", "0");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-ui-gap", "2");
    expect(trigger).toHaveAttribute("data-ui-ay", "center");
  });

  it("ends with a chevron after the caller's content", () => {
    renderTrigger();

    const chevron = screen.getByRole("button").lastElementChild;
    expect(chevron).toHaveClass(styles["chevron"]!);
    expect(chevron).toHaveAttribute("aria-hidden", "true");
  });

  it("opens the panel on click and marks itself data-panel-open", async () => {
    const user = userEvent.setup();
    renderTrigger();
    expect(screen.queryByTestId("panel")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-panel-open");
    expect(screen.getByTestId("panel")).toHaveTextContent("Body");
  });

  it("opens from the keyboard", async () => {
    const user = userEvent.setup();
    renderTrigger();

    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("lets a caller's slot, className, layout and handlers reach the row", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderTrigger({
      "data-slot": "tool-trigger",
      className: "custom",
      w: "full",
      gap: 4,
      onClick,
    } as Partial<CollapsibleTriggerProps>);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("data-slot", "tool-trigger");
    expect(trigger).toHaveClass("custom", styles["trigger"]!);
    expect(trigger).toHaveAttribute("data-ui-w", "full");
    expect(trigger).toHaveAttribute("data-ui-gap", "4");

    await user.click(trigger);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
