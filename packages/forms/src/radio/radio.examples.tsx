"use client";

import { Stack } from "@uiid/layout";

import { RadioGroupRoot } from "../radio-group/subcomponents";
import { Radio } from "./radio";
import type { RadioVariants } from "./radio.types";

type Size = NonNullable<RadioVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const DESCRIPTION = "Charged monthly, cancel whenever you like.";

/*
 * A radio only means something next to its siblings, so every example sits in a
 * `RadioGroupRoot` — that is what supplies the shared name, the roving focus,
 * and the single-selection behavior.
 */
export const Default = () => (
  <RadioGroupRoot defaultValue="monthly">
    <Radio value="monthly" label="Monthly" />
    <Radio value="yearly" label="Yearly" />
  </RadioGroupRoot>
);

export const WithDescription = () => (
  <RadioGroupRoot defaultValue="monthly">
    <Radio value="monthly" label="Monthly" description={DESCRIPTION} />
    <Radio
      value="yearly"
      label="Yearly"
      description="Two months free, billed up front."
    />
  </RadioGroupRoot>
);

export const Sizes = () => (
  <Stack gap={4}>
    {SIZES.map((size) => (
      <RadioGroupRoot key={size} direction="horizontal" defaultValue="on">
        <Radio value="on" size={size} label={`${size}, selected`} />
        <Radio value="off" size={size} label={size} />
      </RadioGroupRoot>
    ))}
  </Stack>
);

export const Bordered = () => (
  <Stack gap={4} ax="stretch">
    <RadioGroupRoot defaultValue="monthly">
      <Radio bordered value="monthly" label="Monthly" />
      <Radio bordered value="yearly" label="Yearly" />
    </RadioGroupRoot>
    <RadioGroupRoot defaultValue="monthly">
      <Radio bordered reversed value="monthly" label="Monthly" />
      <Radio bordered reversed value="yearly" label="Yearly" />
    </RadioGroupRoot>
  </Stack>
);

/*
 * The dot is hidden from sight but stays in the accessibility tree, so the row
 * still reads and toggles as a radio.
 */
export const HideIndicator = () => (
  <RadioGroupRoot defaultValue="monthly">
    <Radio bordered hideIndicator value="monthly" label="Monthly" />
    <Radio bordered hideIndicator value="yearly" label="Yearly" />
  </RadioGroupRoot>
);

export const Disabled = () => (
  <RadioGroupRoot defaultValue="monthly">
    <Radio value="monthly" label="Monthly" />
    <Radio value="yearly" label="Yearly" disabled />
  </RadioGroupRoot>
);

export const Unselected = () => (
  <RadioGroupRoot>
    <Radio value="monthly" label="Monthly" />
    <Radio value="yearly" label="Yearly" />
  </RadioGroupRoot>
);
