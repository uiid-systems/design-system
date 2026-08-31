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

Errors are published by name from the surrounding [`Form`](../form/README.md). Put the name on the group's own field through `FieldProps` rather than on the group — `name` is also handed to every box, and each box builds a field of its own, so a shared name would print the message once per box. The tradeoff is that the boxes then submit unnamed; give them one through `CheckboxProps` when the group has to post.

Additional props are forwarded to the underlying Base UI [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
