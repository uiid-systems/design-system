import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/primitives";

import { InputFile } from "./input-file";

const meta = {
  title: "Forms/Inputs/Input File",
  component: InputFile,
  args: {
    disabled: false,
    required: true,
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" style={{ gap: 16 }}>
      <InputFile {...args} label="Input File" name="regular-input" />
      <InputFile
        {...args}
        label="Input Cloud"
        name="cloud-input"
        type="cloud"
      />
      <InputFile
        {...args}
        label="Input Attachment"
        name="attachment-input"
        type="attachment"
      />
      <InputFile
        {...args}
        label="Input Upload"
        name="upload-input"
        type="upload"
      />
      <InputFile
        {...args}
        label="Input Image"
        name="image-input"
        type="image"
      />
    </Stack>
  ),
} satisfies Meta<typeof InputFile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input File" };
