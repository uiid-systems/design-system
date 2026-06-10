import { Group } from "./group";
import { Box } from "../box/box";
import type { BoxProps } from "../box/box.types";

const GAP = 2;

type ExampleBoxProps = BoxProps & {
  bg?: React.CSSProperties["backgroundColor"];
};
export const ExampleBox = ({ bg, ...props }: ExampleBoxProps) => (
  <Box
    h={64}
    w={64}
    bordered
    rounded
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

export const Polymorphic = () => (
  <Group render={<header />} p={GAP} gap={GAP}>
    Parent element rendered as &lt;header&gt; instead of &lt;div&gt;
  </Group>
);
