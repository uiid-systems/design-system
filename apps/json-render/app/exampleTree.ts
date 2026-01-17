import type { UITree } from "@json-render/core";

export const exampleTree: UITree = {
  root: "root",
  elements: {
    root: {
      key: "root",
      type: "Stack",
      props: { gap: 4, p: 4 },
      children: ["heading", "description", "card"],
    },
    heading: {
      key: "heading",
      type: "Text",
      props: {
        size: 4,
        weight: "bold",
        children: "Welcome to UIID + json-render",
      },
      parentKey: "root",
    },
    description: {
      key: "description",
      type: "Text",
      props: {
        children:
          "This UI was generated from JSON using the UIID component registry.",
      },
      parentKey: "root",
    },
    card: {
      key: "card",
      type: "Card",
      props: {
        title: "Example Card",
        description: "This is a card component",
        fullwidth: true,
        ax: "stretch",
      },
      children: ["input", "checkbox", "button-group"],
      parentKey: "root",
    },
    input: {
      key: "input",
      type: "Input",
      props: { label: "Your name", placeholder: "Enter your name..." },
      parentKey: "card",
    },
    checkbox: {
      key: "checkbox",
      type: "Checkbox",
      props: { label: "I agree to the terms" },
      parentKey: "card",
    },
    "button-group": {
      key: "button-group",
      type: "Group",
      props: { gap: 2, ax: "end" },
      children: ["cancel-btn", "submit-btn"],
      parentKey: "card",
    },
    "cancel-btn": {
      key: "cancel-btn",
      type: "Button",
      props: { variant: "subtle", children: "Cancel" },
      parentKey: "button-group",
    },
    "submit-btn": {
      key: "submit-btn",
      type: "Button",
      props: { children: "Submit" },
      parentKey: "button-group",
    },
  },
};
