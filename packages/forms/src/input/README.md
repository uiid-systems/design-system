# Input

> The standard text control. Pass `label` and `description` and it builds its own [`Field`](../field/README.md); pass neither and it renders bare.

Use Input when you want to:

- Collect a single line of text — `type` is forwarded, so `email`, `password`, `search`, and `url` all work
- Label it inline with `label`, `description`, and `action` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`), which sets the height, font size, and padding, and scales the field's chrome to match
- Put an icon, a unit, or a button inside the control with `before` and `after`
- Soften the surface with `variant="ghost"` (no fill or border at rest) or fill the container with `fullwidth`
- Tint the surface with a palette `color` (`red`, `blue`, …) — background, border, and text all resolve from the one hue, and an invalid input keeps its tint while the edge turns red
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the input runs itself; pass `value` and `onValueChange` to drive it yourself. `onValueChange` receives the string first, not an event, with Base UI's change details second.

Native `<input>` props (`name`, `value`, `defaultValue`, `onChange`, `onBlur`, `maxLength`, `autoComplete`, …) and `ref` land on the element itself, with or without slots, so react-hook-form's `register` spreads straight on: `<Input label="Email" {...register("email")} />`.

`required` marks the label and the input itself. `disabled` reaches the field around it too, so the label and description dim with the control.

Validity comes from the surrounding [`Form`](../form/README.md) or `Field` — give the input a `name` and a `Form` publishes the matching entry of its `errors` map onto it. Reach the field around it through `FieldProps`, which is where `validate` and `validationMode` live. The error replaces the `description` while it shows. An error owned somewhere else, such as a form library or a server response, arrives the same way: `FieldProps={{ invalid: true, ErrorProps: { match: true, children: message } }}` turns the input red and shows the message in the description's place. Input owns `label`, `description`, `action`, `name`, `required`, `disabled`, and `size`, so `FieldProps` doesn't take them a second time.

For a shared label over several controls, wrap them in a `Field` and let each keep its own `name`. To format text as it is typed, pass a `mask`, as described under Masks below. For numbers use [`NumberField`](../number-field/README.md), and for multiple lines [`Textarea`](../textarea/README.md).

`before` and `after` render through `InputWrapper`, which is exported on its own for composing the same slotted surface around another control. Its `orientation` prop (`horizontal` by default) places the slots beside the control; `vertical` stacks them above and below it, which is how [`Textarea`](../textarea/README.md) gets its slots. The wrapper carries `size`, `fullwidth`, `variant`, and `color` in both orientations, and owns the border, background, focus ring, and invalid and disabled treatments. Its size tiers publish `--input-wrapper-height` and `--input-wrapper-padding-x`, which the slots and the inner control read, so all three share one size source. With neither slot it stays mounted as a `display: contents` box that paints nothing, so the control keeps its node, focus, and text as a slot comes or goes. It does not strip anything from the control it wraps: pass `inner` to `InputControl` when `hasInputSlots({ before, after })` is true, as Input does, so the control paints no surface of its own.

The wrapper reads disabled and invalid off the control it holds and nothing deeper, so a disabled button or an invalid input inside a slot leaves the field alone. An icon in a slot takes the field's icon size and a muted color; a `Button` in a slot keeps its own icon size.

Pressing plain slot content or the wrapper's padding focuses the control, as a press on a bare input would. A press on a real control in a slot (a button, link, input, or anything with `tabindex`) stays with that control. Slot controls keep their DOM order: a control in `before` precedes the input in tab order, one in `after` follows it. Pass `disabled` to the wrapper, as Input does, to make the slots `inert` so their content leaves the tab order with the field.

`InputControl` is the `<input>` on its own, with no field chrome and no slots: reach for it when composing a `Field` by hand. It is Base UI's `Input`, a `Field.Control`, so inside a `Field` it takes the field's `name` and `disabled`, falls back to its `required`, and is labelled and described by it. It takes the same `size`, `variant`, `fullwidth`, and `color` as Input. A composite whose Base UI root already registers its own control should style a plain `<input>` with `inputControlClassName` instead, or the value submits twice.

Additional props are forwarded to the underlying Base UI [Input](https://base-ui.com/react/components/input). `size` is the one deliberate exception: it is the system-wide control scale, not the native character-width attribute, so set a width with `fullwidth` or a `className`.

## Masks

`mask` formats the text as it is typed. [`MaskInput`](../mask-input/README.md) is the same Input with `mask` required; its README has the guide for moving off the old MaskInput.

- **Number masks:** `currencyMask({ currency, locale })`, `percentMask()` and `numberMask()`, all taking `locale`, `min`, `max`, and the last two `maximumFractionDigits`. Symbols, separators and decimal counts come from `Intl.NumberFormat`.
- **Pattern masks:** `phoneMask`, `ssnMask`, `einMask`, `dateMask`, `timeMask`, `creditCardMask`, `creditCardExpiryMask`, `zipCodeMask`, `zipCodeExtendedMask`, `licensePlateMask`, `ipv4Mask`, `macAddressMask` and `isbnMask`, each with an `isValid*` validator for Field's `validate`.
- **A mask is a stable object.** Import it, or build it once at module scope or in `useMemo`. Input attaches the mask when it mounts and re-attaches whenever it receives a different mask object, so a mask built during render is torn down and attached again on every render.

### The value contract

- The value is the masked string everywhere: `value`, `defaultValue`, `onValueChange`, a form library's `onChange`, and the submitted form all carry `$1,234.50` or `(555) 123-4567`.
- Call `mask.format(...)` going in and `mask.parse(...)` coming out. The number masks parse to a number, or `null` for an empty field. The pattern masks parse to the characters typed without the literals, so `phoneMask.parse("(555) 123-4567")` is `"5551234567"`.
- An unmasked `defaultValue` or `value` is shown as given: `defaultValue="5555555555"` shows `5555555555` until the next edit. Pass `phoneMask.format("5555555555")` instead.
- `percentMask` reads the number as shown: `parse("50%")` is `50`, not `0.5`, and `format(50)` is `50%`.
- Pasted text is read in the field's locale: `1.234,56` pasted into a de-DE EUR field is 1234.56, and `$1,234.56` pasted into a USD field is 1234.56.

```tsx
const usd = currencyMask({ currency: "USD", min: 0 });

