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

MaskInput owns the value of its `<input>`, so a value written onto the element through `ref` is overwritten on the next render. react-hook-form applies `defaultValues`, `reset()` and `setValue()` that way, so hand those values to MaskInput's own `defaultValue` or `value` instead.

With that caveat, a native `onChange` reports the value too: spread the `name`, `ref`, `onBlur` and `onChange` a form library's `register()` returns and it tracks what the input shows. It is called once per edit that changes the value, just before `onValueChange`, and `event.target.value` is already the masked string; typing, deleting, cut and paste are all covered. While an IME composition is open the mask is suspended and `onChange` carries the text as composed, then runs once more with the masked value when the composition ends.

Additional props are forwarded to the underlying `<input>` element.
