import { HeartIcon } from "@uiid/icons/heart";
import { MoonIcon } from "@uiid/icons/moon";
import { SunIcon } from "@uiid/icons/sun";
import { Group } from "@uiid/layout";

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
      icon={{ pressed: <HeartIcon fill="red" />, unpressed: <HeartIcon /> }}
    />
    <ToggleButton
      icon={{ pressed: <HeartIcon fill="red" />, unpressed: <HeartIcon /> }}
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
  <Group gap={2}>
    <ToggleButton
      variant="subtle"
      icon={{ pressed: <SunIcon stroke="gold" />, unpressed: <MoonIcon /> }}
      text={{ pressed: "Light mode", unpressed: "Dark mode" }}
    />
    <ToggleButton
      icon={{ pressed: <HeartIcon fill="red" />, unpressed: <HeartIcon /> }}
      text={{ pressed: "Liked", unpressed: "Like" }}
    />
  </Group>
);