export const MaskedCurrency = () => {
  const [masked, setMasked] = useState(usd.format(1234.5));

  return (
    <Stack gap={3}>
      <Input
        mask={usd}
        label="Price"
        value={masked}
        onValueChange={setMasked}
      />
      <Text size={-1} emphasis="muted">
        Parsed: {String(usd.parse(masked))}
      </Text>
    </Stack>
  );
};
```

```tsx
const discount = percentMask({ min: 0, max: 100 });

export const MaskedPercent = () => (
  <Input mask={discount} label="Discount" defaultValue={discount.format(50)} />
);
```

```tsx
const quantity = numberMask({ min: 0 });

export const MaskedNumber = () => (
  <Input
    mask={quantity}
    label="Quantity"
    defaultValue={quantity.format(1200)}
  />
);
```

```tsx
export const MaskedPattern = () => (
  <Stack gap={4}>
    <Input mask={phoneMask} label="Phone number" autoComplete="tel" />
    <Input mask={dateMask} label="Date of birth" description="MM/DD/YYYY" />
  </Stack>
);
```

- Put a format hint such as `MM/DD/YYYY` in `description`, not `placeholder`: a description stays visible while typing and is announced with the field.
- A mask sets only `inputMode`, the virtual keyboard to ask for. Set `autoComplete` yourself, such as `tel`, `cc-number`, or `off` for a Social Security number.

### With react-hook-form

`register` spreads straight on, and its `onChange` reads `event.target.value`, which is the masked text, so the form holds the masked string and `parse` runs at submit:

```tsx
import { useForm } from "react-hook-form";

const usd = currencyMask({ currency: "USD", min: 0 });

