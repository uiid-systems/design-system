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
          props: { fullwidth: true },
          children: ["name", "email", "message", "submit"],
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
          parentKey: "form",
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
          parentKey: "form",
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
          parentKey: "form",
        },
        submit: {
          key: "submit",
          type: "Button",
          props: { children: "Send message" },
          parentKey: "form",
        },
      },
    },
  },
];
