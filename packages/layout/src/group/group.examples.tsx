import { Box } from "../box/box";
import type { BoxProps } from "../box/box.types";
import { Group } from "./group";

const GAP = 2;

type ExampleBoxProps = BoxProps & {
  bg?: React.CSSProperties["backgroundColor"];
};
export const ExampleBox = ({ bg, ...props }: ExampleBoxProps) => (
  <Box
    h={64}
    w={64}
    b={1}
    style={{ backgroundColor: bg, ...props.style }}
    {...props}
  />
);

export const Centered = () => (
  <Group ax="center" gap={GAP}>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Group>
);

export const Evenly = () => (
  <Group gap={GAP} evenly fullwidth>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Group>
);

export const Proportional = () => (
  <Group gap={GAP} fullwidth>
    <ExampleBox bg="tomato" flex={1}>
      1
    </ExampleBox>
    <ExampleBox bg="gold" flex={2}>
      2
    </ExampleBox>
    <ExampleBox bg="dodgerblue" flex="none">
      none
    </ExampleBox>
  </Group>
);

export const Wrapped = () => (
  <Group gap={GAP} wrap maxw={240}>
    {["tomato", "gold", "dodgerblue", "mediumseagreen", "orchid"].map((bg) => (
      <ExampleBox key={bg} bg={bg} />
    ))}
  </Group>
);

export const Polymorphic = () => (
  <Group render={<header />} p={GAP} gap={GAP}>
    Parent element rendered as &lt;header&gt; instead of &lt;div&gt;
  </Group>
);
