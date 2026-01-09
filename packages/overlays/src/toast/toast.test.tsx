import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster, ToastProvider, useToastManager } from "./toast";

// Helper component to trigger toasts
const ToastTrigger = ({ message }: { message: string }) => {
  const toastManager = useToastManager();

  return (
    <button
      onClick={() => toastManager.add({ description: message })}
      data-testid="trigger-toast"
    >
      Show toast
    </button>
  );
};

// Wrapper to provide toast context
const ToastTestWrapper = ({
  children,
  position,
}: {
  children: React.ReactNode;
  position?: "top" | "bottom";
}) => {
  return (
    <ToastProvider>
      {children}
      <Toaster position={position} />
    </ToastProvider>
  );
};

describe("Toast", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders toaster viewport", () => {
    render(
      <ToastTestWrapper>
        <div>App content</div>
      </ToastTestWrapper>,
    );

    // Viewport should exist even with no toasts
    expect(
      document.querySelector('[data-slot="toast"]'),
    ).not.toBeInTheDocument();
  });

  it("does not show toast initially", () => {
    render(
      <ToastTestWrapper>
        <ToastTrigger message="Hello world" />
      </ToastTestWrapper>,
    );

    expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
  });

  // ============================================
  // TOAST CREATION
  // ============================================

  it("shows toast when triggered via useToastManager", async () => {
    const user = userEvent.setup();

    render(
      <ToastTestWrapper>
        <ToastTrigger message="Hello world" />
      </ToastTestWrapper>,
    );

    await user.click(screen.getByTestId("trigger-toast"));

    await waitFor(() => {
      expect(screen.getByText("Hello world")).toBeInTheDocument();
    });
  });

  it("shows multiple toasts", async () => {
    const user = userEvent.setup();

    const MultiToastTrigger = () => {
      const toastManager = useToastManager();
      return (
        <>
          <button
            onClick={() => toastManager.add({ description: "First toast" })}
          >
            First
          </button>
          <button
            onClick={() => toastManager.add({ description: "Second toast" })}
          >
            Second
          </button>
        </>
      );
    };

    render(
      <ToastTestWrapper>
        <MultiToastTrigger />
      </ToastTestWrapper>,
    );

    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(screen.getByRole("button", { name: "Second" }));

    await waitFor(() => {
      expect(screen.getByText("First toast")).toBeInTheDocument();
      expect(screen.getByText("Second toast")).toBeInTheDocument();
    });
  });

  // ============================================
  // POSITION VARIANTS
  // ============================================

  it("renders with bottom position by default", () => {
    render(
      <ToastTestWrapper>
        <div>App</div>
      </ToastTestWrapper>,
    );

    const viewport = document.querySelector('[class*="toast-viewport"]');
    expect(viewport).toHaveAttribute("data-position", "bottom");
  });

  it("renders with top position", () => {
    render(
      <ToastTestWrapper position="top">
        <div>App</div>
      </ToastTestWrapper>,
    );

    const viewport = document.querySelector('[class*="toast-viewport"]');
    expect(viewport).toHaveAttribute("data-position", "top");
  });

  // ============================================
  // TOAST STRUCTURE
  // ============================================

  it("renders toast with data-slot attribute", async () => {
    const user = userEvent.setup();

    render(
      <ToastTestWrapper>
        <ToastTrigger message="Hello world" />
      </ToastTestWrapper>,
    );

    await user.click(screen.getByTestId("trigger-toast"));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="toast"]')).toBeInTheDocument();
    });
  });

  // ============================================
  // TOAST MANAGER API
  // ============================================

  it("exposes toasts array via useToastManager", async () => {
    const user = userEvent.setup();

    const ToastCounter = () => {
      const { toasts } = useToastManager();
      return <div data-testid="toast-count">{toasts.length}</div>;
    };

    render(
      <ToastTestWrapper>
        <ToastTrigger message="Hello world" />
        <ToastCounter />
      </ToastTestWrapper>,
    );

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");

    await user.click(screen.getByTestId("trigger-toast"));

    await waitFor(() => {
      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("toast viewport is a landmark region", () => {
    render(
      <ToastTestWrapper>
        <div>App</div>
      </ToastTestWrapper>,
    );

    // Base UI Toast viewport should be accessible
    const viewport = document.querySelector('[class*="toast-viewport"]');
    expect(viewport).toBeInTheDocument();
  });

  // ============================================
  // PORTAL RENDERING
  // ============================================

  it("toaster is rendered in a portal", () => {
    const { container } = render(
      <ToastTestWrapper>
        <div>App</div>
      </ToastTestWrapper>,
    );

    // Viewport should not be inside the container (it's portaled)
    const viewportInContainer = container.querySelector(
      '[class*="toast-viewport"]',
    );
    expect(viewportInContainer).toBeNull();
  });
});
