import { useEffect, useRef, useCallback } from "react";

/**
 * Measures the pressed toggle so the sliding indicator can track it.
 *
 * There is only one indicator, so it can only ever follow one value. A
 * `multiple` group renders no indicator at all — each pressed toggle paints its
 * own background instead — so the measuring is skipped rather than writing
 * geometry variables nothing reads.
 */
export const useToggleIndicator = (
  value: readonly (string | number)[] | undefined,
  activeValue: readonly string[],
  orientation: "horizontal" | "vertical" | undefined,
  multiple: boolean | undefined,
) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const updateIndicatorPosition = useCallback(() => {
    if (multiple) return;

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
  }, [value, activeValue, orientation, multiple]);

  useEffect(() => {
    if (multiple) return;

    updateIndicatorPosition();

    const panel = panelRef.current;
    const currentValue = value ?? activeValue;
    const firstValue = currentValue[0];
    const activeButton = firstValue
      ? buttonsRef.current.get(String(firstValue))
      : null;

    if (!panel) return;

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
      resizeObserver.disconnect();
    };
  }, [value, activeValue, orientation, multiple, updateIndicatorPosition]);

  return { panelRef, buttonsRef };
};
