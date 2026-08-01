import { Box } from "../box/box";
import type { BoxProps } from "../box/box.types";
import { Stack } from "./stack";

type ExampleBoxProps = BoxProps & {
  bg?: React.CSSProperties["backgroundColor"];
};
export const ExampleBox = ({ bg, ...props }: ExampleBoxProps) => (
  <Box
    h={48}
    bordered
    rounded
    style={{ backgroundColor: bg, ...props.style }}
    {...props}
  />
);

export const Stretched = () => (
  <Stack ax="stretch" gap={2} fullwidth>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Stack>
);

export const Centered = () => (
  <Stack ax="center" ay="center" gap={2} h={240} fullwidth>
    <ExampleBox bg="tomato" w={120} />
    <ExampleBox bg="gold" w={120} />
    <ExampleBox bg="dodgerblue" w={120} />
  </Stack>
);

export const Polymorphic = () => (
  <Stack render={<section />} gap={2}>
    Rendered as &lt;section&gt; instead of &lt;div&gt;
  </Stack>
);
