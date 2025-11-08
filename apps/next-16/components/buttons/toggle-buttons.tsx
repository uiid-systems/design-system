import { ToggleButton } from "@uiid/buttons";
import { Sun, Moon } from "@uiid/icons";
import { Group } from "@uiid/layout";

export function ToggleButtons() {
  return (
    <Group gap={2}>
      <ToggleButton
        variant="subtle"
        icon={{
          pressed: <Sun stroke="gold" />,
          unpressed: <Moon stroke="aqua" />,
        }}
      />
      <ToggleButton
        variant="subtle"
        icon={{
          pressed: <Sun stroke="gold" />,
          unpressed: <Moon stroke="aqua" />,
        }}
        iconPosition="after"
      >
        Toggle theme
      </ToggleButton>
      <ToggleButton
        variant="subtle"
        text={{ pressed: "Dark Mode", unpressed: "Light Mode" }}
        icon={{
          pressed: <Sun stroke="gold" />,
          unpressed: <Moon stroke="aqua" />,
        }}
        iconPosition="after"
      >
        Light Mode
      </ToggleButton>
    </Group>
  );
}
