import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Conversation } from "./conversation";
import { useConversation } from "./conversation.context";
import {
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./subcomponents";

/**
 * happy-dom has a ResizeObserver that never fires, since nothing has layout.
 * This fake records what the hook observes and lets a test fire the callback,
 * so the resize path runs through the real hook.
 */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  observed = new Set<Element>();
  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.add(target);
  }

  unobserve(target: Element) {
    this.observed.delete(target);
  }

  disconnect() {
    this.disconnected = true;
  }

  fire() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

type Metrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

/** happy-dom does no layout, so scroll metrics are written by hand. */
const setMetrics = (element: Element, metrics: Metrics) => {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(element, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
};

const scroll = (element: Element, metrics: Metrics) => {
  setMetrics(element, metrics);
  fireEvent.scroll(element);
};

const AT_BOTTOM: Metrics = {
  scrollTop: 700,
  scrollHeight: 1000,
  clientHeight: 300,
};
const SCROLLED_UP: Metrics = {
  scrollTop: 500,
  scrollHeight: 1000,
  clientHeight: 300,
};

const renderConversation = (
  button: React.ReactNode = <ConversationScrollButton />,
) => {
  const result = render(
    <Conversation>
      <ConversationContent>
        <p>first</p>
        <p>last</p>
      </ConversationContent>
      {button}
    </Conversation>,
  );
  const viewport = result.container.querySelector(
    '[data-slot="conversation-viewport"]',
  ) as HTMLElement;
  const scrollTo = vi.spyOn(viewport, "scrollTo").mockImplementation(() => {});
  const observer = FakeResizeObserver.instances.at(-1)!;
  return { ...result, viewport, scrollTo, observer };
};

const scrollButton = () =>
  screen.queryByRole("button", { name: "Scroll to bottom" });

/** Puts the hook in the released state: pinned at the bottom, then scrolled up. */
const release = (viewport: HTMLElement) => {
  scroll(viewport, AT_BOTTOM);
  scroll(viewport, SCROLLED_UP);
};

describe("Conversation", () => {
  beforeEach(() => {
    FakeResizeObserver.instances = [];
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("structure", () => {
    it("renders a log region with the viewport and content slots inside it", () => {
      const { container } = renderConversation();

      const root = container.firstElementChild!;
      expect(root).toHaveAttribute("data-slot", "conversation");
      expect(root).toHaveAttribute("role", "log");
      expect(
        root.querySelector('[data-slot="conversation-viewport"]'),
      ).toBeInTheDocument();
      expect(
        root.querySelector(
          '[data-slot="conversation-viewport"] > [data-slot="conversation-content"]',
        ),
      ).toHaveTextContent("first");
    });

    it("passes Box props through to the root", () => {
      const ref = { current: null as HTMLDivElement | null };
      const { container } = render(
        <Conversation ref={ref} h={320} className="custom" data-testid="c">
          <ConversationContent>x</ConversationContent>
        </Conversation>,
      );

      const root = container.firstElementChild!;
      expect(root).toHaveAttribute("data-ui-h", "320");
      expect(root).toHaveClass("custom");
      expect(root).toHaveAttribute("data-testid", "c");
      expect(ref.current).toBe(root);
    });

    it("observes both the viewport and the content, and disconnects on unmount", () => {
      const { viewport, observer, unmount } = renderConversation();
      const content = viewport.firstElementChild!;

      expect(observer.observed.has(viewport)).toBe(true);
      expect(observer.observed.has(content)).toBe(true);

      unmount();
      expect(observer.disconnected).toBe(true);
    });

    it("starts pinned, with no scroll button", () => {
      renderConversation();

      expect(scrollButton()).not.toBeInTheDocument();
    });
  });

  describe("following content", () => {
    it("scrolls to the bottom instantly when content resizes while pinned", () => {
      const { viewport, scrollTo, observer } = renderConversation();
      setMetrics(viewport, {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 300,
      });

      act(() => observer.fire());

      expect(scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "instant" });
    });

    it("does nothing on resize once the reader has scrolled up", () => {
      const { viewport, scrollTo, observer } = renderConversation();
      release(viewport);
      scrollTo.mockClear();

      act(() => observer.fire());

      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("releasing and re-pinning", () => {
    it("shows the scroll button after scrolling up past the threshold", () => {
      const { viewport } = renderConversation();

      release(viewport);

      expect(scrollButton()).toBeInTheDocument();
    });

    it("stays released when scrolling down but still past the threshold", () => {
      const { viewport } = renderConversation();
      release(viewport);

      scroll(viewport, {
        scrollTop: 550,
        scrollHeight: 1000,
        clientHeight: 300,
      });

      expect(scrollButton()).toBeInTheDocument();
    });

    it("re-pins when scrolled back to within the threshold", () => {
      const { viewport } = renderConversation();
      release(viewport);

      scroll(viewport, {
        scrollTop: 650,
        scrollHeight: 1000,
        clientHeight: 300,
      });

      expect(scrollButton()).not.toBeInTheDocument();
    });

    it("stays pinned through a scroll downward that is still far from the bottom", () => {
      const { viewport } = renderConversation();
      scroll(viewport, AT_BOTTOM);

      // The shape of a smooth scrollToBottom in progress after content grew.
      scroll(viewport, {
        scrollTop: 900,
        scrollHeight: 2000,
        clientHeight: 300,
      });

      expect(scrollButton()).not.toBeInTheDocument();
    });

    it("stays pinned when content shrinks and the browser clamps scrollTop", () => {
      const { viewport } = renderConversation();
      scroll(viewport, AT_BOTTOM);

      scroll(viewport, {
        scrollTop: 300,
        scrollHeight: 600,
        clientHeight: 300,
      });

      expect(scrollButton()).not.toBeInTheDocument();
    });

    it("re-pins and scrolls to the bottom when the button is pressed", () => {
      const { viewport, scrollTo } = renderConversation();
      release(viewport);
      scrollTo.mockClear();

      fireEvent.click(scrollButton()!);

      expect(scrollTo).toHaveBeenCalledWith({ top: 1000 });
      expect(scrollButton()).not.toBeInTheDocument();
    });
  });

  describe("ConversationScrollButton", () => {
    it("is a circle button with the default label and an icon", () => {
      const { viewport } = renderConversation();
      release(viewport);

      const button = scrollButton()!;
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveAttribute("data-slot", "conversation-scroll-button");
      expect(button.className).toContain("shape-circle");
      expect(button.className).toContain("variant-subtle");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("lets a caller replace the label, variant and children", () => {
      const { viewport } = renderConversation(
        <ConversationScrollButton aria-label="Jump down" variant="ghost">
          down
        </ConversationScrollButton>,
      );
      release(viewport);

      const button = screen.getByRole("button", { name: "Jump down" });
      expect(button).toHaveTextContent("down");
      expect(button.className).toContain("variant-ghost");
    });
  });

  describe("ConversationContent", () => {
    it("applies the default gap and padding", () => {
      const { viewport } = renderConversation();

      const content = viewport.firstElementChild!;
      expect(content).toHaveAttribute("data-ui-gap", "8");
      expect(content).toHaveAttribute("data-ui-p", "4");
    });

    it("passes Stack props through", () => {
      const ref = { current: null as HTMLDivElement | null };
      const { container } = render(
        <Conversation>
          <ConversationContent ref={ref} gap={2} p={0} className="custom">
            x
          </ConversationContent>
        </Conversation>,
      );

      const content = container.querySelector(
        '[data-slot="conversation-content"]',
      )!;
      expect(content).toHaveAttribute("data-ui-gap", "2");
      expect(content).toHaveAttribute("data-ui-p", "0");
      expect(content).toHaveClass("custom");
      expect(ref.current).toBe(content);
    });
  });

  describe("ConversationEmptyState", () => {
    it("renders the default title and description", () => {
      const { container } = render(<ConversationEmptyState />);

      expect(container.firstElementChild).toHaveAttribute(
        "data-slot",
        "conversation-empty-state",
      );
      expect(
        screen.getByRole("heading", { level: 3, name: "No messages yet" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Start a conversation to see messages here"),
      ).toBeInTheDocument();
    });

    it("renders a custom title, description and icon", () => {
      render(
        <ConversationEmptyState
          title="Nothing here"
          description="Say hello"
          icon={<svg data-testid="icon" />}
        />,
      );

      expect(
        screen.getByRole("heading", { level: 3, name: "Nothing here" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Say hello")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders children in place of the defaults", () => {
      render(<ConversationEmptyState>custom</ConversationEmptyState>);

      expect(screen.getByText("custom")).toBeInTheDocument();
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    it("passes Stack props through", () => {
      const { container } = render(
        <ConversationEmptyState gap={1} className="custom" />,
      );

      const root = container.firstElementChild!;
      expect(root).toHaveAttribute("data-ui-gap", "1");
      expect(root).toHaveAttribute("data-ui-fullheight");
      expect(root).toHaveClass("custom");
    });
  });

  describe("useConversation", () => {
    it("throws outside Conversation", () => {
      const Consumer = () => {
        useConversation();
        return null;
      };
      vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<Consumer />)).toThrow(
        "`useConversation` must be used within `Conversation`",
      );
    });

    it("exposes isAtBottom and scrollToBottom inside Conversation", () => {
      const seen: boolean[] = [];
      const Consumer = () => {
        const { isAtBottom, scrollToBottom } = useConversation();
        seen.push(isAtBottom);
        return (
          <button type="button" onClick={scrollToBottom}>
            down
          </button>
        );
      };
      const { container } = render(
        <Conversation>
          <ConversationContent>x</ConversationContent>
          <Consumer />
        </Conversation>,
      );
      const viewport = container.querySelector(
        '[data-slot="conversation-viewport"]',
      ) as HTMLElement;
      const scrollTo = vi
        .spyOn(viewport, "scrollTo")
        .mockImplementation(() => {});

      release(viewport);
      expect(seen.at(-1)).toBe(false);

      fireEvent.click(screen.getByRole("button", { name: "down" }));
      expect(scrollTo).toHaveBeenCalledWith({ top: 1000 });
      expect(seen.at(-1)).toBe(true);
    });
  });
});
