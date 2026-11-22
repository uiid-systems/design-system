"use client";

import { AtSignIcon } from "@uiid/icons/at-sign";
import { LockIcon } from "@uiid/icons/lock";
import { SearchIcon } from "@uiid/icons/search";
import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Field } from "../field/field";
import { Form } from "../form/form";
import { Input } from "./input";
import type { InputVariants } from "./input.types";
import { currencyMask, numberMask, percentMask } from "./masks/number-masks";
import { patternMask } from "./masks/pattern-mask";
import { dateMask, phoneMask } from "./masks/patterns";

type Size = NonNullable<InputVariants["size"]>;

/* Masks are stable objects: build them once, at module scope or in useMemo. */
const usd = currencyMask({ currency: "USD", min: 0 });
const discount = percentMask({ min: 0, max: 100 });
const quantity = numberMask({ min: 0 });
const orderNumber = patternMask("AA-####", {
  slots: { A: /[A-Z]/ },
  uppercase: true,
});

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const DESCRIPTION = "We'll only ever use this to send you receipts.";
const ERROR = "Enter a valid email address";

export const Default = () => <Input placeholder="Placeholder" />;

export const WithLabel = () => (
  <Input
    label="Email"
    description={DESCRIPTION}
    placeholder="you@example.com"
  />
);

export const Sizes = () => (
  <Stack gap={4}>
    {SIZES.map((size) => (
      <Input
        key={size}
        size={size}
        label={size}
        placeholder="you@example.com"
      />
    ))}
  </Stack>
);

/*
 * A hue tints the whole field surface — background, border, and foreground all
 * resolve from the one prop, so the control reads as a tinted surface rather
 * than a neutral one with an accent.
 */
export const Colors = () => (
  <Stack gap={4}>
    {PALETTE_HUES.map((color) => (
      <Input
        key={color}
        color={color}
        label={color}
        placeholder="you@example.com"
      />
    ))}
  </Stack>
);

export const BeforeAfterSlots = () => (
  <Stack gap={4}>
    <Input before={<SearchIcon />} placeholder="Search" />
    <Input after={<AtSignIcon />} placeholder="Email" />
    <Input
      before={<LockIcon />}
      after={<Text size={-1}>optional</Text>}
      placeholder="Password"
      type="password"
    />
    <Input
      before={<Text size={-1}>$</Text>}
      after={<Text size={-1}>.00</Text>}
      placeholder="0"
    />
  </Stack>
);

export const Ghost = () => (
  <Stack gap={4}>
    <Input variant="ghost" placeholder="Ghost" />
    <Input
      variant="ghost"
      before={<SearchIcon />}
      placeholder="Ghost with a slot"
    />
  </Stack>
);

export const Fullwidth = () => (
  <Stack gap={4} fullwidth>
    <Input fullwidth placeholder="Fullwidth" />
    <Input placeholder="Not fullwidth" />
  </Stack>
);

export const Required = () => (
  <Input label="Email" required placeholder="you@example.com" />
);

export const Disabled = () => (
  <Stack gap={4}>
    <Input label="Disabled" disabled placeholder="you@example.com" />
    <Input label="Read only" readOnly defaultValue="you@example.com" />
  </Stack>
);

/*
 * `Form` publishes its `errors` map to every field that shares a `name`, which
 * both marks the control invalid and supplies the message — the same path a
 * server response takes.
 */
export const Invalid = () => (
  <Form errors={{ email: ERROR }}>
    <Input name="email" label="Email" defaultValue="not-an-email" />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("");

  return (
    <Stack gap={3}>
      <Input
        label="Search"
        before={<SearchIcon />}
        placeholder="Type to search"
        value={value}
        onValueChange={setValue}
      />
      <Text size={-1} emphasis="muted">
        Value: {value || "—"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <Input label="Search" before={<SearchIcon />} defaultValue="Design system" />
);

/*
 * The value is the masked string. `format` turns a number into it for the
 * initial value, and `parse` reads the number back out.
 */
export const MaskedCurrency = () => {
  const [masked, setMasked] = useState(usd.format(1234.5));

  return (
    <Stack gap={3}>
      <Input
        mask={usd}
        label="Price"
        value={masked}
        onValueChange={setMasked}
      />
      <Text size={-1} emphasis="muted">
        Parsed: {String(usd.parse(masked))}
      </Text>
    </Stack>
  );
};

/* The value is the number as shown: `discount.parse("50%")` is 50, not 0.5. */
export const MaskedPercent = () => (
  <Input mask={discount} label="Discount" defaultValue={discount.format(50)} />
);

export const MaskedNumber = () => (
  <Input
    mask={quantity}
    label="Quantity"
    defaultValue={quantity.format(1200)}
  />
);

/* A format hint goes in `description`, which stays visible while typing. */
export const MaskedPattern = () => (
  <Stack gap={4}>
    <Input mask={phoneMask} label="Phone number" autoComplete="tel" />
    <Input mask={dateMask} label="Date of birth" description="MM/DD/YYYY" />
  </Stack>
);

/* `#` takes a digit, `A` takes what its pattern allows, the rest are literals. */
export const CustomMask = () => (
  <Input
    mask={orderNumber}
    label="Order number"
    description="Two letters, then four digits"
  />
);

/*
 * The shape react-hook-form's `register("phone")` returns, written by hand.
 * Its `onChange` reads `event.target.value`, which is the masked text.
 */
export const MaskedRegister = () => {
  const [value, setValue] = useState("");
  const registered = {
    name: "phone",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    onBlur: () => {},
    ref: () => {},
  };

  return (
    <Stack gap={3}>
      <Input mask={phoneMask} label="Phone number" {...registered} />
      <Text size={-1} emphasis="muted">
        Form value: {value || "—"}
      </Text>
    </Stack>
  );
};

/*
 * One label over several controls: the inputs keep their own names, and the
 * surrounding `Field` supplies the shared label and description.
 */
export const Grouped = () => (
  <Field label="Full name" description="As it appears on your ID.">
    <Group gap={2} evenly fullwidth>
      <Input name="first-name" placeholder="First" />
      <Input name="last-name" placeholder="Last" />
    </Group>
  </Field>
);
