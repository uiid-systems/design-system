import { Box } from "../box/box";
import type { BoxProps } from "../box/box.types";
import { Group } from "../group/group";
import { Stack } from "../stack/stack";
import { SwitchRender } from "./switch-render";

type ExampleBoxProps = BoxProps & {
  bg?: React.CSSProperties["backgroundColor"];
};
const ExampleBox = ({ bg, ...props }: ExampleBoxProps) => (
  <Box
    h={64}
    w={64}
    bordered
    rounded
    style={{ backgroundColor: bg, ...props.style }}
    {...props}
  />
);

export const TrueBranch = () => (
  <SwitchRender
    condition={true}
    render={{
      true: (
        <Box
          bordered
          p={2}
          rounded
          style={{ backgroundColor: "rgba(0, 200, 0, 0.12)" }}
        />
      ),
      false: (
        <Box
          bordered
          p={2}
          rounded
          style={{ backgroundColor: "rgba(220, 50, 50, 0.12)" }}
        />
      ),
    }}
  >
    Wrapped in the green-tinted Box (condition is true)
  </SwitchRender>
);

export const FalseBranch = () => (
  <SwitchRender
    condition={false}
    render={{
      true: (
        <Box
          bordered
          p={2}
          rounded
          style={{ backgroundColor: "rgba(0, 200, 0, 0.12)" }}
        />
      ),
      false: (
        <Box
          bordered
          p={2}
          rounded
          style={{ backgroundColor: "rgba(220, 50, 50, 0.12)" }}
        />
      ),
    }}
  >
    Wrapped in the red-tinted Box (condition is false)
  </SwitchRender>
);

const renderItems = () => (
  <>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </>
);

export const Orientation = () => (
  <Stack gap={4}>
    <SwitchRender
      condition={true}
      render={{
        true: <Group gap={2} />,
        false: <Stack gap={2} />,
      }}
    >
      {renderItems()}
    </SwitchRender>
    <SwitchRender
      condition={false}
      render={{
        true: <Group gap={2} />,
        false: <Stack gap={2} />,
      }}
    >
      {renderItems()}
    </SwitchRender>
  </Stack>
);