function PriceForm({ onSave }: { onSave: (price: number | null) => void }) {
  const { register, handleSubmit } = useForm<{ price: string }>();

  return (
    <form onSubmit={handleSubmit(({ price }) => onSave(usd.parse(price)))}>
      <Input mask={usd} label="Price" {...register("price")} />
    </form>
  );
}
```

react-hook-form is not a dependency of this package, so this block has no runnable twin. The `MaskedRegister` example wires the same shape `register` returns, `{ name, onChange, onBlur, ref }`, by hand:

```tsx
export const MaskedRegister = () => {
  const [value, setValue] = useState("");
  const registered = {
    name: "phone",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    onBlur: () => {},
    ref: () => {},
  };

  return (
    <Stack gap={3}>
      <Input mask={phoneMask} label="Phone number" {...registered} />
      <Text size={-1} emphasis="muted">
        Form value: {value || "—"}
      </Text>
    </Stack>
  );
};
```

### Writing a mask

`patternMask(template, options)` builds a mask for text of a fixed shape. Each `#` in the template takes one digit, each key of `slots` takes one character its pattern matches, and every other character is a literal the mask writes once a character follows it. Characters no slot takes are dropped, and nothing goes past the end of the template. `uppercase: true` uppercases typed and pasted text before the slots test it. The keyboard defaults to `numeric` for a template of `#` only, and to none once `slots` names any; pass `inputMode` to choose one.

```tsx
const orderNumber = patternMask("AA-####", {
  slots: { A: /[A-Z]/ },
  uppercase: true,
});

export const CustomMask = () => (
  <Input
    mask={orderNumber}
    label="Order number"
    description="Two letters, then four digits"
  />
);
```

`orderNumber.parse("AB-1234")` is `"AB1234"`. For a shape no template expresses, any object with `attach(element)` returning a cleanup, `format`, `parse` and an optional `inputMode` is an `InputMask`; see the `InputMask` type.

### Behaviour to know

- A character that matches the locale's grouping separator is read as grouping, not as a decimal. In a de-DE EUR field, typing `1234.5` gives `12.345 €`, which parses as 12345; type `1234,5` for `1.234,5 €`. In en-US a typed comma groups the same way. This is Maskito's behaviour and is kept on purpose: the library does not work around its dependencies.
- `currencyMask` accepts negative amounts unless given `min: 0`.
- `currencyMask` pads the currency's decimals when the field is left, so `$5` becomes `$5.00`. Padding happens on blur only, so a form submitted with Enter before the field is left sends `$5`; `parse` reads both as 5.
- `min` and `max` on the number masks clamp the value rather than mark the field invalid. A positive value below `min` can still be typed, since it may be the start of a larger one, and is raised to `min` when the field is left. Use Field's `validate` to show a message.
- Digits are Latin only. A locale whose default numbering system is not Latin, such as `ar-EG`, is unsupported: the field shows Latin digits with that locale's separators, and `parse` reads no native-script digits.
- Backspace and Delete step over a literal or a group separator before they delete: with the caret after the `-` of `(123) 456-7890`, the first Backspace moves before it and the second deletes the `6`.
- `phoneMask` is a US template with no notion of a country code, so a pasted `+1 (555) 123-4567` reads the 1 as the first digit.
- `creditCardMask` holds 16 digits in groups of four, so a 19-digit card cannot be typed, while `isValidCreditCard` accepts 13 to 19 digits. Its Luhn checksum catches typos only and is no substitute for a server-side check.
- `ipv4Mask` accepts any group of one to three digits, so `999` or `001` stays as typed; `isValidIpv4` is what judges the address.
- Maskito keeps one piece of state shared by every masked field on the page, for its double-space handling, so the last masked value stays in memory until the next keystroke in any masked field.

### What is tested

- Chromium is the only engine tested, by the real-browser suite in CI (`pnpm test:run --config vitest.browser.config.ts`), alongside happy-dom unit tests.
- Firefox and WebKit are untested. The browser suite can run them locally with `VITEST_BROWSERS=firefox,webkit` once Playwright has their binaries; no such run has been recorded.
- Mobile virtual keyboards and IME composition are untested.
