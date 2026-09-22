# Radio Group

> Several radios under one label, with exactly one value selected at a time.

Use RadioGroup when you want to:

- Offer a set of mutually exclusive options — pass `items` for the common case, each entry carrying `value`, `label`, and optionally `disabled`
- Label the whole group with `label` and `description`
- Lay the radios out with `orientation` (`vertical`, `horizontal`)
- Stretch the group across its container with `fullwidth` — a horizontal group shares the width evenly between its rows, and a vertical group stretches each row across it, `bordered` frame included
- Scale every row at once with `size` (`xsmall`, `small`, `medium`, `large`), matching an Input or Button at the same tier
- Apply `bordered` and `reversed` to every row at once
- Hide the dots with `hideIndicators` while they stay in the accessibility tree
- Disable the whole group with `disabled` — it propagates to every radio
- Reach every radio with anything the group doesn't surface itself through `RadioProps`

Drop `items` and pass children to compose [`Radio`](../radio/README.md) directly instead — each one can then carry its own description or variant.

A radio group starts with nothing selected unless you say otherwise. Leave `value` unset and the group runs itself from `defaultValue`; pass `value` and `onValueChange` to drive it yourself.

Give the group a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it.

The group lays its radios out in a `Stack`, or a `Group` when `orientation="horizontal"`, and takes their layout props (`gap`, `p`, `m`, ...) alongside Base UI's — all but the alignment axes and `direction`, which `orientation` and `fullwidth` decide. The radios sit `gap={2}` apart by default; pass `gap` to change it. A `render` of your own replaces the primitive, so layout props passed beside it reach your element as plain attributes.

Additional props are forwarded to the underlying Base UI [Radio Group](https://base-ui.com/react/components/radio-group).
