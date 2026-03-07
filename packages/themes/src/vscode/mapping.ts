/**
 * VSCode theme color key → UIID theme input field mapping.
 *
 * Each UIID field has a priority-ordered list of VSCode color keys to try.
 * The first key found in the theme's `colors` object wins.
 *
 * For `white` and `black`, mappings differ by theme type (light vs dark)
 * because the semantic meaning flips: a dark theme's background is the
 * dark anchor, while a light theme's background is the light anchor.
 */

/** Priority-ordered VSCode keys to try for neutral anchors. */
export const NEUTRAL_MAPPING = {
  white: {
    light: [
      "editor.background",
      "editorWidget.background",
      "sideBar.background",
    ],
    dark: [
      "editor.foreground",
      "foreground",
      "sideBar.foreground",
      "editorWidget.foreground",
    ],
  },
  black: {
    light: [
      "editor.foreground",
      "foreground",
      "sideBar.foreground",
    ],
    dark: [
      "editor.background",
      "editorWidget.background",
      "sideBar.background",
    ],
  },
} as const;

/** Priority-ordered VSCode keys to try for accent/tone colors. */
export const ACCENT_MAPPING = {
  primary: [
    "focusBorder",
    "button.background",
    "activityBarBadge.background",
    "progressBar.background",
    "textLink.foreground",
  ],
  secondary: [
    "badge.background",
    "activityBar.activeBorder",
    "editorLink.activeForeground",
    "tab.activeBorder",
    "panelTitle.activeBorder",
  ],
  positive: [
    "terminal.ansiGreen",
    "gitDecoration.addedResourceForeground",
    "editorGutter.addedBackground",
    "testing.iconPassed",
  ],
  warning: [
    "terminal.ansiYellow",
    "list.warningForeground",
    "editorWarning.foreground",
    "gitDecoration.modifiedResourceForeground",
  ],
  critical: [
    "terminal.ansiRed",
    "errorForeground",
    "editorError.foreground",
    "list.errorForeground",
    "testing.iconFailed",
  ],
  info: [
    "terminal.ansiBlue",
    "editorInfo.foreground",
    "notificationsInfoIcon.foreground",
    "terminal.ansiCyan",
  ],
} as const;

/** All UIID theme fields that map from VSCode accent keys. */
export type AccentField = keyof typeof ACCENT_MAPPING;

/** All UIID theme fields that map from VSCode neutral keys. */
export type NeutralField = keyof typeof NEUTRAL_MAPPING;
