import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "../layout";
import { Button } from "../buttons";
import { Input, Select, Checkbox } from "./";

const surnames = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "ms", label: "Ms." },
  { value: "dr", label: "Dr." },
];

const GAP = 2;

const meta = {
  title: "Components/Forms/Playground",
  render: () => (
    <Stack ax="stretch" gap={4} style={{ width: 600 }}>
      <Group ay="end" gap={GAP}>
        <Select label="Surname" options={surnames} />
        <Input required label="First name" />
        <Input required label="Last name" />
      </Group>
      <Button>Submit</Button>
      <Button variant="subtle">Cancel</Button>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Playground" };
