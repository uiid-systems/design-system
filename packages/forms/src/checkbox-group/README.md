# Checkbox Group

> Several checkboxes under one label, with the selection collected into an array of values.

Use CheckboxGroup when you want to:

- Offer a set of independent options — pass `items` for the common case, each entry carrying `value`, `label`, and optionally `disabled`
- Label the whole group with `label` and `description`
- Lay the boxes out with `direction` (`vertical`, `horizontal`)
- Apply `bordered` and `reversed` to every row at once
- Hide the boxes with `hideIndicators` while they stay in the accessibility tree
- Disable the whole group with `disabled` — it propagates to every box
- Reach every box with anything the group doesn't surface itself through `CheckboxProps` (`size`, for instance)

Drop `items` and pass children to compose [`Checkbox`](../checkbox/README.md) directly instead — each one can then carry its own description, size, or slot content.

Leave `value` unset and the group runs itself; pass `value` and `onValueChange` to drive it yourself. `required` marks the label only: HTML cannot express "at least one of these", so that rule lives in the validation that produced the error.

Errors are published by name from the surrounding [`Form`](../form/README.md). One `name` on the group covers both jobs: it matches the group's field to the error, and it names every box's input so the group posts as a list of values.

Additional props are forwarded to the underlying Base UI [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
