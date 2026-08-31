# Radio Group

> Several radios under one label, with exactly one value selected at a time.

Use RadioGroup when you want to:

- Offer a set of mutually exclusive options — pass `items` for the common case, each entry carrying `value`, `label`, and optionally `disabled`
- Label the whole group with `label` and `description`
- Lay the radios out with `direction` (`vertical`, `horizontal`)
- Apply `bordered` and `reversed` to every row at once
- Hide the dots with `hideIndicators` while they stay in the accessibility tree
- Disable the whole group with `disabled` — it propagates to every radio
- Reach every radio with anything the group doesn't surface itself through `RadioProps` (`size`, for instance)

Drop `items` and pass children to compose [`Radio`](../radio/README.md) directly instead — each one can then carry its own description or variant.

A radio group starts with nothing selected unless you say otherwise. Leave `value` unset and the group runs itself from `defaultValue`; pass `value` and `onValueChange` to drive it yourself.

Give the group a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it.

Additional props are forwarded to the underlying Base UI [Radio Group](https://base-ui.com/react/components/radio-group).
