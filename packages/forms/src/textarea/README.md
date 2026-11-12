# Textarea

> Multi-line text control. Same label, description, sizing, and validity behavior as [`Input`](../input/README.md), with a resize axis.

Use Textarea when you want to:

- Collect more than one line of text — `rows` sets the starting height (3 by default)
- Label it inline with `label`, `description`, and `action` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — this sets the type scale, padding, and a `min-height` rather than a fixed height, so `rows` and the resize handle still grow it
- Constrain the drag handle with `resize` (`vertical` by default, `none`, `horizontal`, `both`)
- Put a row of chips above the text or a row of tools and a submit button below it with `before` and `after` — both sit inside the field surface, so they share its edge, focus ring, and tint
- Soften the surface with `variant="ghost"` or fill the container with `fullwidth`
- Tint the surface with a palette `color` (`red`, `blue`, …) — the same treatment Input wears, so a tinted pair cannot drift apart
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the textarea runs itself; pass `value` and `onValueChange` to drive it yourself. `onValueChange` receives the string first, not an event, with Base UI's change details second.

Native `<textarea>` props (`name`, `value`, `defaultValue`, `onChange`, `onBlur`, `maxLength`, `readOnly`, …) and `ref` land on the element itself, with or without slots, so react-hook-form's `register` spreads straight on: `<Textarea label="Notes" {...register("notes")} />`.

`required` marks the label and the textarea itself. `disabled` reaches the field around it too, so the label and description dim with the control.

Validity comes from the surrounding [`Form`](../form/README.md) or [`Field`](../field/README.md) — give it a `name` and a `Form` publishes the matching entry of its `errors` map onto it. Reach the field around it through `FieldProps`, which is where `errorType`, `validate`, and `validationMode` live. An error owned somewhere else arrives the same way: `FieldProps={{ invalid: true, ErrorProps: { match: true, children: message } }}` turns the textarea red and shows the message beneath it.

`before` and `after` are the same slots Input has, stacked instead of placed beside the control. With either set, the surface moves to an [`InputWrapper`](../input/README.md) in its vertical orientation, which takes `fullwidth`, `variant`, and `color`; the textarea keeps `size` and `resize`, and `ref`, `className`, `rows`, and the native props still land on the `<textarea>`. With neither slot set, nothing changes, and a slot coming or going keeps the textarea mounted with its focus and text.

The wrapper reads disabled and invalid off the textarea and nothing deeper, so a disabled Send button or an invalid input in a slot leaves the field alone. A `Button` or other control in a slot takes its own press, and slot controls keep their DOM order: a control in `before` precedes the textarea in tab order, one in `after` follows it. Pressing plain text, an icon, or empty space in a slot row focuses the textarea, the same as Input. While the textarea is `disabled`, the slots are `inert`, so their buttons leave the tab order with it.

`resize` drags the textarea, not the wrapper around it, so a composer with a toolbar usually wants `resize="none"`.

Base UI ships no Textarea primitive, so this adopts a `<textarea>` into `Field.Control`. The DOM surface is textarea-native — additional props are forwarded to the element itself — with `onValueChange` taken from `Field.Control`.
