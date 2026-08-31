import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach } from "vitest";

import * as Autocomplete from "./autocomplete/autocomplete.examples";
import * as CheckboxGroup from "./checkbox-group/checkbox-group.examples";
import * as Checkbox from "./checkbox/checkbox.examples";
import * as Combobox from "./combobox/combobox.examples";
import * as FieldEx from "./field/field.examples";
import * as FormEx from "./form/form.examples";
import * as Input from "./input/input.examples";
import * as MaskInput from "./mask-input/mask-input.examples";
import * as NumberField from "./number-field/number-field.examples";
import * as RadioGroup from "./radio-group/radio-group.examples";
import * as Radio from "./radio/radio.examples";
import * as Select from "./select/select.examples";
import * as Slider from "./slider/slider.examples";
import * as Switch from "./switch/switch.examples";
import * as Textarea from "./textarea/textarea.examples";
import * as ToggleGroup from "./toggle-group/toggle-group.examples";

const MODULES = {
  autocomplete: Autocomplete,
  checkbox: Checkbox,
  "checkbox-group": CheckboxGroup,
  combobox: Combobox,
  field: FieldEx,
  form: FormEx,
  input: Input,
  "mask-input": MaskInput,
  "number-field": NumberField,
  radio: Radio,
  "radio-group": RadioGroup,
  select: Select,
  slider: Slider,
  switch: Switch,
  textarea: Textarea,
  "toggle-group": ToggleGroup,
} as const;

afterEach(cleanup);

describe("examples render", () => {
  for (const [name, mod] of Object.entries(MODULES)) {
    for (const [exportName, Example] of Object.entries(mod)) {
      it(`${name}: ${exportName}`, () => {
        const Component = Example as React.ComponentType;
        expect(() => render(<Component />)).not.toThrow();
      });
    }
  }
});

describe("invalid examples surface their message", () => {
  const cases: [string, React.ComponentType, string][] = [
    ["input", Input.Invalid, "Enter a valid email address"],
    ["textarea", Textarea.Invalid, "Tell us a little more"],
    ["checkbox", Checkbox.Invalid, "You must accept the terms"],
    ["checkbox-group", CheckboxGroup.Invalid, "Choose at least one channel"],
    ["radio-group", RadioGroup.Invalid, "Choose a shipping speed"],
    ["switch", Switch.Invalid, "Turn this on to continue"],
    ["select", Select.Invalid, "Choose a typeface"],
    ["slider", Slider.Invalid, "Pick a value above 10"],
    ["number-field", NumberField.Invalid, "Enter a quantity of 1 or more"],
    ["mask-input", MaskInput.Invalid, "That card number was declined"],
    ["combobox", Combobox.Invalid, "Pick a fruit from the list"],
    ["autocomplete", Autocomplete.Invalid, "We don't stock that fruit"],
    ["field", FieldEx.Invalid, "Enter a valid email address"],
  ];

  for (const [name, Component, message] of cases) {
    it(`${name}`, () => {
      const { container } = render(<Component />);
      const matches = Array.from(
        container.querySelectorAll("[data-slot='field-error']"),
      ).filter((el) => el.textContent?.includes(message));
      expect(
        matches.length,
        `${name} rendered ${matches.length} error nodes`,
      ).toBe(1);
    });
  }
});

describe("form examples round trip", () => {
  it("publishes server errors onto the right fields", async () => {
    const user = userEvent.setup();
    render(<FormEx.UsernamePassword />);

    await user.type(screen.getByLabelText("Username"), "ab");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(
      () => {
        expect(
          screen.getByText("Use at least 3 characters"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Use at least 8 characters"),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("succeeds when the values pass", async () => {
    const user = userEvent.setup();
    render(<FormEx.UsernamePassword />);

    await user.type(screen.getByLabelText("Username"), "adamf");
    await user.type(screen.getByLabelText("Password"), "correcthorse");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(
      () => expect(screen.getByText("Account created.")).toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
  });

  it("reads a checkbox's checked state as a form value", async () => {
    const user = userEvent.setup();
    render(<FormEx.SelectAndConfirm />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: /Sans-serif/ }));
    await user.click(screen.getByRole("button", { name: "Save preferences" }));

    await waitFor(
      () =>
        expect(
          screen.getByText("Confirm your selection to continue"),
        ).toBeInTheDocument(),
      { timeout: 3000 },
    );
  });
});
