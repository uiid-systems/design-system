import type { UISpec } from "@/lib/catalog";

export const MOCK_UI_TREE: UISpec = {
  root: "root",
  elements: {
    root: {
      type: "Stack",
      props: { gap: 4, ax: "stretch", fullwidth: true },
      children: ["contact-form"],
    },
    "contact-form": {
      type: "Form",
      props: {
        action: { type: "submit" },
      },
      children: ["form-card"],
    },
    "form-card": {
      type: "Card",
      props: {
        ax: "stretch",
        gap: 4,
        fullwidth: true,
      },
      children: [
        "name-input",
        "email-input",
        "message-input",
        "terms-checkbox",
        "button-group",
      ],
    },
    "name-input": {
      type: "Input",
      props: {
        name: "name",
        label: "Full Name",
        placeholder: "Enter your full name...",
        required: true,
      },
    },
    "email-input": {
      type: "Input",
      props: {
        name: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        type: "email",
        required: true,
      },
    },
    "message-input": {
      type: "Textarea",
      props: {
        name: "message",
        label: "Message",
        placeholder: "How can we help you?",
        rows: 4,
        required: true,
      },
    },
    "terms-checkbox": {
      type: "Checkbox",
      props: {
        name: "terms",
        label: "I agree to the terms and conditions",
        required: true,
      },
    },
    "button-group": {
      type: "Group",
      props: { gap: 2, ax: "end" },
      children: ["reset-modal", "submit-btn"],
    },
    "reset-modal": {
      type: "Modal",
      props: {
        title: "Reset Form?",
        description:
          "Are you sure you want to reset the form? All entered data will be lost.",
        size: "small",
      },
      children: ["reset-trigger-btn"],
    },
    "reset-trigger-btn": {
      type: "Button",
      props: {
        variant: "subtle",
        children: "Reset",
        type: "reset",
      },
    },
    "submit-btn": {
      type: "Button",
      props: {
        children: "Submit",
        type: "submit",
      },
    },
  },
};
