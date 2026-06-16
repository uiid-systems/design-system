import { Heart, Moon, Sun } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";

import { ToggleButton } from "./toggle-button";

export const Default = () => <ToggleButton>Favorite</ToggleButton>;

export const Pressed = () => (
  <Group gap={2}>
    <ToggleButton>Unpressed</ToggleButton>
    <ToggleButton defaultPressed>Pressed</ToggleButton>
    <ToggleButton disabled>Disabled</ToggleButton>
    <ToggleButton disabled defaultPressed>
      Disabled pressed
    </ToggleButton>
  </Group>
);

export const DynamicIcon = () => (
  <Group gap={2}>
    <ToggleButton
      shape="square"
      aria-label="Favorite"
      icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
    />
    <ToggleButton
      icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
    >
      Favorite
    </ToggleButton>
  </Group>
);

export const DynamicText = () => (
  <Group gap={2}>
    <ToggleButton
      variant="subtle"
      text={{ pressed: "Following", unpressed: "Follow" }}
    />
    <ToggleButton text={{ pressed: "Saved", unpressed: "Save" }} />
  </Group>
);

export const IconAndText = () => (
  <Stack gap={2} maxw={320}>
    <ToggleButton
      variant="subtle"
      icon={{ pressed: <Sun stroke="gold" />, unpressed: <Moon /> }}
      text={{ pressed: "Light mode", unpressed: "Dark mode" }}
    />
    <ToggleButton
      icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
      text={{ pressed: "Liked", unpressed: "Like" }}
    />
  </Stack>
);
