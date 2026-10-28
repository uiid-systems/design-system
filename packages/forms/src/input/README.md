# Input

> The standard text control. Pass `label` and `description` and it builds its own [`Field`](../field/README.md); pass neither and it renders bare.

Use Input when you want to:

- Collect a single line of text — `type` is forwarded, so `email`, `password`, `search`, and `url` all work
- Label it inline with `label` and `description` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Put an icon, a unit, or a hint inside the control with `before` and `after`
- Soften the surface with `variant="ghost"` (no border until focus) or fill the container with `fullwidth`
- Tint the surface with a palette `color` (`red`, `blue`, …) — background, border, and text all resolve from the one hue, and an invalid input keeps its tint while the edge turns red
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the input runs itself; pass `value` and `onValueChange` to drive it yourself.

Validity comes from the surrounding [`Form`](../form/README.md) or `Field` — give the input a `name` and a `Form` publishes the matching entry of its `errors` map onto it. Reach the field around it through `FieldProps`, which is where `errorType` (`inline`, `tooltip`, `absolute`) lives.

For a shared label over several controls, wrap them in a `Field` and let each keep its own `name`. For a masked value use [`MaskInput`](../mask-input/README.md), for numbers [`NumberField`](../number-field/README.md), and for multiple lines [`Textarea`](../textarea/README.md).

`before` and `after` render through `InputWrapper`, which is exported on its own for composing the same slotted surface around another control. Its `orientation` prop (`horizontal` by default) places the slots beside the control; `vertical` stacks them above and below it, which is how [`Textarea`](../textarea/README.md) gets its slots. The wrapper carries `size`, `fullwidth`, `variant`, and `color` in both orientations, and the control inside it drops its own surface.

Additional props are forwarded to the underlying Base UI [Input](https://base-ui.com/react/components/input). `size` is the one deliberate exception: it is the system-wide control scale, not the native character-width attribute.
