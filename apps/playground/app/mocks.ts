import type { UITree } from "@json-render/core";

export const MOCK_UI_TREE: UITree = {
  root: "root",
  elements: {
    root: {
      key: "root",
      type: "Stack",
      props: { gap: 4, ax: "stretch", fullwidth: true },
      children: ["contact-form"],
    },
    "contact-form": {
      key: "contact-form",
      type: "Form",
      props: {
        action: { type: "submit" },
      },
      children: ["form-card"],
      parentKey: "root",
    },
    "form-card": {
      key: "form-card",
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
      parentKey: "contact-form",
    },
    "name-input": {
      key: "name-input",
      type: "Input",
      props: {
        name: "name",
        label: "Full Name",
        placeholder: "Enter your full name...",
        required: true,
      },
      parentKey: "form-card",
    },
    "email-input": {
      key: "email-input",
      type: "Input",
      props: {
        name: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        type: "email",
        required: true,
      },
      parentKey: "form-card",
    },
    "message-input": {
      key: "message-input",
      type: "Textarea",
      props: {
        name: "message",
        label: "Message",
        placeholder: "How can we help you?",
        rows: 4,
        required: true,
      },
      parentKey: "form-card",
    },
    "terms-checkbox": {
      key: "terms-checkbox",
      type: "Checkbox",
      props: {
        name: "terms",
        label: "I agree to the terms and conditions",
        required: true,
      },
      parentKey: "form-card",
    },
    "button-group": {
      key: "button-group",
      type: "Group",
      props: { gap: 2, ax: "end" },
      children: ["reset-modal", "submit-btn"],
      parentKey: "form-card",
    },
    "reset-modal": {
      key: "reset-modal",
      type: "Modal",
      props: {
        title: "Reset Form?",
        description:
          "Are you sure you want to reset the form? All entered data will be lost.",
        size: "small",
      },
      children: ["reset-trigger-btn"],
      parentKey: "button-group",
    },
    "reset-trigger-btn": {
      key: "reset-trigger-btn",
      type: "Button",
      props: {
        variant: "subtle",
        children: "Reset",
        type: "reset",
      },
      parentKey: "reset-modal",
    },
    "submit-btn": {
      key: "submit-btn",
      type: "Button",
      props: {
        children: "Submit",
        type: "submit",
      },
      parentKey: "button-group",
    },
  },
};
