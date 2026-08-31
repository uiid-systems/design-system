"use client";

import { CreditCardIcon } from "@uiid/icons/credit-card";
import { PhoneIcon } from "@uiid/icons/phone";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import type { InputVariants } from "../input/input.types";
import { MaskInput } from "./mask-input";
import type { MaskPatternKey } from "./mask-input.types";

type Size = NonNullable<InputVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const PATTERNS: { mask: MaskPatternKey; label: string }[] = [
  { mask: "phone", label: "Phone" },
  { mask: "ssn", label: "Social security number" },
  { mask: "date", label: "Date" },
  { mask: "time", label: "Time" },
  { mask: "creditCard", label: "Credit card" },
  { mask: "creditCardExpiry", label: "Expiry" },
  { mask: "zipCode", label: "ZIP code" },
  { mask: "zipCodeExtended", label: "ZIP+4" },
  { mask: "currency", label: "Currency" },
  { mask: "percentage", label: "Percentage" },
  { mask: "licensePlate", label: "License plate" },
  { mask: "ipv4", label: "IPv4 address" },
  { mask: "macAddress", label: "MAC address" },
  { mask: "isbn", label: "ISBN" },
  { mask: "ein", label: "EIN" },
];

const ERROR = "That card number was declined";

export const Default = () => (
  <MaskInput mask="phone" placeholder="Phone number" />
);

export const WithLabel = () => (
  <MaskInput
    mask="phone"
    label="Phone number"
    description="Digits only — the separators are added for you."
    placeholder="(555) 555-5555"
  />
);

/* Every built-in pattern. Pass a `MaskPattern` object instead of a key to
 * define your own. */
export const Patterns = () => (
  <Stack gap={4} ax="stretch">
    {PATTERNS.map(({ mask, label }) => (
      <MaskInput key={mask} mask={mask} label={label} />
    ))}
  </Stack>
);

/*
 * `maskPlaceholder` shows the shape of the value, but only once the input has
 * focus — the resting placeholder stays plain language.
 */
export const MaskPlaceholder = () => (
  <MaskInput
    mask="date"
    label="Date of birth"
    placeholder="Date of birth"
    maskPlaceholder="MM/DD/YYYY"
  />
);

/* The currency mask formats through Intl, so it follows `currency` and
 * `locale`. */
export const Currency = () => (
  <Stack gap={4} ax="stretch">
    <MaskInput mask="currency" label="USD" currency="USD" locale="en-US" />
    <MaskInput mask="currency" label="EUR" currency="EUR" locale="de-DE" />
    <MaskInput mask="currency" label="JPY" currency="JPY" locale="ja-JP" />
  </Stack>
);

export const Sizes = () => (
  <Stack gap={4} ax="stretch">
    {SIZES.map((size) => (
      <MaskInput key={size} mask="phone" size={size} label={size} />
    ))}
  </Stack>
);

export const BeforeAfterSlots = () => (
  <Stack gap={4} ax="stretch">
    <MaskInput mask="phone" before={<PhoneIcon />} placeholder="Phone number" />
    <MaskInput
      mask="creditCard"
      before={<CreditCardIcon />}
      after={<Text size={-1}>Visa</Text>}
      placeholder="Card number"
    />
  </Stack>
);

export const Ghost = () => (
  <MaskInput mask="phone" ghost placeholder="Phone number" />
);

export const Fullwidth = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    <MaskInput mask="phone" fullwidth placeholder="Fullwidth" />
    <MaskInput mask="phone" placeholder="Not fullwidth" />
  </Stack>
);

export const Disabled = () => (
  <Stack gap={4} ax="stretch">
    <MaskInput mask="phone" label="Disabled" disabled />
    <MaskInput
      mask="phone"
      label="Read only"
      readOnly
      defaultValue="5555555555"
    />
  </Stack>
);

/* `withoutMask` keeps the component in place but stops it rewriting input —
 * useful when a locale or a feature flag turns formatting off. */
export const WithoutMask = () => (
  <MaskInput
    mask="phone"
    withoutMask
    label="Unformatted"
    placeholder="Phone number"
  />
);

/*
 * `onValidate` reports whether the unmasked value satisfies the pattern's own
 * rule — Luhn for credit cards, a real month for expiry dates, and so on.
 */
export const Validation = () => {
  const [valid, setValid] = useState<boolean | null>(null);

  return (
    <Stack gap={3} ax="stretch">
      <MaskInput
        mask="creditCard"
        label="Card number"
        maskPlaceholder="#### #### #### ####"
        validationMode="onChange"
        onValidate={setValid}
      />
      <Text size={-1} shade="muted">
        {valid === null
          ? "Not checked yet"
          : valid
            ? "Passes Luhn"
            : "Fails Luhn"}
      </Text>
    </Stack>
  );
};

export const Invalid = () => (
  <Form errors={{ card: ERROR }}>
    <MaskInput name="card" mask="creditCard" label="Card number" />
  </Form>
);

/*
 * `onValueChange` gives both readings: the masked string to display and the
 * unmasked digits to send.
 */
export const Controlled = () => {
  const [masked, setMasked] = useState("");
  const [unmasked, setUnmasked] = useState("");

  return (
    <Stack gap={3} ax="stretch">
      <MaskInput
        mask="phone"
        label="Phone number"
        value={masked}
        onValueChange={(nextMasked, nextUnmasked) => {
          setMasked(nextMasked);
          setUnmasked(nextUnmasked);
        }}
      />
      <Group gap={4}>
        <Text size={-1} shade="muted">
          Masked: {masked || "—"}
        </Text>
        <Text size={-1} shade="muted">
          Unmasked: {unmasked || "—"}
        </Text>
      </Group>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <MaskInput mask="phone" label="Phone number" defaultValue="5555555555" />
);
