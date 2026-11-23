"use client";

import { CreditCardIcon } from "@uiid/icons/credit-card";
import { PhoneIcon } from "@uiid/icons/phone";
import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { Input } from "../input/input";
import type { InputMask, InputVariants } from "../input/input.types";
import { currencyMask, percentMask } from "../input/masks/number-masks";
import { patternMask } from "../input/masks/pattern-mask";
import {
  creditCardExpiryMask,
  creditCardMask,
  dateMask,
  einMask,
  ipv4Mask,
  isValidCreditCard,
  isbnMask,
  licensePlateMask,
  macAddressMask,
  phoneMask,
  ssnMask,
  timeMask,
  zipCodeExtendedMask,
  zipCodeMask,
} from "../input/masks/patterns";
import { MaskInput } from "./mask-input";

type Size = NonNullable<InputVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

/* Masks are stable objects: build them once, at module scope or in useMemo. */
const usd = currencyMask({ currency: "USD" });
const eur = currencyMask({ currency: "EUR", locale: "de-DE" });
const jpy = currencyMask({ currency: "JPY", locale: "ja-JP" });
const percent = percentMask();
const orderNumber = patternMask("AA-####", {
  slots: { A: /[A-Z]/ },
  uppercase: true,
});

const PATTERNS: { mask: InputMask<string>; label: string }[] = [
  { mask: phoneMask, label: "Phone" },
  { mask: ssnMask, label: "Social security number" },
  { mask: einMask, label: "EIN" },
  { mask: dateMask, label: "Date" },
  { mask: timeMask, label: "Time" },
  { mask: creditCardMask, label: "Credit card" },
  { mask: creditCardExpiryMask, label: "Expiry" },
  { mask: zipCodeMask, label: "ZIP code" },
  { mask: zipCodeExtendedMask, label: "ZIP+4" },
  { mask: licensePlateMask, label: "License plate" },
  { mask: ipv4Mask, label: "IPv4 address" },
  { mask: macAddressMask, label: "MAC address" },
  { mask: isbnMask, label: "ISBN" },
];

const ERROR = "That card number was declined";

export const Default = () => (
  <MaskInput
    mask={phoneMask}
    aria-label="Phone number"
    placeholder="Phone number"
  />
);

export const WithLabel = () => (
  <MaskInput
    mask={phoneMask}
    label="Phone number"
    description="Digits only — the separators are added for you."
    placeholder="(555) 555-5555"
  />
);

/* `MaskInput` is `Input` with a required `mask`. These two fields are the
 * same thing; use whichever reads better where it sits. */
export const SameAsInput = () => (
  <Stack gap={4}>
    <MaskInput mask={phoneMask} label="Phone number (MaskInput)" />
    <Input mask={phoneMask} label="Phone number (Input with a mask)" />
  </Stack>
);

/* A format hint belongs in `description`: it stays visible while typing and
 * is announced with the field, where a placeholder is gone at the first key. */
export const FormatHint = () => (
  <MaskInput mask={dateMask} label="Date of birth" description="MM/DD/YYYY" />
);

/* Every built-in pattern mask. Each is its own import, so a page bundles only
 * the ones it uses. */
export const Patterns = () => (
  <Stack gap={4}>
    {PATTERNS.map(({ mask, label }) => (
      <MaskInput key={label} mask={mask} label={label} />
    ))}
  </Stack>
);

/* `patternMask` builds a mask of your own: each `#` takes a digit, extra slot
 * characters take what their pattern allows, and the rest are literals. */
export const CustomPattern = () => (
  <MaskInput mask={orderNumber} label="Order number" placeholder="AB-1234" />
);

/* The number masks format through Intl, so the symbol, its side and the
 * decimals follow the currency and locale the mask was built with. */
export const Currency = () => (
  <Stack gap={4}>
    <MaskInput mask={usd} label="USD" />
    <MaskInput mask={eur} label="EUR in de-DE" />
    <MaskInput mask={jpy} label="JPY in ja-JP" />
    <MaskInput mask={percent} label="Percent" />
  </Stack>
);

export const Sizes = () => (
  <Stack gap={4}>
    {SIZES.map((size) => (
      <MaskInput key={size} mask={phoneMask} size={size} label={size} />
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
      <MaskInput key={color} mask={phoneMask} color={color} label={color} />
    ))}
  </Stack>
);

export const BeforeAfterSlots = () => (
  <Stack gap={4}>
    <MaskInput
      mask={phoneMask}
      before={<PhoneIcon />}
      aria-label="Phone number"
      placeholder="Phone number"
    />
    <MaskInput
      mask={creditCardMask}
      before={<CreditCardIcon />}
      after={<Text size={-1}>Visa</Text>}
      aria-label="Card number"
      placeholder="Card number"
    />
  </Stack>
);

export const Ghost = () => (
  <MaskInput
    mask={phoneMask}
    variant="ghost"
    aria-label="Phone number"
    placeholder="Phone number"
  />
);

export const Fullwidth = () => (
  <Stack gap={4} fullwidth>
    <MaskInput
      mask={phoneMask}
      fullwidth
      aria-label="Home phone"
      placeholder="Fullwidth"
    />
    <MaskInput
      mask={phoneMask}
      aria-label="Work phone"
      placeholder="Not fullwidth"
    />
  </Stack>
);

export const Disabled = () => (
  <Stack gap={4}>
    <MaskInput mask={phoneMask} label="Disabled" disabled />
    <MaskInput
      mask={phoneMask}
      label="Read only"
      readOnly
      defaultValue={phoneMask.format("5555555555")}
    />
  </Stack>
);

/*
 * Each pattern mask ships an `isValid*` validator. Hand it to Field's
 * `validate` through `FieldProps`, which shows the message inline.
 */
export const Validation = () => (
  <MaskInput
    mask={creditCardMask}
    label="Card number"
    description="Try 4111 1111 1111 1111."
    FieldProps={{
      validationMode: "onBlur",
      validate: (value) =>
        isValidCreditCard(String(value ?? "")) ? null : "Check the card number",
    }}
  />
);

export const Invalid = () => (
  <Form errors={{ card: ERROR }}>
    <MaskInput name="card" mask={creditCardMask} label="Card number" />
  </Form>
);

/*
 * The value is the masked string, in `value`, in `onValueChange` and in the
 * submitted form. `mask.parse` reads the unmasked value out of it.
 */
export const Controlled = () => {
  const [masked, setMasked] = useState("");

  return (
    <Stack gap={3}>
      <MaskInput
        mask={phoneMask}
        label="Phone number"
        value={masked}
        onValueChange={setMasked}
      />
      <Group gap={4}>
        <Text size={-1} emphasis="muted">
          Masked: {masked || "—"}
        </Text>
        <Text size={-1} emphasis="muted">
          Unmasked: {phoneMask.parse(masked) || "—"}
        </Text>
      </Group>
    </Stack>
  );
};

/* A `defaultValue` is shown as given, so format a raw value with the mask. */
export const Uncontrolled = () => (
  <MaskInput
    mask={phoneMask}
    label="Phone number"
    defaultValue={phoneMask.format("5555555555")}
  />
);
