/**
 * Catalog adapter for json-render.
 *
 * Converts UIID registry schemas to json-render catalog format.
 * This is the bridge between our framework-agnostic registry
 * and the json-render library.
 */

import { createCatalog } from "@json-render/core";

import {
  BoxPropsSchema,
  ButtonPropsSchema,
  CardPropsSchema,
  CheckboxPropsSchema,
  FormPropsSchema,
  GroupPropsSchema,
  InputPropsSchema,
  LayerPropsSchema,
  ModalPropsSchema,
  SelectPropsSchema,
  SeparatorPropsSchema,
  StackPropsSchema,
  SwitchPropsSchema,
  TextPropsSchema,
  TextareaPropsSchema,
  ToggleButtonPropsSchema,
} from "@uiid/registry";

/**
 * UIID catalog for json-render.
 *
 * Defines what components the AI can generate and their prop schemas.
 * The AI will only generate JSON that matches these schemas.
 */
export const catalog = createCatalog({
  components: {
    // Layout components
    Box: {
      props: BoxPropsSchema,
      hasChildren: true,
    },
    Stack: {
      props: StackPropsSchema,
      hasChildren: true,
    },
    Group: {
      props: GroupPropsSchema,
      hasChildren: true,
    },
    Layer: {
      props: LayerPropsSchema,
      hasChildren: true,
    },
    Separator: {
      props: SeparatorPropsSchema,
      hasChildren: false,
    },

    // Button components
    Button: {
      props: ButtonPropsSchema,
      hasChildren: true,
    },
    ToggleButton: {
      props: ToggleButtonPropsSchema,
      hasChildren: true,
    },

    // Form components
    Form: {
      props: FormPropsSchema,
      hasChildren: true,
    },
    Input: {
      props: InputPropsSchema,
      hasChildren: false,
    },
    Textarea: {
      props: TextareaPropsSchema,
      hasChildren: false,
    },
    Checkbox: {
      props: CheckboxPropsSchema,
      hasChildren: false,
    },
    Select: {
      props: SelectPropsSchema,
      hasChildren: false,
    },
    Switch: {
      props: SwitchPropsSchema,
      hasChildren: false,
    },

    // Typography components
    Text: {
      props: TextPropsSchema,
      hasChildren: true,
    },

    // Card components
    Card: {
      props: CardPropsSchema,
      hasChildren: true,
    },

    // Overlay components
    Modal: {
      props: ModalPropsSchema,
      hasChildren: true,
    },
  },
  actions: {
    // Define actions that components can trigger
    submit: {
      description: "Submit a form",
    },
    navigate: {
      description: "Navigate to a different page or section",
    },
    toggle: {
      description: "Toggle a boolean state",
    },
    dismiss: {
      description: "Dismiss or close something",
    },
  },
});

export type Catalog = typeof catalog;

