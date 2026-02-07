import type { PreviewConfig } from "../../types";

export const kbdPreviews: PreviewConfig[] = [
  {
    label: "Single keys",
    tree: {
      root: "keys",
      elements: {
        keys: {
          key: "keys",
          type: "Group",
          props: { gap: 2 },
          children: ["esc", "tab", "enter", "space", "delete"],
        },
        esc: {
          key: "esc",
          type: "Kbd",
          props: { children: "Esc" },
          parentKey: "keys",
        },
        tab: {
          key: "tab",
          type: "Kbd",
          props: { children: "Tab" },
          parentKey: "keys",
        },
        enter: {
          key: "enter",
          type: "Kbd",
          props: { children: "Enter" },
          parentKey: "keys",
        },
        space: {
          key: "space",
          type: "Kbd",
          props: { children: "Space" },
          parentKey: "keys",
        },
        delete: {
          key: "delete",
          type: "Kbd",
          props: { children: "Delete" },
          parentKey: "keys",
        },
      },
    },
  },
  {
    label: "Modifiers",
    tree: {
      root: "keys",
      elements: {
        keys: {
          key: "keys",
          type: "Group",
          props: { gap: 2 },
          children: ["cmd", "shift", "option", "ctrl"],
        },
        cmd: {
          key: "cmd",
          type: "Kbd",
          props: { children: "\u2318" },
          parentKey: "keys",
        },
        shift: {
          key: "shift",
          type: "Kbd",
          props: { children: "\u21E7" },
          parentKey: "keys",
        },
        option: {
          key: "option",
          type: "Kbd",
          props: { children: "\u2325" },
          parentKey: "keys",
        },
        ctrl: {
          key: "ctrl",
          type: "Kbd",
          props: { children: "\u2303" },
          parentKey: "keys",
        },
      },
    },
  },
  {
    label: "Shortcuts",
    tree: {
      root: "shortcuts",
      elements: {
        shortcuts: {
          key: "shortcuts",
          type: "Stack",
          props: { gap: 3 },
          children: ["save-row", "copy-row", "paste-row", "undo-row"],
        },
        "save-row": {
          key: "save-row",
          type: "Group",
          props: { gap: 3, ay: "center" },
          children: ["save-label", "save-keys"],
          parentKey: "shortcuts",
        },
        "save-label": {
          key: "save-label",
          type: "Text",
          props: { children: "Save", size: 0, shade: "muted" },
          parentKey: "save-row",
        },
        "save-keys": {
          key: "save-keys",
          type: "Group",
          props: { gap: 1 },
          children: ["cmd-save", "s-save"],
          parentKey: "save-row",
        },
        "cmd-save": {
          key: "cmd-save",
          type: "Kbd",
          props: { children: "\u2318" },
          parentKey: "save-keys",
        },
        "s-save": {
          key: "s-save",
          type: "Kbd",
          props: { children: "S" },
          parentKey: "save-keys",
        },
        "copy-row": {
          key: "copy-row",
          type: "Group",
          props: { gap: 3, ay: "center" },
          children: ["copy-label", "copy-keys"],
          parentKey: "shortcuts",
        },
        "copy-label": {
          key: "copy-label",
          type: "Text",
          props: { children: "Copy", size: 0, shade: "muted" },
          parentKey: "copy-row",
        },
        "copy-keys": {
          key: "copy-keys",
          type: "Group",
          props: { gap: 1 },
          children: ["cmd-copy", "c-copy"],
          parentKey: "copy-row",
        },
        "cmd-copy": {
          key: "cmd-copy",
          type: "Kbd",
          props: { children: "\u2318" },
          parentKey: "copy-keys",
        },
        "c-copy": {
          key: "c-copy",
          type: "Kbd",
          props: { children: "C" },
          parentKey: "copy-keys",
        },
        "paste-row": {
          key: "paste-row",
          type: "Group",
          props: { gap: 3, ay: "center" },
          children: ["paste-label", "paste-keys"],
          parentKey: "shortcuts",
        },
        "paste-label": {
          key: "paste-label",
          type: "Text",
          props: { children: "Paste", size: 0, shade: "muted" },
          parentKey: "paste-row",
        },
        "paste-keys": {
          key: "paste-keys",
          type: "Group",
          props: { gap: 1 },
          children: ["cmd-paste", "v-paste"],
          parentKey: "paste-row",
        },
        "cmd-paste": {
          key: "cmd-paste",
          type: "Kbd",
          props: { children: "\u2318" },
          parentKey: "paste-keys",
        },
        "v-paste": {
          key: "v-paste",
          type: "Kbd",
          props: { children: "V" },
          parentKey: "paste-keys",
        },
        "undo-row": {
          key: "undo-row",
          type: "Group",
          props: { gap: 3, ay: "center" },
          children: ["undo-label", "undo-keys"],
          parentKey: "shortcuts",
        },
        "undo-label": {
          key: "undo-label",
          type: "Text",
          props: { children: "Undo", size: 0, shade: "muted" },
          parentKey: "undo-row",
        },
        "undo-keys": {
          key: "undo-keys",
          type: "Group",
          props: { gap: 1 },
          children: ["cmd-undo", "z-undo"],
          parentKey: "undo-row",
        },
        "cmd-undo": {
          key: "cmd-undo",
          type: "Kbd",
          props: { children: "\u2318" },
          parentKey: "undo-keys",
        },
        "z-undo": {
          key: "z-undo",
          type: "Kbd",
          props: { children: "Z" },
          parentKey: "undo-keys",
        },
      },
    },
  },
];
