import type { PreviewConfig } from "../../types";

export const formPreviews: PreviewConfig[] = [
  {
    label: "Contact form",
    tree: {
      root: "form",
      elements: {
        form: {
          key: "form",
          type: "Form",
          props: {},
          children: ["stack"],
        },
        stack: {
          key: "stack",
          type: "Stack",
          props: { gap: 4, ax: "stretch" },
          children: ["name", "email", "message", "actions"],
          parentKey: "form",
        },
        name: {
          key: "name",
          type: "Input",
          props: {
            label: "Name",
            placeholder: "Jane Smith",
            required: true,
            fullwidth: true,
          },
          parentKey: "stack",
        },
        email: {
          key: "email",
          type: "Input",
          props: {
            label: "Email",
            placeholder: "jane@company.com",
            type: "email",
            required: true,
            fullwidth: true,
          },
          parentKey: "stack",
        },
        message: {
          key: "message",
          type: "Textarea",
          props: {
            label: "Message",
            placeholder: "How can we help?",
            rows: 3,
            fullwidth: true,
          },
          parentKey: "stack",
        },
        actions: {
          key: "actions",
          type: "Group",
          props: { gap: 2 },
          children: ["reset", "submit"],
          parentKey: "stack",
        },
        reset: {
          key: "reset",
          type: "Button",
          props: { children: "Reset", ghost: true },
          parentKey: "actions",
        },
        submit: {
          key: "submit",
          type: "Button",
          props: { children: "Send message" },
          parentKey: "actions",
        },
      },
    },
  },
];
