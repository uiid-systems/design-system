import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { describe, expect, it } from "vitest";

/**
 * The shared popup layer renders Base UI's combobox parts for both Combobox and
 * Autocomplete. That is only sound because upstream ships one implementation
 * for both namespaces. If a future Base UI release forks them, these assertions
 * fail and the shared layer has to grow a real abstraction.
 */
describe("popup layer upstream identity", () => {
  const shared = [
    "Portal",
    "Positioner",
    "Popup",
    "List",
    "Item",
    "Empty",
  ] as const;

  for (const part of shared) {
    it(`Autocomplete.${part} is the same component as Combobox.${part}`, () => {
      expect(BaseAutocomplete[part]).toBe(BaseCombobox[part]);
    });
  }

  it("Root and Value are the parts that genuinely differ", () => {
    expect(BaseAutocomplete.Root).not.toBe(BaseCombobox.Root);
    expect(BaseAutocomplete.Value).not.toBe(BaseCombobox.Value);
  });
});
