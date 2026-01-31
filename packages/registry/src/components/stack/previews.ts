import type { PreviewConfig } from "../../types";

export const stackPreviews: PreviewConfig[] = [
  {
    label: "Form layout",
    tree: {
      root: "stack",
      elements: {
        stack: {
          key: "stack",
          type: "Stack",
          props: { gap: 4 },
          children: ["heading", "description", "actions"],
        },
        heading: {
          key: "heading",
          type: "Text",
          props: { size: 3, weight: "bold", children: "Create your account" },
          parentKey: "stack",
        },
        description: {
          key: "description",
          type: "Text",
          props: {
            shade: "muted",
            children: "Enter your details below to get started.",
          },
          parentKey: "stack",
        },
        actions: {
          key: "actions",
          type: "Group",
          props: { gap: 2 },
          children: ["submit", "signin"],
        },
        submit: {
          key: "submit",
          type: "Button",
          props: { children: "Sign up" },
          parentKey: "actions",
        },
        signin: {
          key: "signin",
          type: "Button",
          props: { variant: "subtle", children: "Sign in instead" },
          parentKey: "actions",
        },
      },
    },
  },
];
