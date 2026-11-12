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

Validity comes from the surrounding [`Form`](../form/README.md) or `Field` — give the input a `name` and a `Form` publishes the matching entry of its `errors` map onto it. Reach the field around it through `FieldProps`, which is where `errorType` (`inline`, `tooltip`, `absolute`), `validate`, and `validationMode` live. An error owned somewhere else, such as a form library or a server response, arrives the same way: `FieldProps={{ invalid: true, ErrorProps: { match: true, children: message } }}` turns the input red and shows the message beneath it. Input owns `label`, `description`, `action`, `name`, `required`, `disabled`, and `size`, so `FieldProps` doesn't take them a second time.

For a shared label over several controls, wrap them in a `Field` and let each keep its own `name`. For a masked value use [`MaskInput`](../mask-input/README.md), for numbers [`NumberField`](../number-field/README.md), and for multiple lines [`Textarea`](../textarea/README.md).

`before` and `after` render through `InputWrapper`, which is exported on its own for composing the same slotted surface around another control. Its `orientation` prop (`horizontal` by default) places the slots beside the control; `vertical` stacks them above and below it, which is how [`Textarea`](../textarea/README.md) gets its slots. The wrapper carries `size`, `fullwidth`, `variant`, and `color` in both orientations, and owns the border, background, focus ring, and invalid and disabled treatments. Its size tiers publish `--input-wrapper-height` and `--input-wrapper-padding-x`, which the slots and the inner control read, so all three share one size source. With neither slot it stays mounted as a `display: contents` box that paints nothing, so the control keeps its node, focus, and text as a slot comes or goes. It does not strip anything from the control it wraps: pass `inner` to `InputControl` when `hasInputSlots({ before, after })` is true, as Input does, so the control paints no surface of its own.

The wrapper reads disabled and invalid off the control it holds and nothing deeper, so a disabled button or an invalid input inside a slot leaves the field alone. An icon in a slot takes the field's icon size and a muted color; a `Button` in a slot keeps its own icon size.

Pressing plain slot content or the wrapper's padding focuses the control, as a press on a bare input would. A press on a real control in a slot (a button, link, input, or anything with `tabindex`) stays with that control. Slot controls keep their DOM order: a control in `before` precedes the input in tab order, one in `after` follows it. Pass `disabled` to the wrapper, as Input does, to make the slots `inert` so their content leaves the tab order with the field.

`InputControl` is the `<input>` on its own, with no field chrome and no slots: reach for it when composing a `Field` by hand. It is Base UI's `Input`, a `Field.Control`, so inside a `Field` it takes the field's `name` and `disabled`, falls back to its `required`, and is labelled and described by it. It takes the same `size`, `variant`, `fullwidth`, and `color` as Input. A composite whose Base UI root already registers its own control should style a plain `<input>` with `inputControlClassName` instead, or the value submits twice.

Additional props are forwarded to the underlying Base UI [Input](https://base-ui.com/react/components/input). `size` is the one deliberate exception: it is the system-wide control scale, not the native character-width attribute, so set a width with `fullwidth` or a `className`.
