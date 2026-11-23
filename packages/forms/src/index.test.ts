import { describe, expect, expectTypeOf, it } from "vitest";

import * as forms from "./index";

describe("forms barrel", () => {
  it("exports the select compound API", () => {
    const parts = [
      "SelectRoot",
      "SelectTrigger",
      "SelectPortal",
      "SelectBackdrop",
      "SelectPositioner",
      "SelectPopup",
      "SelectList",
      "SelectItem",
      "SelectValue",
      "SelectIcon",
      "SelectGroup",
      "SelectGroupLabel",
      "SelectSeparator",
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
    expect(forms).toHaveProperty("hasInputSlots");
  });

  it("exports the InputMask type", () => {
    expectTypeOf<forms.InputMask<number>>().toEqualTypeOf<{
      attach(element: HTMLInputElement): () => void;
      format(value: number): string;
      parse(masked: string): number;
      inputMode?: "decimal" | "numeric";
    }>();
  });

  it("exports the number mask factories and keeps the engine internal", () => {
    expect(forms).toHaveProperty("currencyMask");
    expect(forms).toHaveProperty("percentMask");
    expect(forms).toHaveProperty("numberMask");
    expect(forms).not.toHaveProperty("visibleToReact");
    expect(Object.keys(forms).filter((name) => /maskito/i.test(name))).toEqual(
      [],
    );
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

  it("exports the slider label part", () => {
    expect(forms).toHaveProperty("SliderLabel");
  });

  it("exports useMask but keeps its sub-hooks internal", () => {
    expect(forms).toHaveProperty("useMask");
    for (const hook of [
      "useMaskPattern",
      "useMaskValue",
      "useMaskValidation",
      "useMaskHandlers",
    ]) {
      expect(forms, `${hook} should stay internal`).not.toHaveProperty(hook);
    }
  });

  it("does not export component constants", () => {
    expect(forms).not.toHaveProperty("CHECKBOX_DEFAULT_SIZE");
    expect(forms).not.toHaveProperty("SELECT_DEFAULT_SIZE");
  });
});
