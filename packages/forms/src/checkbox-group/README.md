# Checkbox Group

> Several checkboxes under one label, with the selection collected into an array of values.

Use CheckboxGroup when you want to:

- Offer a set of independent options — pass `items` for the common case, each entry carrying `value`, `label`, and optionally `disabled`
- Label the whole group with `label` and `description`
- Lay the boxes out with `orientation` (`vertical`, `horizontal`)
- Stretch the group across its container with `fullwidth` — a horizontal group shares the width evenly between its rows, and a vertical group stretches each row across it, `bordered` frame included
- Scale every row at once with `size` (`xsmall`, `small`, `medium`, `large`), matching an Input or Button at the same tier
- Apply `bordered` and `reversed` to every row at once
- Hide the boxes with `hideIndicators` while they stay in the accessibility tree
- Disable the whole group with `disabled` — it propagates to every box
- Reach every box with anything the group doesn't surface itself through `CheckboxProps`

Drop `items` and pass children to compose [`Checkbox`](../checkbox/README.md) directly instead — each one can then carry its own description, size, or slot content.

Leave `value` unset and the group runs itself; pass `value` and `onValueChange` to drive it yourself. `required` marks the label only: HTML cannot express "at least one of these", so that rule lives in the validation that produced the error.

Errors are published by name from the surrounding [`Form`](../form/README.md). One `name` on the group covers both jobs: it matches the group's field to the error, and it names every box's input so the group posts as a list of values.

The group lays its checkboxes out in a `Stack`, or a `Group` when `orientation="horizontal"`, and takes their layout props (`gap`, `p`, `m`, ...) alongside Base UI's — all but the alignment axes and `direction`, which `orientation` and `fullwidth` decide. The checkboxes sit `gap={2}` apart by default; pass `gap` to change it. A `render` of your own replaces the primitive, so layout props passed beside it reach your element as plain attributes.

Additional props are forwarded to the underlying Base UI [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
