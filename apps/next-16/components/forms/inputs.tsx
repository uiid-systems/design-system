import { Stack, Group } from "@uiid/layout";
import { Input } from "@uiid/forms";

export function Inputs() {
  return (
    <Stack gap={4} ax="stretch" fullwidth>
      <Input label="Input" />
      <Input
        label="Input with description"
        description="This is a description"
      />
      <Input label="Input with hint" hint="This is a hint" />
      <Input label="Input with clear" enableClear />
      <Input
        label="Input with error"
        errorMessage="This is an error"
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
