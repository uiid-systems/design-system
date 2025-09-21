import { useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";

import { Stack, Group } from "@uiid/primitives";

import { Button } from "../buttons";
import { Input, Select, InputZip } from "./";
import { SelectState } from "./select-state/select-state";

const surnames = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "ms", label: "Ms." },
  { value: "dr", label: "Dr." },
];

const GAP = 2;

const meta = {
  title: "Playground",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AdressForm: Story = {
  render: () => {
    // const [isValid, setIsValid] = useState(true);

    const formRef = useRef<HTMLFormElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("handleInputChange currently deactivated");
      // setIsValid(
      //   Boolean(firstNameRef.current?.value && lastNameRef.current?.value),
      // );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      alert("Submitted");
      formRef.current?.reset();
    };

    return (
      <Stack
        render={<form ref={formRef} onSubmit={handleSubmit} />}
        ax="stretch"
        gap={4}
        style={{ width: 520 }}
      >
        <Group ay="end" gap={GAP}>
          <Select label="Surname" options={surnames} />
          <Input
            label="First name"
            ref={firstNameRef}
            onChange={handleInputChange}
            required
            fullwidth
          />
          <Input
            label="Last name"
            ref={lastNameRef}
            onChange={handleInputChange}
            required
            fullwidth
          />
        </Group>

        <Group gap={GAP}>
          <Input label="Address" required fullwidth />
          <Input label="Apt." />
        </Group>

        <Group gap={GAP}>
          <Input label="City" required fullwidth />
          <SelectState label="State" required />
          <InputZip label="Zip" required />
        </Group>

        <Stack gap={GAP} ax="stretch">
          <Button>Submit</Button>
          <Button variant="subtle">Cancel</Button>
        </Stack>
      </Stack>
    );
  },
};
