import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Form, Input, Stack } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/form/form.examples";

const meta = {
  title: "Forms/Form",
  component: Form,
  parameters: { layout: "centered" },
  argTypes: {
    validationMode: {
      control: "select",
      options: ["onSubmit", "onBlur", "onChange"],
      table: { category: "Options" },
    },
    errors: { control: "object", table: { category: "Data" } },
    onFormSubmit: { table: { category: "Events" } },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Form {...args}>
      <Stack gap={4} ax="stretch" w={320}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Button type="submit">Subscribe</Button>
      </Stack>
    </Form>
  ),
};

export const UsernamePassword: Story = {
  render: () => <Examples.UsernamePassword />,
};
export const TooltipErrors: Story = {
  render: () => <Examples.TooltipErrors />,
};
export const AbsoluteErrors: Story = {
  render: () => <Examples.AbsoluteErrors />,
};
export const SelectAndConfirm: Story = {
  render: () => <Examples.SelectAndConfirm />,
};
export const ValidationMode: Story = {
  render: () => <Examples.ValidationMode />,
};
