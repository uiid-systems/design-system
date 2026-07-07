import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// useLayoutEffect emits a warning during server rendering; fall back to
// useEffect on the server where there is no DOM to measure anyway.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useToggleIndicator = (
  value: readonly (string | number)[] | undefined,
  activeValue: readonly string[],
  orientation: "horizontal" | "vertical" | undefined,
) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [ready, setReady] = useState(false);

  const updateIndicatorPosition = useCallback(() => {
    const currentValue = value ?? activeValue;
    const firstValue = currentValue[0];
    const activeButton = firstValue
      ? buttonsRef.current.get(String(firstValue))
      : null;
    const panel = panelRef.current;

    if (activeButton && panel) {
      const isVertical = orientation === "vertical";
      const buttonRect = activeButton.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      if (isVertical) {
        panel.style.setProperty(
          "--active-toggle-top",
          `${buttonRect.top - panelRect.top - 1}px`,
        );
        panel.style.setProperty(
          "--active-toggle-height",
          `${buttonRect.height}px`,
        );
      } else {
        panel.style.setProperty(
          "--active-toggle-left",
          `${buttonRect.left - panelRect.left - 1}px`,
        );
        panel.style.setProperty(
          "--active-toggle-width",
          `${buttonRect.width}px`,
        );
      }
    }
  }, [value, activeValue, orientation]);

  useIsomorphicLayoutEffect(() => {
    // Position the indicator before the browser paints so the first frame is
    // already correct rather than starting at zero width.
    updateIndicatorPosition();

    const panel = panelRef.current;
    const currentValue = value ?? activeValue;
    const firstValue = currentValue[0];
    const activeButton = firstValue
      ? buttonsRef.current.get(String(firstValue))
      : null;

    if (!panel) return;

    // Enable transitions only after the initial (snap) placement has painted,
    // so subsequent value changes animate but the first render does not.
    const raf = requestAnimationFrame(() => setReady(true));

    const resizeObserver = new ResizeObserver(() => {
      updateIndicatorPosition();
    });

    // Observe the panel for size changes
    resizeObserver.observe(panel);

    // Observe the active button for size changes
    if (activeButton) {
      resizeObserver.observe(activeButton);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [value, activeValue, orientation, updateIndicatorPosition]);

  return { panelRef, buttonsRef, ready };
};
