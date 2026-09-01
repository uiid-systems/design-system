# Textarea

> Multi-line text control. Same label, description, sizing, and validity behavior as [`Input`](../input/README.md), with a resize axis.

Use Textarea when you want to:

- Collect more than one line of text — `rows` sets the starting height
- Label it inline with `label` and `description` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — this sets the type scale and padding, independently of `rows`
- Constrain the drag handle with `resize` (`none`, `vertical`, `horizontal`, `both`)
- Soften the surface with `variant="ghost"` or fill the container with `fullwidth`
- Tint the surface with a palette `color` (`red`, `blue`, …) — the same treatment Input wears, so a tinted pair cannot drift apart
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the textarea runs itself; pass `value` and `onValueChange` to drive it yourself.

Validity comes from the surrounding [`Form`](../form/README.md) or [`Field`](../field/README.md) — give it a `name` and a `Form` publishes the matching entry of its `errors` map onto it. Reach the field around it through `FieldProps`, which is where `errorType` lives.

Base UI ships no Textarea primitive, so this adopts a `<textarea>` into `Field.Control`. The DOM surface is textarea-native — additional props are forwarded to the element itself — with `onValueChange` taken from `Field.Control`.
