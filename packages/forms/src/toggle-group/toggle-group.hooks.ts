import { useEffect, useRef, useCallback } from "react";

const INDICATOR_PROPERTIES = [
  "--active-toggle-top",
  "--active-toggle-height",
  "--active-toggle-left",
  "--active-toggle-width",
] as const;

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

    if (!panel) return;

    // Nothing pressed is mounted, so the last toggle's geometry is dropped
    // rather than left behind where that toggle used to be.
    if (!activeButton) {
      for (const property of INDICATOR_PROPERTIES) {
        panel.style.removeProperty(property);
      }
      return;
    }

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
      panel.style.setProperty("--active-toggle-width", `${buttonRect.width}px`);
    }

    return activeButton;
  }, [value, activeValue, orientation, multiple]);

  useEffect(() => {
    if (multiple) return;

    const panel = panelRef.current;
    if (!panel) return;

    const resizeObserver = new ResizeObserver(() => {
      updateIndicatorPosition();
    });

    // Measures, then watches the pressed toggle for size changes. The toggle
    // watched before is let go, so removed buttons don't pile up.
    let observedButton: HTMLButtonElement | undefined;
    const update = () => {
      const activeButton = updateIndicatorPosition();
      if (activeButton === observedButton) return;
      if (observedButton) resizeObserver.unobserve(observedButton);
      if (activeButton) resizeObserver.observe(activeButton);
      observedButton = activeButton;
    };

    update();
    resizeObserver.observe(panel);

    // A toggle mounting or unmounting changes neither the value nor the
    // panel's size, so the panel's children are watched for it.
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(panel, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [multiple, updateIndicatorPosition]);

  return { panelRef, buttonsRef };
};
