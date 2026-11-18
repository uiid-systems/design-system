# Mask Input

> A text input that formats as you type and hands back both readings — the masked string to display and the raw value to send.

Use MaskInput when you want to:

- Format a structured value while it is being typed — `mask` takes one of the built-in pattern keys (`phone`, `ssn`, `date`, `time`, `creditCard`, `creditCardExpiry`, `zipCode`, `zipCodeExtended`, `currency`, `percentage`, `licensePlate`, `ipv4`, `macAddress`, `isbn`, `ein`) or a `MaskPattern` object of your own
- Read both values from `onValueChange`, which is called with the masked string and the unmasked one
- Show the shape of the value with `maskPlaceholder` — it appears once the input has focus, so the resting `placeholder` can stay plain language
- Format currency through `Intl` with `currency` and `locale`
- Check the value against the pattern's own rule with `onValidate` — Luhn for credit cards, a real month for expiry dates — and choose when with `validationMode`
- Turn formatting off without swapping the component out, using `withoutMask`

Everything [`Input`](../input/README.md) offers is here too: `label`, `description`, `before`/`after` slots, `size`, `variant`, `fullwidth`, the palette `color` tint, and the `required`/`disabled`/`readOnly` states.

Leave `value` unset and the input runs itself; pass `value` and `onValueChange` to drive it yourself. Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it; `FieldProps` is where `errorType` lives.

A native `onChange` works too, so the props a form library's `register()` returns can be spread straight on. It runs on each change event, just before `onValueChange`, and `event.target.value` is the masked string on display. It follows the native event, so it does not run where the mask cancels the browser's default and writes the value itself: a paste into a pattern mask, a single-character Backspace or Delete in a pattern mask, and the commit at the end of an IME composition. `onValueChange` reports all of those.

Additional props are forwarded to the underlying `<input>` element.
