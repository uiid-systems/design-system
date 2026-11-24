// @vitest-environment node
import { describe, expect, expectTypeOf, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as forms from "./index";

// Components, their parts and their prop types, plus the masks Input takes and
// the validators beside them. Constants, variant functions, the input surface
// class helpers, the field `required` context and the form state hooks are
// internal.
const values = [
  // Autocomplete
  "Autocomplete",
  "AutocompleteClear",
  "AutocompleteEmpty",
  "AutocompleteGroup",
  "AutocompleteGroupLabel",
  "AutocompleteIcon",
  "AutocompleteInput",
  "AutocompleteInputGroup",
  "AutocompleteItem",
  "AutocompleteList",
  "AutocompletePopup",
  "AutocompletePortal",
  "AutocompletePositioner",
  "AutocompleteRoot",
  "AutocompleteStatus",
  "AutocompleteTrigger",
  "AutocompleteValue",
  // Checkbox and CheckboxGroup
  "Checkbox",
  "CheckboxField",
  "CheckboxGroup",
  "CheckboxGroupRoot",
  "CheckboxIndicator",
  "CheckboxRoot",
  // Combobox
  "Combobox",
  "ComboboxChip",
  "ComboboxChipRemove",
  "ComboboxChips",
  "ComboboxClear",
  "ComboboxEmpty",
  "ComboboxGroup",
  "ComboboxGroupLabel",
  "ComboboxIcon",
  "ComboboxInput",
  "ComboboxInputGroup",
  "ComboboxItem",
  "ComboboxList",
  "ComboboxPopup",
  "ComboboxPortal",
  "ComboboxPositioner",
  "ComboboxRoot",
  "ComboboxStatus",
  "ComboboxTrigger",
  "ComboboxValue",
  // Field
  "Field",
  "FieldAction",
  "FieldControl",
  "FieldDescription",
  "FieldError",
  "FieldHint",
  "FieldItem",
  "FieldLabel",
  "FieldRoot",
  "FieldRow",
  "FieldValidity",
  // Form
  "Form",
  // Input and MaskInput
  "Input",
  "InputControl",
  "InputWrapper",
  "MaskInput",
  // NumberField
  "NumberField",
  "NumberFieldDecrement",
  "NumberFieldGroup",
  "NumberFieldIncrement",
  "NumberFieldInput",
  "NumberFieldRoot",
  "NumberFieldScrubArea",
  "NumberFieldScrubAreaCursor",
  // Radio and RadioGroup
  "Radio",
  "RadioGroup",
  "RadioGroupRoot",
  "RadioIndicator",
  "RadioRoot",
  // Select
  "Select",
  "SelectBackdrop",
  "SelectGroup",
  "SelectGroupLabel",
  "SelectIcon",
  "SelectItem",
  "SelectList",
  "SelectPopup",
  "SelectPortal",
  "SelectPositioner",
  "SelectRoot",
  "SelectSeparator",
  "SelectTrigger",
  "SelectValue",
  // Slider
  "Slider",
  "SliderControl",
  "SliderIndicator",
  "SliderLabel",
  "SliderRoot",
  "SliderThumb",
  "SliderTrack",
  "SliderValue",
  // Switch
  "Switch",
  "SwitchField",
  "SwitchRoot",
  "SwitchThumb",
  // Textarea
  "Textarea",
  // ToggleGroup, and the Toggle it clones
  "Toggle",
  "ToggleGroup",
  // The masks Input takes, and the validators for the fixed patterns
  "creditCardExpiryMask",
  "creditCardMask",
  "currencyMask",
  "dateMask",
  "einMask",
  "ipv4Mask",
  "isValidCreditCard",
  "isValidCreditCardExpiry",
  "isValidDate",
  "isValidEin",
  "isValidIpv4",
  "isValidIsbn",
  "isValidLicensePlate",
  "isValidMacAddress",
  "isValidPhone",
  "isValidSsn",
  "isValidTime",
  "isValidZipCode",
  "isValidZipCodeExtended",
  "isbnMask",
  "licensePlateMask",
  "macAddressMask",
  "numberMask",
  "patternMask",
  "percentMask",
  "phoneMask",
  "ssnMask",
  "timeMask",
  "zipCodeExtendedMask",
  "zipCodeMask",
];

const types = [
  // Autocomplete
  "AutocompleteClearProps",
  "AutocompleteColor",
  "AutocompleteEmptyProps",
  "AutocompleteGroupLabelProps",
  "AutocompleteGroupProps",
  "AutocompleteIconProps",
  "AutocompleteInputGroupProps",
  "AutocompleteInputProps",
  "AutocompleteItemProps",
  "AutocompleteListProps",
  "AutocompletePopupProps",
  "AutocompletePortalProps",
  "AutocompletePositionerProps",
  "AutocompleteProps",
  "AutocompleteRootProps",
  "AutocompleteStatusProps",
  "AutocompleteTriggerProps",
  "AutocompleteValueProps",
  // Checkbox and CheckboxGroup
  "CheckboxColor",
  "CheckboxFieldProps",
  "CheckboxGroupProps",
  "CheckboxGroupRootProps",
  "CheckboxIndicatorProps",
  "CheckboxProps",
  "CheckboxRootProps",
  "CheckboxVariants",
  // Combobox
  "ComboboxChipProps",
  "ComboboxChipRemoveProps",
  "ComboboxChipsProps",
  "ComboboxClearProps",
  "ComboboxColor",
  "ComboboxEmptyProps",
  "ComboboxGroupLabelProps",
  "ComboboxGroupProps",
  "ComboboxIconProps",
  "ComboboxInputGroupProps",
  "ComboboxInputProps",
  "ComboboxItemProps",
  "ComboboxListProps",
  "ComboboxPopupProps",
  "ComboboxPortalProps",
  "ComboboxPositionerProps",
  "ComboboxProps",
  "ComboboxRootProps",
  "ComboboxStatusProps",
  "ComboboxTriggerProps",
  "ComboboxValueProps",
  // Masks
  "CurrencyMaskOptions",
  // Field
  "FieldActionProps",
  "FieldControlProps",
  "FieldDescriptionProps",
  "FieldErrorProps",
  "FieldHintProps",
  "FieldHintValue",
  "FieldItemProps",
  "FieldLabelProps",
  "FieldProps",
  "FieldRootProps",
  "FieldRowProps",
  "FieldRowVariants",
  "FieldValidityProps",
  "FieldVariants",
  // The item shape CheckboxGroup and RadioGroup take, and Form
  "FormItemProps",
  "FormProps",
  // Input and MaskInput
  "InputColor",
  "InputControlProps",
  "InputMask",
  "InputProps",
  "InputVariants",
  "InputWrapperProps",
  "InputWrapperVariants",
  "MaskInputProps",
  // NumberField
  "NumberFieldColor",
  "NumberFieldDecrementProps",
  "NumberFieldGroupProps",
  "NumberFieldIncrementProps",
  "NumberFieldInputProps",
  "NumberFieldProps",
  "NumberFieldRootProps",
  "NumberFieldScrubAreaCursorProps",
  "NumberFieldScrubAreaProps",
  "NumberFieldVariants",
  // Masks
  "NumberMaskOptions",
  "PatternMaskOptions",
  "PercentMaskOptions",
  // Radio and RadioGroup
  "RadioColor",
  "RadioGroupProps",
  "RadioGroupRootProps",
  "RadioIndicatorProps",
  "RadioProps",
  "RadioRootProps",
  "RadioVariants",
  // Select
  "SelectBackdropProps",
  "SelectColor",
  "SelectGroupLabelProps",
  "SelectGroupProps",
  "SelectIconProps",
  "SelectItemProps",
  "SelectListProps",
  "SelectMultipleMode",
  "SelectPopupProps",
  "SelectPortalProps",
  "SelectPositionerProps",
  "SelectProps",
  "SelectRootProps",
  "SelectSeparatorProps",
  "SelectTriggerProps",
  "SelectValueProps",
  // Slider
  "SliderColor",
  "SliderControlProps",
  "SliderIndicatorProps",
  "SliderLabelProps",
  "SliderProps",
  "SliderRootProps",
  "SliderThumbProps",
  "SliderTrackProps",
  "SliderValueProps",
  "SliderVariants",
  // Switch
  "SwitchColor",
  "SwitchFieldProps",
  "SwitchProps",
  "SwitchRootProps",
  "SwitchThumbProps",
  "SwitchVariants",
  // Textarea
  "TextareaColor",
  "TextareaProps",
  "TextareaResize",
  "TextareaVariants",
  // ToggleGroup, and the Toggle it clones
  "ToggleChangeEventDetails",
  "ToggleGroupProps",
  "ToggleGroupVariants",
  "ToggleProps",
  "ToggleState",
];

describe("@uiid/forms barrel", () => {
  it("exports exactly the components, parts, masks and validators", () => {
    expect(Object.keys(forms).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });

  it("exports the InputMask type", () => {
    expectTypeOf<forms.InputMask<number>>().toEqualTypeOf<{
      attach(element: HTMLInputElement): () => void;
      format(value: number): string;
      parse(masked: string): number;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    }>();
  });

  it("types the number mask factories by their options", () => {
    expectTypeOf(forms.currencyMask)
      .parameter(0)
      .toEqualTypeOf<forms.CurrencyMaskOptions>();
    expectTypeOf(forms.percentMask)
      .parameter(0)
      .toEqualTypeOf<forms.PercentMaskOptions | undefined>();
    expectTypeOf(forms.numberMask)
      .parameter(0)
      .toEqualTypeOf<forms.NumberMaskOptions | undefined>();
    expectTypeOf(forms.currencyMask).returns.toEqualTypeOf<
      forms.InputMask<number | null>
    >();
  });

  it("types patternMask, the pattern masks and their validators", () => {
    expectTypeOf(forms.patternMask)
      .parameter(1)
      .toEqualTypeOf<forms.PatternMaskOptions | undefined>();
    expectTypeOf(forms.patternMask).returns.toEqualTypeOf<
      forms.InputMask<string>
    >();
    expectTypeOf(forms.phoneMask).toEqualTypeOf<forms.InputMask<string>>();
    expectTypeOf(forms.isValidCreditCard).toEqualTypeOf<
      (value: string) => boolean
    >();
  });

  /* Base UI's `Toggle` namespace does not survive the typed alias, so its
     members are served under plain names, with `className` a string. */
  it("serves Toggle's types by name, with a string className", () => {
    expectTypeOf<forms.ToggleProps["className"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<forms.ToggleState>().toHaveProperty("pressed");
    expectTypeOf<
      Parameters<NonNullable<forms.ToggleProps["onPressedChange"]>>[1]
    >().toEqualTypeOf<forms.ToggleChangeEventDetails>();
  });

  /* The FieldProps slot each control takes stays nameable through the
     control's own props, without the generic helper that builds it. */
  it("names a control's FieldProps slot through its props", () => {
    expectTypeOf<
      NonNullable<forms.InputProps["FieldProps"]>
    >().not.toHaveProperty("label");
    expectTypeOf<NonNullable<forms.InputProps["FieldProps"]>>().toHaveProperty(
      "RootProps",
    );
  });
});
