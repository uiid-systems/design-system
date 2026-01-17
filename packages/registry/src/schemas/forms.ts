import { z } from "zod";

import type { ComponentEntry } from "../types";

import { FormSize } from "./shared";

/**
 * Input component props schema.
 */
export const InputPropsSchema = z.object({
  /** Input value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Placeholder text */
  placeholder: z.string().optional(),
  /** Input type */
  type: z.string().optional(),
  /** Size variant */
  size: FormSize.optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description/helper text */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Full width input */
  fullwidth: z.boolean().optional(),
  /** Ghost style (minimal borders) */
  ghost: z.boolean().optional(),
});

export type InputProps = z.infer<typeof InputPropsSchema>;

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

/**
 * Textarea resize options.
 */
export const TextareaResize = z.enum(["none", "vertical", "horizontal", "both"]);

/**
 * Textarea component props schema.
 */
export const TextareaPropsSchema = z.object({
  /** Textarea value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Placeholder text */
  placeholder: z.string().optional(),
  /** Number of visible text lines */
  rows: z.number().optional(),
  /** Resize behavior */
  resize: TextareaResize.optional(),
  /** Size variant */
  size: FormSize.optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description/helper text */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Full width textarea */
  fullwidth: z.boolean().optional(),
  /** Ghost style (minimal borders) */
  ghost: z.boolean().optional(),
});

export type TextareaProps = z.infer<typeof TextareaPropsSchema>;

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

/**
 * Checkbox component props schema.
 */
export const CheckboxPropsSchema = z.object({
  /** Checked state (controlled) */
  checked: z.boolean().optional(),
  /** Default checked state (uncontrolled) */
  defaultChecked: z.boolean().optional(),
  /** Indeterminate state */
  indeterminate: z.boolean().optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Field name for forms */
  name: z.string().optional(),
  /** Reverse label/checkbox order */
  reversed: z.boolean().optional(),
  /** Add border around the field */
  bordered: z.boolean().optional(),
});

export type CheckboxProps = z.infer<typeof CheckboxPropsSchema>;

export const CheckboxEntry: ComponentEntry<typeof CheckboxPropsSchema> = {
  name: "Checkbox",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: CheckboxPropsSchema,
  description: "Checkbox input with label, description, and indeterminate state support",
  category: "forms",
  defaults: {},
};

/**
 * Select item schema for options.
 */
export const SelectItemSchema = z.object({
  /** Display label */
  label: z.string(),
  /** Option value */
  value: z.string(),
  /** Optional description */
  description: z.string().optional(),
  /** Disabled option */
  disabled: z.boolean().optional(),
});

/**
 * Select component props schema.
 */
export const SelectPropsSchema = z.object({
  /** Selected value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Placeholder text when no selection */
  placeholder: z.string().optional(),
  /** Select options */
  items: z.array(SelectItemSchema).optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Size variant */
  size: FormSize.optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Full width select */
  fullwidth: z.boolean().optional(),
  /** Ghost style */
  ghost: z.boolean().optional(),
});

export type SelectProps = z.infer<typeof SelectPropsSchema>;

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

/**
 * Switch component props schema.
 */
export const SwitchPropsSchema = z.object({
  /** Checked state (controlled) */
  checked: z.boolean().optional(),
  /** Default checked state (uncontrolled) */
  defaultChecked: z.boolean().optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Field name for forms */
  name: z.string().optional(),
  /** Reverse label/switch order */
  reversed: z.boolean().optional(),
  /** Add border around the field */
  bordered: z.boolean().optional(),
});

export type SwitchProps = z.infer<typeof SwitchPropsSchema>;

export const SwitchEntry: ComponentEntry<typeof SwitchPropsSchema> = {
  name: "Switch",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: SwitchPropsSchema,
  description: "Toggle switch with label and description support",
  category: "forms",
  defaults: {},
};

