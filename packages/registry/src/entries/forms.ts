import type { ComponentEntry } from "../types";

import {
  CheckboxPropsSchema,
  FormPropsSchema,
  InputPropsSchema,
  SelectPropsSchema,
  SwitchPropsSchema,
  TextareaPropsSchema,
} from "../schemas/forms";

export const FormEntry: ComponentEntry<typeof FormPropsSchema> = {
  name: "Form",
  package: "@uiid/forms",
  hasChildren: true,
  propsSchema: FormPropsSchema,
  description:
    "Form container with built-in validation support. Fields with required/pattern attributes validate on submit.",
  category: "forms",
  defaults: {
    gap: 4,
  },
};

export const InputEntry: ComponentEntry<typeof InputPropsSchema> = {
  name: "Input",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: InputPropsSchema,
  description: "Text input field with label and description support",
  category: "forms",
  defaults: {
    size: "medium",
  },
};

export const TextareaEntry: ComponentEntry<typeof TextareaPropsSchema> = {
  name: "Textarea",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: TextareaPropsSchema,
  description: "Multi-line text input with label and description support",
  category: "forms",
  defaults: {
    size: "medium",
    rows: 3,
    resize: "vertical",
  },
};

export const CheckboxEntry: ComponentEntry<typeof CheckboxPropsSchema> = {
  name: "Checkbox",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: CheckboxPropsSchema,
  description: "Checkbox input with label, description, and indeterminate state support",
  category: "forms",
  defaults: {},
};

export const SelectEntry: ComponentEntry<typeof SelectPropsSchema> = {
  name: "Select",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: SelectPropsSchema,
  description: "Dropdown select with customizable options, label, and description",
  category: "forms",
  defaults: {
    size: "medium",
  },
};

export const SwitchEntry: ComponentEntry<typeof SwitchPropsSchema> = {
  name: "Switch",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: SwitchPropsSchema,
  description: "Toggle switch with label and description support",
  category: "forms",
  defaults: {},
};
