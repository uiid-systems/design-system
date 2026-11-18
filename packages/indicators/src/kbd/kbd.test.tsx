import { act, fireEvent, render } from "@testing-library/react";
import { createRef } from "react";
import { describe, it, expect } from "vitest";

import { Kbd } from "./kbd";
import * as Examples from "./kbd.examples";
import { formatKeys, matchesHotkey, parseHotkey } from "./kbd.utils";

import styles from "./kbd.module.css";

const getKbd = (container: HTMLElement) =>
  container.querySelector("[data-slot='kbd']") as HTMLElement;

const keyEvent = (init: KeyboardEventInit) =>
  new KeyboardEvent("keydown", init);

describe("Kbd", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a kbd element with data-slot", () => {
    const { container } = render(<Kbd hotkey={["k"]} />);
    const kbd = getKbd(container);
    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toHaveClass(styles["kbd"]);
  });

  it("merges className", () => {
    const { container } = render(<Kbd className="custom" />);
    expect(getKbd(container)).toHaveClass("custom", styles["kbd"]);
  });

  it("forwards ref and remaining props", () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Kbd ref={ref} id="save" aria-label="Command S" hotkey={["meta", "s"]} />,
    );
    expect(ref.current).toBe(getKbd(container));
    expect(ref.current).toHaveAttribute("id", "save");
    expect(ref.current).toHaveAttribute("aria-label", "Command S");
  });

  it("renders the hotkey with symbols for named keys", () => {
    const { container } = render(<Kbd hotkey={["meta", "shift", "b"]} />);
    expect(getKbd(container)).toHaveTextContent("⌘ + ⇧ + B");
  });

  it("renders nothing inside without a hotkey", () => {
    const { container } = render(<Kbd />);
    expect(getKbd(container)).toBeEmptyDOMElement();
  });

  // ============================================
  // ACTIVE STATE
  // ============================================

  it("is inactive by default", () => {
    const { container } = render(<Kbd hotkey={["k"]} />);
    expect(getKbd(container)).not.toHaveAttribute("data-active");
  });

  it("marks itself active while its hotkey is held", () => {
    const { container } = render(<Kbd hotkey={["meta", "k"]} />);
    const kbd = getKbd(container);

    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(kbd).toHaveAttribute("data-active");

    fireEvent.keyUp(window, { key: "k", metaKey: true });
    expect(kbd).not.toHaveAttribute("data-active");
  });

  it("ignores the key without its modifier", () => {
    const { container } = render(<Kbd hotkey={["meta", "k"]} />);
    fireEvent.keyDown(window, { key: "k" });
    expect(getKbd(container)).not.toHaveAttribute("data-active");
  });

  it("clears the active state when the window loses focus", () => {
    const { container } = render(<Kbd hotkey={["k"]} />);
    fireEvent.keyDown(window, { key: "k" });
    expect(getKbd(container)).toHaveAttribute("data-active");

    act(() => {
      window.dispatchEvent(new Event("blur"));
    });
    expect(getKbd(container)).not.toHaveAttribute("data-active");
  });

  it("lets active override the hotkey listener", () => {
    const { container, rerender } = render(
      <Kbd hotkey={["k"]} active={false} />,
    );
    fireEvent.keyDown(window, { key: "k" });
    expect(getKbd(container)).not.toHaveAttribute("data-active");

    rerender(<Kbd hotkey={["k"]} active />);
    expect(getKbd(container)).toHaveAttribute("data-active");
  });

  it("stops listening once unmounted", () => {
    const { container, unmount } = render(<Kbd hotkey={["k"]} />);
    const kbd = getKbd(container);
    unmount();
    fireEvent.keyDown(window, { key: "k" });
    expect(kbd).not.toHaveAttribute("data-active");
  });
});

describe("Kbd utils", () => {
  describe("parseHotkey", () => {
    it("splits modifiers from the key, case-insensitively", () => {
      const { modifiers, key } = parseHotkey(["Meta", "SHIFT", "K"]);
      expect([...modifiers]).toEqual(["Meta", "Shift"]);
      expect(key).toBe("k");
    });
  });

  describe("formatKeys", () => {
    it("maps named keys to symbols and uppercases the rest", () => {
      expect(formatKeys(["ctrl", "alt", "enter"])).toBe("⌃ + ⌥ + ↵");
      expect(formatKeys(["escape"])).toBe("⎋");
      expect(formatKeys(["shift", "a"])).toBe("⇧ + A");
    });
  });

  describe("matchesHotkey", () => {
    it("matches a key with exactly its modifiers", () => {
      const keys = ["meta", "k"];
      expect(matchesHotkey(keyEvent({ key: "k", metaKey: true }), keys)).toBe(
        true,
      );
      expect(matchesHotkey(keyEvent({ key: "K", metaKey: true }), keys)).toBe(
        true,
      );
      expect(matchesHotkey(keyEvent({ key: "k" }), keys)).toBe(false);
      expect(
        matchesHotkey(
          keyEvent({ key: "k", metaKey: true, shiftKey: true }),
          keys,
        ),
      ).toBe(false);
      expect(matchesHotkey(keyEvent({ key: "j", metaKey: true }), keys)).toBe(
        false,
      );
    });

    it("matches a modifier-only hotkey on the modifier itself", () => {
      expect(
        matchesHotkey(keyEvent({ key: "Shift", shiftKey: true }), ["shift"]),
      ).toBe(true);
      expect(
        matchesHotkey(keyEvent({ key: "a", shiftKey: true }), ["shift"]),
      ).toBe(false);
    });

    it("matches named keys by their KeyboardEvent.key", () => {
      expect(matchesHotkey(keyEvent({ key: "Enter" }), ["enter"])).toBe(true);
      expect(matchesHotkey(keyEvent({ key: "Escape" }), ["escape"])).toBe(true);
      expect(matchesHotkey(keyEvent({ key: "ArrowUp" }), ["arrowup"])).toBe(
        true,
      );
    });

    // BUG: `space` is a named key in KEY_SYMBOLS, but the space bar's
    // `event.key` is " ", so the "space" hotkey can never match.
    it.fails("matches the space bar for the space key", () => {
      expect(
        matchesHotkey(keyEvent({ key: " ", code: "Space" }), ["space"]),
      ).toBe(true);
    });

    // BUG: on macOS, Option changes `event.key` (Option+B gives "∫"), so an
    // alt + letter hotkey never matches there. Matching on `event.code`
    // would fix it.
    it.fails("matches alt + letter when Option changes the key", () => {
      expect(
        matchesHotkey(keyEvent({ key: "∫", code: "KeyB", altKey: true }), [
          "alt",
          "b",
        ]),
      ).toBe(true);
    });
  });
});

describe("Kbd examples", () => {
  it.each(Object.entries(Examples))("%s renders a kbd", (_, Example) => {
    const { container } = render(<Example />);
    expect(getKbd(container)).toBeInTheDocument();
  });
});
