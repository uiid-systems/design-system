import type { PreviewConfig } from "../../types";

export const groupPreviews: PreviewConfig[] = [
  {
    label: "Gap sizes",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Stack", props: { gap: 8 }, children: ["g2", "g4", "g8"] },
        g2: { key: "g2", type: "Group", props: { gap: 2, p: 4, bordered: true, ay: "center" }, children: ["g2a", "g2b", "g2c"] },
        g2a: { key: "g2a", type: "Text", props: { children: "gap=2" }, parentKey: "g2" },
        g2b: { key: "g2b", type: "Button", props: { children: "A", size: "small" }, parentKey: "g2" },
        g2c: { key: "g2c", type: "Button", props: { children: "B", size: "small" }, parentKey: "g2" },
        g4: { key: "g4", type: "Group", props: { gap: 4, p: 4, bordered: true, ay: "center" }, children: ["g4a", "g4b", "g4c"] },
        g4a: { key: "g4a", type: "Text", props: { children: "gap=4" }, parentKey: "g4" },
        g4b: { key: "g4b", type: "Button", props: { children: "A", size: "small" }, parentKey: "g4" },
        g4c: { key: "g4c", type: "Button", props: { children: "B", size: "small" }, parentKey: "g4" },
        g8: { key: "g8", type: "Group", props: { gap: 8, p: 4, bordered: true, ay: "center" }, children: ["g8a", "g8b", "g8c"] },
        g8a: { key: "g8a", type: "Text", props: { children: "gap=8" }, parentKey: "g8" },
        g8b: { key: "g8b", type: "Button", props: { children: "A", size: "small" }, parentKey: "g8" },
        g8c: { key: "g8c", type: "Button", props: { children: "B", size: "small" }, parentKey: "g8" },
      },
    },
  },
  {
    label: "Alignment",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Stack", props: { gap: 8 }, children: ["start", "center", "end", "between"] },
        start: { key: "start", type: "Group", props: { gap: 2, ax: "start", p: 4, bordered: true, fullwidth: true }, children: ["sa", "sb", "sc"] },
        sa: { key: "sa", type: "Text", props: { children: "ax=start" }, parentKey: "start" },
        sb: { key: "sb", type: "Button", props: { children: "A", size: "small" }, parentKey: "start" },
        sc: { key: "sc", type: "Button", props: { children: "B", size: "small" }, parentKey: "start" },
        center: { key: "center", type: "Group", props: { gap: 2, ax: "center", p: 4, bordered: true, fullwidth: true }, children: ["ca", "cb", "cc"] },
        ca: { key: "ca", type: "Text", props: { children: "ax=center" }, parentKey: "center" },
        cb: { key: "cb", type: "Button", props: { children: "A", size: "small" }, parentKey: "center" },
        cc: { key: "cc", type: "Button", props: { children: "B", size: "small" }, parentKey: "center" },
        end: { key: "end", type: "Group", props: { gap: 2, ax: "end", p: 4, bordered: true, fullwidth: true }, children: ["ea", "eb", "ec"] },
        ea: { key: "ea", type: "Text", props: { children: "ax=end" }, parentKey: "end" },
        eb: { key: "eb", type: "Button", props: { children: "A", size: "small" }, parentKey: "end" },
        ec: { key: "ec", type: "Button", props: { children: "B", size: "small" }, parentKey: "end" },
        between: { key: "between", type: "Group", props: { gap: 2, ax: "between", p: 4, bordered: true, fullwidth: true }, children: ["ba", "bb", "bc"] },
        ba: { key: "ba", type: "Text", props: { children: "ax=between" }, parentKey: "between" },
        bb: { key: "bb", type: "Button", props: { children: "A", size: "small" }, parentKey: "between" },
        bc: { key: "bc", type: "Button", props: { children: "B", size: "small" }, parentKey: "between" },
      },
    },
  },
];
