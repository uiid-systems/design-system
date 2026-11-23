import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MaskInput,
  creditCardExpiryMask,
  creditCardMask,
  currencyMask,
  dateMask,
  einMask,
  ipv4Mask,
  isbnMask,
  licensePlateMask,
  macAddressMask,
  percentMask,
  phoneMask,
  ssnMask,
  timeMask,
  zipCodeExtendedMask,
  zipCodeMask,
} from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/mask-input/mask-input.examples";

/* The control picks a name; `mapping` hands the component the imported mask
   object, built once here as masks must be. */
const MASKS = {
  phoneMask,
  ssnMask,
  einMask,
  dateMask,
  timeMask,
  creditCardMask,
  creditCardExpiryMask,
  zipCodeMask,
  zipCodeExtendedMask,
  licensePlateMask,
  ipv4Mask,
  macAddressMask,
  isbnMask,
  "currencyMask({ currency: 'USD' })": currencyMask({ currency: "USD" }),
  "percentMask()": percentMask(),
};

const meta = {
  title: "Forms/Mask Input",
  component: MaskInput,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    /* A `mapping` key, so the select control shows it; Storybook swaps in the
       mask object before rendering. */
    mask: "phoneMask" as unknown as typeof phoneMask,
    label: "Phone number",
    description: "Digits only — the separators are added for you.",
    placeholder: "(555) 555-5555",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    placeholder: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["ghost"],
      table: { category: "Variants" },
    },
    color: {
      control: "select",
      options: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
        "neutral",
      ],
      table: { category: "Variants" },
    },

    mask: {
      control: "select",
      options: Object.keys(MASKS),
      mapping: MASKS,
      table: { category: "Options" },
    },

    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onFocus: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof MaskInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <MaskInput {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const SameAsInput: Story = { render: () => <Examples.SameAsInput /> };
export const FormatHint: Story = { render: () => <Examples.FormatHint /> };
export const Patterns: Story = { render: () => <Examples.Patterns /> };
export const CustomPattern: Story = {
  render: () => <Examples.CustomPattern />,
};
export const Currency: Story = { render: () => <Examples.Currency /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Colors: Story = { render: () => <Examples.Colors /> };
export const BeforeAfterSlots: Story = {
  render: () => <Examples.BeforeAfterSlots />,
};
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Fullwidth: Story = { render: () => <Examples.Fullwidth /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Validation: Story = { render: () => <Examples.Validation /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
