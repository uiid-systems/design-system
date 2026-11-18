import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";

import { Status } from "./status";

export const Default = () => <Status color="green">Online</Status>;

/* Without a label the dot is colour only, so give it a role and a name. */
export const DotOnly = () => (
  <Status role="img" aria-label="Online" color="green" />
);

export const Colors = () => (
  <Group gap={4} wrap>
    {PALETTE_HUES.map((color) => (
      <Status key={color} color={color}>
        {color}
      </Status>
    ))}
  </Group>
);

/* The dot pulses; with reduced motion it holds still at full opacity. */
export const Pulse = () => (
  <Status color="red" pulse>
    Recording
  </Status>
);

/* An uncoloured dot reads the shade scale; `inverted` swaps it. */
export const Inverted = () => (
  <Stack gap={2}>
    <Status>Idle</Status>
    <Status inverted>Idle, inverted</Status>
  </Stack>
);

/* The root is a `<span>`, so the dot sits inside a sentence. */
export const InText = () => (
  <Text render={<p />}>
    The build server is <Status color="green">online</Status> and taking jobs.
  </Text>
);
