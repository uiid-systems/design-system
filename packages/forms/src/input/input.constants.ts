export const INPUT_DEFAULT_SIZE = "medium";
export const INPUT_DEFAULT_ORIENTATION = "horizontal";

/**
 * Slot content that takes a press itself, so the press stays there instead of
 * moving focus to the control. `composes-field-slot` in `@uiid/tokens`
 * re-enables pointer events for the same list; keep the two in step.
 */
export const INPUT_SLOT_INTERACTIVE = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[tabindex]",
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="link"]',
];
