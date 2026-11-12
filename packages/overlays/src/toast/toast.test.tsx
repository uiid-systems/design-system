import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import {
  ToastContent,
  ToastPortal,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from "./subcomponents";
import { Toaster } from "./toast";
import { createToastManager, useToastManager } from "./toast.hooks";
import type { ToastProviderProps, ToasterProps } from "./toast.types";

import styles from "./toast.module.css";

type Manager = ReturnType<typeof useToastManager>;

/** Captures the manager so a test can drive toasts without a trigger button. */
const renderToaster = (
  props: ToasterProps = {},
  providerProps: Omit<ToastProviderProps, "children"> = {},
) => {
  let manager!: Manager;
  const Capture = () => {
    manager = useToastManager();
    return null;
  };
  const result = render(
    <ToastProvider {...providerProps}>
      <Capture />
      <Toaster {...props} />
    </ToastProvider>,
  );
  return { ...result, manager: () => manager };
};

const toastEl = () => document.querySelector('[data-slot="toast"]');
const surface = () =>
  toastEl()?.querySelector(':scope > [data-slot="card-container"]');
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

  it("forwards ViewportProps to the viewport", () => {
    renderToaster({ ViewportProps: { className: "custom-viewport" } });
    expect(viewport()).toHaveClass(
      styles["toast-viewport"]!,
      "custom-viewport",
    );
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

  it("renders a zero title and description", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: 0, description: 0 });
    });

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="toast-title"]'),
      ).toHaveTextContent("0");
    });
    expect(
      document.querySelector('[data-slot="toast-description"]'),
    ).toHaveTextContent("0");
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

  const icon = () => document.querySelector('[data-slot="toast-icon"]');

  it.each([
    { type: "success", svg: ".lucide-circle-check" },
    { type: "error", svg: ".lucide-circle-alert" },
    { type: "warning", svg: ".lucide-triangle-alert" },
    { type: "info", svg: ".lucide-info" },
    { type: "loading", svg: '[data-animate="spin"]' },
  ])(
    "shows the $type icon, hidden from assistive tech",
    async ({ type, svg }) => {
      const { manager } = renderToaster();
      act(() => {
        manager().add({ title: "Status", type });
      });

      await screen.findByText("Status");
      expect(icon()).toHaveAttribute("aria-hidden", "true");
      expect(icon()?.querySelectorAll("svg")).toHaveLength(1);
      expect(icon()?.querySelector(svg)).toBeInTheDocument();
    },
  );

  it.each([undefined, "custom"])("shows no icon for type %s", async (type) => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Plain", type });
    });

    await screen.findByText("Plain");
    expect(icon()).not.toBeInTheDocument();
  });

  it("swaps the icon when update() changes the type", async () => {
    const { manager } = renderToaster();
    let id = "";
    act(() => {
      id = manager().add({ title: "Syncing", type: "loading" });
    });

    await screen.findByText("Syncing");
    expect(icon()?.querySelector('[data-animate="spin"]')).toBeInTheDocument();

    act(() => {
      manager().update(id, { title: "Synced", type: "success" });
    });

    await screen.findByText("Synced");
    expect(icon()?.querySelector('[data-animate="spin"]')).toBeNull();
    expect(icon()?.querySelector(".lucide-circle-check")).toBeInTheDocument();
  });

  // ============================================
  // SURFACE
  // ============================================

  it("renders the surface as a Card inside the root", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Saved" });
    });

    await screen.findByText("Saved");
    expect(toastEl()).toHaveClass(styles["toast"]!);
    expect(surface()).toHaveClass(styles["toast-surface"]!, "palette-neutral");
    expect(surface()).toContainElement(
      document.querySelector('[data-slot="toast-content"]') as HTMLElement,
    );
  });

  it.each([
    ["success", "palette-green"],
    ["error", "palette-red"],
    ["warning", "palette-yellow"],
    ["info", "palette-blue"],
    ["loading", "palette-neutral"],
    [undefined, "palette-neutral"],
  ])("colors a %s toast's surface %s", async (type, hue) => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Hello", type });
    });

    await screen.findByText("Hello");
    expect(surface()).toHaveClass(hue);
    expect(toastEl()).not.toHaveClass(hue);
  });

  it("lets data.color override the type's hue", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({
        title: "Failed",
        type: "error",
        data: { color: "orange" },
      });
    });

    await screen.findByText("Failed");
    expect(surface()).toHaveClass("palette-orange");
    expect(surface()).not.toHaveClass("palette-red");
  });

  it("recolors the surface when update() changes the type", async () => {
    const { manager } = renderToaster();
    let id = "";
    act(() => {
      id = manager().add({ title: "Syncing", type: "loading" });
    });
    await screen.findByText("Syncing");
    expect(surface()).toHaveClass("palette-neutral");

    act(() => {
      manager().update(id, { title: "Synced", type: "success" });
    });
    await screen.findByText("Synced");
    expect(surface()).toHaveClass("palette-green");
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

  it("renders the close button as an icon-only ghost Button", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Saved" });
    });

    await screen.findByText("Saved");
    const close = closeButtons()[0]!;
    expect(close.tagName).toBe("BUTTON");
    expect(close).toHaveAttribute("type", "button");
    expect(close).toHaveAttribute("aria-label", "Close");
    expect(close).toHaveClass(styles["toast-close"]!);
    expect(close.querySelector("svg")).toBeInTheDocument();
  });

  it("hides the close button on a loading toast", async () => {
    const { manager } = renderToaster();
    act(() => {
      manager().add({ title: "Syncing", type: "loading" });
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
  // SWIPE
  // ============================================

  const swipe = (element: Element, dy: number) => {
    fireEvent.pointerDown(element, { button: 0, pointerId: 1, clientY: 0 });
    for (let step = 1; step <= 5; step++) {
      fireEvent.pointerMove(element, {
        pointerId: 1,
        clientY: (dy * step) / 5,
        movementY: dy / 5,
      });
    }
    fireEvent.pointerUp(element, { pointerId: 1, clientY: dy });
  };

  it.each([
    { position: "top", toward: -100, away: 100 },
    { position: "bottom", toward: 100, away: -100 },
  ] as const)(
    "swipes a $position toast away toward its edge, not into the page",
    async ({ position, toward, away }) => {
      const { manager } = renderToaster({ position });
      act(() => {
        manager().add({ title: "Saved" });
      });

      await screen.findByText("Saved");
      swipe(toastEl()!, away);
      await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
      expect(manager().toasts).toHaveLength(1);

      swipe(toastEl()!, toward);
      await waitFor(() => {
        expect(manager().toasts).toHaveLength(0);
      });
    },
  );

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

    const action = await screen.findByRole("button", { name: "Undo" });
    expect(action).toHaveAttribute("data-slot", "toast-action");
    await user.click(action);
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

  it("keeps a loading toast open, then times it out once it settles", async () => {
    const { manager } = renderToaster({}, { timeout: 50 });
    let id = "";
    act(() => {
      id = manager().add({ title: "Syncing", type: "loading" });
    });

    await screen.findByText("Syncing");
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    expect(manager().toasts).toHaveLength(1);

    act(() => {
      manager().update(id, { title: "Synced", type: "success" });
    });
    await waitFor(() => {
      expect(manager().toasts).toHaveLength(0);
    });
  });

  it("settles a promise() toast from loading to success", async () => {
    const { manager } = renderToaster();
    let resolve!: (value: string) => void;
    act(() => {
      void manager().promise(
        new Promise<string>((r) => {
          resolve = r;
        }),
        { loading: "Uploading…", success: "Uploaded", error: "Upload failed" },
      );
    });

    await screen.findByText("Uploading…");
    expect(toastEl()).toHaveAttribute("data-type", "loading");
    expect(closeButtons()).toHaveLength(0);

    await act(async () => {
      resolve("done");
    });

    await screen.findByText("Uploaded");
    expect(toastEl()).toHaveAttribute("data-type", "success");
    expect(closeButtons()).toHaveLength(1);
  });

  it("adds, updates and closes toasts from a manager made outside React", async () => {
    const toastManager = createToastManager();
    renderToaster({}, { toastManager });

    let id = "";
    act(() => {
      id = toastManager.add({ title: "Saved", timeout: 0 });
    });
    await screen.findByText("Saved");

    act(() => {
      toastManager.update(id, { title: "Saved twice" });
    });
    await screen.findByText("Saved twice");

    act(() => {
      toastManager.close(id);
    });
    await waitFor(() => {
      expect(toastEl()).not.toBeInTheDocument();
    });
  });
});

describe("ToastRoot", () => {
  /** A custom layout: the parts, without Toaster's type map. */
  const CustomList = () => {
    const { toasts } = useToastManager();
    return toasts.map((toast) => (
      <ToastRoot
        key={toast.id}
        toast={toast}
        color="purple"
        className="custom-root"
      >
        <ToastContent>
          <ToastTitle />
        </ToastContent>
      </ToastRoot>
    ));
  };

  const renderCustom = () => {
    let manager!: Manager;
    const Capture = () => {
      manager = useToastManager();
      return null;
    };
    render(
      <ToastProvider>
        <Capture />
        <ToastPortal>
          <ToastViewport>
            <CustomList />
          </ToastViewport>
        </ToastPortal>
      </ToastProvider>,
    );
    return () => manager;
  };

  it("puts className on the positioned root and color on the surface", async () => {
    const manager = renderCustom();
    act(() => {
      manager().add({ title: "Custom", type: "error" });
    });

    await screen.findByText("Custom");
    expect(toastEl()).toHaveClass(styles["toast"]!, "custom-root");
    expect(toastEl()).not.toHaveClass("palette-purple");
    expect(surface()).toHaveClass(styles["toast-surface"]!, "palette-purple");
    expect(surface()).not.toHaveClass("custom-root");
  });

  it("leaves the type's icon and hue to Toaster", async () => {
    const manager = renderCustom();
    act(() => {
      manager().add({ title: "Custom", type: "error" });
    });

    await screen.findByText("Custom");
    expect(surface()).not.toHaveClass("palette-red");
    expect(
      document.querySelector('[data-slot="toast-icon"]'),
    ).not.toBeInTheDocument();
  });
});
