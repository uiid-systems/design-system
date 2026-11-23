# Mask Input

> A text input that formats a structured value as it is typed, such as a phone number, a date or an amount of money.

```tsx
import { MaskInput, phoneMask } from "@uiid/design-system";

<MaskInput mask={phoneMask} label="Phone number" />;
```

MaskInput is [`Input`](../input/README.md) with a required `mask`, and adds nothing else. `<MaskInput mask={phoneMask} />` and `<Input mask={phoneMask} />` are the same thing; MaskInput exists so a masked field reads as one at a glance. Every other prop is Input's: `label`, `description`, `before`/`after` slots, `size`, `variant`, `fullwidth`, the palette `color` tint, `FieldProps`, and the `required`/`disabled`/`readOnly` states.

Use MaskInput when you want to:

- Format a fixed shape with one of the pattern masks: `phoneMask`, `ssnMask`, `einMask`, `dateMask`, `timeMask`, `creditCardMask`, `creditCardExpiryMask`, `zipCodeMask`, `zipCodeExtendedMask`, `licensePlateMask`, `ipv4Mask`, `macAddressMask` and `isbnMask`
- Build a shape of your own with `patternMask("AA-####", { slots: { A: /[A-Z]/ } })`
- Format money, percentages and plain numbers in a locale with `currencyMask`, `percentMask` and `numberMask`
- Check the value with the validator each pattern mask ships, such as `isValidCreditCard`, through Field's `validate`

Each mask is its own import, so a page bundles only the masks it uses. A mask is a stable object: import it, or build it once at module scope or in `useMemo`. A new mask on every render is detached and attached on every render.

The value is the masked string everywhere: `value`, `defaultValue`, `onValueChange` and the submitted form all carry `(555) 555-5555`. Call `mask.format(...)` going in and `mask.parse(...)` coming out, so `phoneMask.parse("(555) 555-5555")` is `"5555555555"`.

Leave `value` unset and the input runs itself; pass `value` and `onValueChange` to drive it yourself. Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it, and the error replaces the `description` while it shows.

## Migrating from the old MaskInput

MaskInput used to run its own masking engine. It now renders Input, and the masks are imported values. What changes:

- **String keys are gone.** `mask="phone"` becomes `mask={phoneMask}`, imported from `@uiid/design-system` or `@uiid/forms`. A custom `MaskPattern` object becomes `patternMask(template, options)`, where `#` takes a digit only. The old `#` took whatever the pattern's `transform` let through, so a pattern that took letters needs a slot for them, as `patternMask("XXX-XXX", { slots: { X: /[\dA-Z]/ }, uppercase: true })`, or the letters are dropped. A pattern's `validate` moves to Field's `validate`. `mask="currency"` with `currency` and `locale` becomes `mask={currencyMask({ currency, locale, min: 0 })}`; a bare `mask="currency"` used USD, so it becomes `currencyMask({ currency: "USD", min: 0 })`. The `min: 0` keeps the old behaviour of taking no negative amounts, which `currencyMask` otherwise accepts. The old currency mask took up to two decimals, while `currencyMask` takes the currency's own count, so JPY takes none. The old mask also kept the decimals as typed, so `$5` stayed `$5`; `currencyMask` adds the currency's decimals when the field is left, so `$5` becomes `$5.00`, and that is the string the form submits. `mask="percentage"` took up to two decimals and checked 0 to 100; the closest equivalent is `mask={percentMask({ maximumFractionDigits: 2, min: 0, max: 100 })}`, since `percentMask()` takes no decimals and no range by default.
- **`mask` is required.** A field with no mask is an Input. `withoutMask` is gone: render an Input instead.
- **`validationMode` and `onValidate` are gone.** Pass the mask's validator to Field's `validate`, as `FieldProps={{ validate: (value) => (isValidCreditCard(String(value ?? "")) ? null : "Check the card number"), validationMode: "onBlur" }}`. The validators are `isValidPhone`, `isValidSsn`, `isValidEin`, `isValidDate`, `isValidTime`, `isValidCreditCard`, `isValidCreditCardExpiry`, `isValidZipCode`, `isValidZipCodeExtended`, `isValidLicensePlate`, `isValidIpv4`, `isValidMacAddress` and `isValidIsbn`.
- **`onValueChange` has Input's signature.** It is called with the masked string and Base UI's event details, not with the masked and unmasked strings. Read the unmasked value with `mask.parse(value)`.
- **`maskPlaceholder` is gone.** Put a format hint such as `MM/DD/YYYY` in `description`, which stays visible while typing and is announced with the field. A `placeholder` disappears at the first keystroke.
- **`invalid`, `currency` and `locale` are gone as props.** Mark a field invalid through `FieldProps={{ invalid: true }}` or a Form's `errors`. An `invalid` left in untyped code is not just ignored: it is passed down to the `<input>` rather than to Field, so the field gets no `aria-invalid`. The currency and locale are options of the number mask.
- **`min` and `max` are options of the number masks.** On MaskInput they are only the native `<input>` attributes. The old engine only reported the range to `onValidate`, for percentage; pass `min` and `max` to `currencyMask`, `percentMask` or `numberMask` instead, which clamp the value to the range.
- **The `useMask` hook and the `*Pattern` objects (`phonePattern`, `MASK_PATTERNS` and the rest) are gone,** along with the `MaskPattern`, `MaskPatternKey`, `CurrencySymbols`, `TransformOptions`, `ValidateOptions` and `InputElement` types. `MaskInputColor` is replaced by `InputColor`, the same palette hue.
- **The input's `data-slot` is `input`,** as on Input, not `mask-input`. It no longer carries `data-readonly` or `data-required`; select on `:read-only` and `:required` instead.
- **An unmasked `defaultValue` is shown as given.** `defaultValue="5555555555"` shows `5555555555`, not `(555) 555-5555`. Format it first, as `defaultValue={phoneMask.format("5555555555")}`.
- **Backspace and Delete step over a literal before they delete.** With the caret before the `-` of `(123) 456-7890`, the first Delete moves past the `-` and the second deletes the `7`. With the caret after the `-`, the first Backspace moves before it and the second deletes the `6`. The old engine deleted the digit at once in both cases.
- **A paste mid-value leaves the caret after the pasted digits,** not at the end of the value.
- **`ipv4Mask` takes any group of one to three digits,** and a dot is typed, not written by the mask. Twelve bare digits are no longer turned into an address: the fourth digit of a group is dropped.
- **`isValidIpv4` needs all four groups** and refuses a leading zero and a group past 255. The old check passed a partial address and leading zeros.
- **A pasted `+1` phone number reads the 1 as a digit,** as before: the mask has no notion of a country code.
- **The card mask holds 16 digits,** in groups of four, as before. A 19-digit card cannot be typed, while `isValidCreditCard` accepts 13 to 19 digits.

Additional props are forwarded to the underlying `<input>` element.
