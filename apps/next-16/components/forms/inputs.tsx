import { Stack, Group } from "@uiid/layout";
import { Input } from "@uiid/forms";

export function Inputs() {
  return (
    <Stack gap={4} ax="stretch" fullwidth>
      <Input
        label="Input with label, description, hint"
        description="This is a description"
        hint="Optional"
      />
      <Input
        label="Input with clear"
        description="When the input has a value, a clear button will be shown"
        enableClear
      />
      <Input
        label="Input with validation and clear"
        errorMessage="This is an error"
        description="This is a typical input description"
        after="Min. 5 chars"
        minLength={5}
        required
        hasError
        validate
      />
      <Input label="Input with bookends" before="B" after="A" />
      <Group gap={2} evenly fullwidth>
        <Input label="Input in a group" />
        <Input label="Input in a group" />
      </Group>
    </Stack>
  );
}
