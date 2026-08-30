import { describe, expect, it } from "vitest";

import * as forms from "./index";

describe("forms barrel", () => {
  it("exports the select compound API", () => {
    const parts = [
      "SelectRoot",
      "SelectTrigger",
      "SelectPortal",
      "SelectPositioner",
      "SelectPopup",
      "SelectList",
      "SelectItem",
      "SelectValue",
      "SelectIcon",
    ] as const;

    for (const part of parts) {
      expect(forms, `${part} should be exported`).toHaveProperty(part);
    }
  });

  it("exports the radio compound API", () => {
    expect(forms).toHaveProperty("RadioRoot");
    expect(forms).toHaveProperty("RadioIndicator");
  });

  it("exports the input compound API", () => {
    expect(forms).toHaveProperty("InputControl");
    expect(forms).toHaveProperty("InputWrapper");
  });

  it("exports the combobox part coverage", () => {
    const parts = [
      "ComboboxInputGroup",
      "ComboboxTrigger",
      "ComboboxClear",
      "ComboboxIcon",
      "ComboboxValue",
      "ComboboxStatus",
      "ComboboxGroup",
      "ComboboxGroupLabel",
      "ComboboxChips",
      "ComboboxChip",
      "ComboboxChipRemove",
    ] as const;

    for (const part of parts) {
      expect(forms, `${part} should be exported`).toHaveProperty(part);
    }
  });

  it("no longer exports the invented ComboboxActionButtons", () => {
    expect(forms).not.toHaveProperty("ComboboxActionButtons");
  });

  it("exports the autocomplete part coverage", () => {
    const parts = [
      "AutocompleteInputGroup",
      "AutocompleteTrigger",
      "AutocompleteClear",
      "AutocompleteIcon",
      "AutocompleteValue",
      "AutocompleteStatus",
      "AutocompleteGroup",
      "AutocompleteGroupLabel",
    ] as const;

    for (const part of parts) {
      expect(forms, `${part} should be exported`).toHaveProperty(part);
    }
  });

  it("exports the number-field part coverage", () => {
    const parts = [
      "NumberFieldGroup",
      "NumberFieldInput",
      "NumberFieldScrubArea",
      "NumberFieldScrubAreaCursor",
    ] as const;

    for (const part of parts) {
      expect(forms, `${part} should be exported`).toHaveProperty(part);
    }
  });

  it("exports the checkbox-group compound API", () => {
    expect(forms).toHaveProperty("CheckboxGroupRoot");
  });

  it("exports the radio-group compound API", () => {
    expect(forms).toHaveProperty("RadioGroupRoot");
  });

  it("does not export component constants", () => {
    expect(forms).not.toHaveProperty("CHECKBOX_DEFAULT_SIZE");
    expect(forms).not.toHaveProperty("SELECT_DEFAULT_SIZE");
  });
});
