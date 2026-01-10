"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { MaskInput } from "./mask-input";

const meta = {
  title: "Forms/MaskInput",
  component: MaskInput,
  tags: ["beta"],
  args: {
    placeholder: "Enter value",
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    invalid: { control: "boolean", table: { category: "Toggles" } },
    withoutMask: { control: "boolean", table: { category: "Toggles" } },

    mask: {
      control: "select",
      options: [
        "phone",
        "ssn",
        "date",
        "time",
        "creditCard",
        "creditCardExpiry",
        "zipCode",
        "zipCodeExtended",
        "currency",
        "percentage",
        "licensePlate",
        "ipv4",
        "macAddress",
        "isbn",
        "ein",
      ],
      table: { category: "Options" },
    },
    validationMode: {
      control: "select",
      options: ["onChange", "onBlur", "onSubmit", "onTouched", "all"],
      table: { category: "Options" },
    },
    currency: {
      control: "select",
      options: ["USD", "EUR", "GBP", "JPY"],
      table: { category: "Options" },
    },
    locale: {
      control: "select",
      options: ["en-US", "de-DE", "en-GB", "ja-JP"],
      table: { category: "Options" },
    },

    placeholder: { control: "text", table: { category: "Text" } },
    maskPlaceholder: { control: "text", table: { category: "Text" } },
  },
  render: (args) => (
    <Stack gap={4}>
      <MaskInput {...args} mask="phone" placeholder="Phone number" />
      <MaskInput {...args} mask="date" placeholder="Date (MM/DD/YYYY)" />
      <MaskInput {...args} mask="creditCard" placeholder="Credit card" />
      <MaskInput {...args} mask="currency" placeholder="Currency" />
      <MaskInput {...args} mask="percentage" placeholder="Percentage" />
      <MaskInput {...args} mask="zipCode" placeholder="ZIP code" />
    </Stack>
  ),
} satisfies Meta<typeof MaskInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "MaskInput",
};
