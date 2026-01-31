import type { PreviewConfig } from "../../types";

export const stackPreviews: PreviewConfig[] = [
  {
    label: "Gap sizes",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Group", props: { gap: 8 }, children: ["s2", "s4", "s8"] },
        s2: { key: "s2", type: "Stack", props: { gap: 2, p: 4, bordered: true }, children: ["s2a", "s2b", "s2c"] },
        s2a: { key: "s2a", type: "Text", props: { children: "gap=2" }, parentKey: "s2" },
        s2b: { key: "s2b", type: "Button", props: { children: "A", size: "small" }, parentKey: "s2" },
        s2c: { key: "s2c", type: "Button", props: { children: "B", size: "small" }, parentKey: "s2" },
        s4: { key: "s4", type: "Stack", props: { gap: 4, p: 4, bordered: true }, children: ["s4a", "s4b", "s4c"] },
        s4a: { key: "s4a", type: "Text", props: { children: "gap=4" }, parentKey: "s4" },
        s4b: { key: "s4b", type: "Button", props: { children: "A", size: "small" }, parentKey: "s4" },
        s4c: { key: "s4c", type: "Button", props: { children: "B", size: "small" }, parentKey: "s4" },
        s8: { key: "s8", type: "Stack", props: { gap: 8, p: 4, bordered: true }, children: ["s8a", "s8b", "s8c"] },
        s8a: { key: "s8a", type: "Text", props: { children: "gap=8" }, parentKey: "s8" },
        s8b: { key: "s8b", type: "Button", props: { children: "A", size: "small" }, parentKey: "s8" },
        s8c: { key: "s8c", type: "Button", props: { children: "B", size: "small" }, parentKey: "s8" },
      },
    },
  },
  {
    label: "Alignment",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Group", props: { gap: 8 }, children: ["start", "center", "end"] },
        start: { key: "start", type: "Stack", props: { gap: 2, ay: "start", p: 4, bordered: true }, children: ["sa", "sb"] },
        sa: { key: "sa", type: "Text", props: { children: "ay=start" }, parentKey: "start" },
        sb: { key: "sb", type: "Button", props: { children: "Item", size: "small" }, parentKey: "start" },
        center: { key: "center", type: "Stack", props: { gap: 2, ay: "center", p: 4, bordered: true }, children: ["ca", "cb"] },
        ca: { key: "ca", type: "Text", props: { children: "ay=center" }, parentKey: "center" },
        cb: { key: "cb", type: "Button", props: { children: "Item", size: "small" }, parentKey: "center" },
        end: { key: "end", type: "Stack", props: { gap: 2, ay: "end", p: 4, bordered: true }, children: ["ea", "eb"] },
        ea: { key: "ea", type: "Text", props: { children: "ay=end" }, parentKey: "end" },
        eb: { key: "eb", type: "Button", props: { children: "Item", size: "small" }, parentKey: "end" },
      },
    },
  },
];
