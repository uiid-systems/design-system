import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Resizable } from "./resizable";
import type { ResizableHandleProps } from "./resizable.types";
import { ResizableHandle, ResizablePanel } from "./subcomponents";

import styles from "./resizable.module.css";
import css from "./resizable.module.css?raw";

const renderResizable = (handleProps?: ResizableHandleProps) =>
  render(
    <Resizable direction="horizontal">
      <ResizablePanel defaultSize="50%">One</ResizablePanel>
      <ResizableHandle {...handleProps} />
      <ResizablePanel defaultSize="50%">Two</ResizablePanel>
    </Resizable>,
  );

const getHandle = () => screen.getByRole("separator");

/* The selector of the rule that paints a hovered or dragged handle, with the
   module's local class swapped for the one the test DOM renders. The regex
   reads this rule from `resizable.module.css`, capturing its second arm:

     .resizable-handle:hover,
     .resizable-handle[data-separator]:not(…) {
       background-color: var(--shade-accent);
     }

   If that rule is reformatted, reordered or repainted, update the regex. */
const getActiveSelector = () => {
  const selector = css.match(
    /\.resizable-handle:hover,\s*([^{]+?)\s*\{\s*background-color: var\(--shade-accent\)/,
  )?.[1];
  if (!selector) throw new Error("Active handle rule not found");
  /* `composes` appends the global class, so the local one is the first. */
  const [local] = styles["resizable-handle"].split(" ");
  return selector.replaceAll(".resizable-handle", `.${local}`);
};

describe("Resizable", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders with data-slot attributes", () => {
    renderResizable();
    expect(
      document.querySelector("[data-slot='resizable']"),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll("[data-slot='resizable-panel']"),
    ).toHaveLength(2);
    expect(getHandle()).toHaveAttribute("data-slot", "resizable-handle");
  });

  it("writes the direction to the root", () => {
    renderResizable();
    expect(document.querySelector("[data-slot='resizable']")).toHaveAttribute(
      "data-direction",
      "horizontal",
    );
    expect(getHandle()).toHaveAttribute("aria-orientation", "vertical");
  });

  it("renders the grip unless withHandle is false", () => {
    const { unmount } = renderResizable();
    expect(getHandle().querySelector("svg")).toBeInTheDocument();
    unmount();

    renderResizable({ withHandle: false });
    expect(getHandle().querySelector("svg")).not.toBeInTheDocument();
  });

  // ============================================
  // DISABLED
  // ============================================

  it("leaves an enabled handle focusable and not disabled", () => {
    renderResizable();
    const handle = getHandle();
    expect(handle).not.toHaveAttribute("aria-disabled");
    expect(handle).not.toHaveAttribute("data-separator", "disabled");
    expect(handle).toHaveAttribute("tabindex", "0");
  });

  it("forwards disabled to the separator", () => {
    renderResizable({ disabled: true });
    const handle = getHandle();
    expect(handle).toHaveAttribute("aria-disabled", "true");
    expect(handle).toHaveAttribute("data-separator", "disabled");
    expect(handle).not.toHaveAttribute("data-disabled");
  });

  it("takes a disabled handle out of the tab order", async () => {
    const user = userEvent.setup();
    renderResizable({ disabled: true });
    const handle = getHandle();
    expect(handle).not.toHaveAttribute("tabindex");

    await user.tab();
    expect(handle).not.toHaveFocus();
  });

  it("puts an enabled handle in the tab order", async () => {
    const user = userEvent.setup();
    renderResizable();

    await user.tab();
    expect(getHandle()).toHaveFocus();
  });

  // ============================================
  // STYLES
  // ============================================

  it("paints an active handle but not a disabled one", () => {
    const selector = getActiveSelector();

    const { unmount } = renderResizable();
    const enabled = getHandle();
    expect(enabled).toHaveAttribute("data-separator", "inactive");
    expect(enabled.matches(selector)).toBe(false);
    enabled.setAttribute("data-separator", "active");
    expect(enabled.matches(selector)).toBe(true);
    unmount();

    renderResizable({ disabled: true });
    expect(getHandle().matches(selector)).toBe(false);
  });
});
