import type { PreviewConfig } from "../../types";

export const accordionPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "accordion",
      elements: {
        accordion: {
          key: "accordion",
          type: "Accordion",
          props: {
            items: [
              { value: "item1", trigger: "What is UIID?", content: "UIID is a modular React component library." },
              { value: "item2", trigger: "How do I install it?", content: "Run pnpm add @uiid/buttons @uiid/forms" },
              { value: "item3", trigger: "Is it accessible?", content: "Yes, all components follow WAI-ARIA guidelines." },
            ],
          },
        },
      },
    },
  },
  {
    label: "Multiple Open",
    tree: {
      root: "accordion",
      elements: {
        accordion: {
          key: "accordion",
          type: "Accordion",
          props: {
            multiple: true,
            defaultValue: ["item1", "item2"],
            items: [
              { value: "item1", trigger: "Section 1", content: "Content for section 1" },
              { value: "item2", trigger: "Section 2", content: "Content for section 2" },
              { value: "item3", trigger: "Section 3", content: "Content for section 3" },
            ],
          },
        },
      },
    },
  },
];
