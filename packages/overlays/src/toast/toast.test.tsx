import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Toaster } from "./toast";
import { ToastProvider, useToastManager } from "./toast.hooks";
import type { ToasterProps } from "./toast.types";

type Manager = ReturnType<typeof useToastManager>;

/** Captures the manager so a test can drive toasts without a trigger button. */
const renderToaster = (props: ToasterProps = {}) => {
  let manager!: Manager;
  const Capture = () => {
    manager = useToastManager();
    return null;
  };
  const result = render(
    <ToastProvider>
      <Capture />
      <Toaster {...props} />
    </ToastProvider>,
  );
  return { ...result, manager: () => manager };
};

const toastEl = () => document.querySelector('[data-slot="toast"]');
const viewport = () => document.querySelector('[data-slot="toast-viewport"]');

describe("Toaster", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders no toast initially", () => {
    renderToaster();
    expect(toastEl()).not.toBeInTheDocument();
  });

  it("renders the viewport in a portal", () => {
    const { container } = renderToaster();
    expect(viewport()).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toast-viewport"]')).toBeNull();
  });

  it("anchors to the bottom by default", () => {
    renderToaster();
    expect(viewport()).toHaveAttribute("data-position", "bottom");
  });

  it("anchors to the top", () => {
    renderToaster({ position: "top" });
    expect(viewport()).toHaveAttribute("data-position", "top");
  });

  // ============================================
  // CONTENT
  // ============================================

  it("renders the title and description", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Saved", description: "Changes saved." });
    });

    await waitFor(() => {
      expect(screen.getByText("Saved")).toHaveAttribute(
        "data-slot",
        "toast-title",
      );
    });
    expect(screen.getByText("Changes saved.")).toHaveAttribute(
      "data-slot",
      "toast-description",
    );
  });

  it("omits the title when the toast has none", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ description: "Only a description" });
    });

    await screen.findByText("Only a description");
    expect(
      document.querySelector('[data-slot="toast-title"]'),
    ).not.toBeInTheDocument();
  });

  it("labels and describes the toast from its title and description", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Saved", description: "Changes saved." });
    });

    const title = await screen.findByText("Saved");
    const description = screen.getByText("Changes saved.");
    expect(toastEl()).toHaveAttribute("aria-labelledby", title.id);
    expect(toastEl()).toHaveAttribute("aria-describedby", description.id);
  });

  it("renders data.children below the text", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({
        title: "Syncing",
        data: { children: <div data-testid="custom">Custom</div> },
      });
    });

    const custom = await screen.findByTestId("custom");
    expect(custom.closest('[data-slot="toast-content"]')).toBeInTheDocument();
  });

  // ============================================
  // TYPE
  // ============================================

  it("exposes the type as data-type", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Failed", type: "error" });
    });

    await screen.findByText("Failed");
    expect(toastEl()).toHaveAttribute("data-type", "error");
  });

  it("shows a spinner only while loading", async () => {
    const { manager } = renderToaster();
    let id = "";
    act(() => {
      id = manager().add({ title: "Syncing", type: "loading", timeout: 0 });
    });

    await screen.findByText("Syncing");
    expect(
      document.querySelector('[data-slot="toast-spinner"]'),
    ).toBeInTheDocument();

    act(() => {
      manager().update(id, { title: "Synced", type: "success" });
    });

    await screen.findByText("Synced");
    expect(
      document.querySelector('[data-slot="toast-spinner"]'),
    ).not.toBeInTheDocument();
  });

  // ============================================
  // COLOR
  // ============================================

  it("applies data.color to the surface", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Failed", data: { color: "red" } });
    });

    await screen.findByText("Failed");
    expect(toastEl()).toHaveClass("palette-red");
  });

  // ============================================
  // CLOSE
  // ============================================

  /*
   * Base UI hides Close from assistive tech until the viewport is expanded or
   * focused, so a collapsed stack doesn't announce a close button per toast.
   * It has no accessible name while hidden, so these tests find it by slot.
   */
  const closeButtons = () =>
    document.querySelectorAll<HTMLElement>('[data-slot="toast-close"]');

  it("closes from the close button", async () => {
    const user = userEvent.setup();
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Saved" });
    });

    await screen.findByText("Saved");
    await user.click(closeButtons()[0]!);
    await waitFor(() => {
      expect(manager().toasts).toHaveLength(0);
    });
  });

  it("hides the close button on a loading toast", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Syncing", type: "loading", timeout: 0 });
    });

    await screen.findByText("Syncing");
    expect(closeButtons()).toHaveLength(0);
  });

  it("lets data.closable override the default", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Sticky", data: { closable: false } });
      manager().add({
        title: "Cancelable",
        type: "loading",
        timeout: 0,
        data: { closable: true },
      });
    });

    const toastOf = (title: string) =>
      screen.getByText(title).closest('[data-slot="toast"]')!;

    await screen.findByText("Cancelable");
    expect(closeButtons()).toHaveLength(1);
    expect(toastOf("Cancelable")).toContainElement(closeButtons()[0]!);
    expect(
      toastOf("Sticky").querySelector('[data-slot="toast-close"]'),
    ).toBeNull();
  });

  // ============================================
  // ACTION
  // ============================================

  it("renders an action from actionProps", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { manager } = renderToaster();
    act(() => {
      manager().add({
        title: "Deleted",
        actionProps: { children: "Undo", onClick },
      });
    });

    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders no action without actionProps", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Saved" });
    });

    await screen.findByText("Saved");
    expect(
      document.querySelector('[data-slot="toast-action"]'),
    ).not.toBeInTheDocument();
  });

  // ============================================
  // MANAGER
  // ============================================

  it("stacks multiple toasts", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ description: "First" });
      manager().add({ description: "Second" });
    });

    await screen.findByText("Second");
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(2);
  });

  it("updates a toast in place", async () => {
    const { manager } = renderToaster();
    let id = "";
    act(() => {
      id = manager().add({ title: "Step 1 of 3", timeout: 0 });
    });

    await screen.findByText("Step 1 of 3");
    act(() => {
      manager().update(id, { title: "Step 2 of 3" });
    });

    await screen.findByText("Step 2 of 3");
    expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1);
  });
});
