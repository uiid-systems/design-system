import { Box } from "../box/box";
import type { BoxProps } from "../box/box.types";
import { Group } from "../group/group";
import { Stack } from "../stack/stack";
import { Separator } from "./separator";
import type { SeparatorProps } from "./separator.types";

type ExampleBoxProps = BoxProps & {
  bg?: React.CSSProperties["backgroundColor"];
};
export const ExampleBox = ({ bg, ...props }: ExampleBoxProps) => (
  <Box
    bordered
    rounded
    style={{ backgroundColor: bg, ...props.style }}
    {...props}
  />
);

const SHADES: NonNullable<SeparatorProps["shade"]>[] = [
  "background",
  "surface",
  "accent",
  "halftone",
  "muted",
  "foreground",
];

export const Horizontal = () => (
  <Stack ax="stretch" gap={4} fullwidth maxw={400}>
    <ExampleBox bg="tomato" h={48} />
    <Separator shade="halftone" />
    <ExampleBox bg="gold" h={48} />
  </Stack>
);

export const Vertical = () => (
  <Group ay="stretch" gap={4} h={160}>
    <ExampleBox bg="tomato" w={80} />
    <Separator shade="halftone" orientation="vertical" />
    <ExampleBox bg="gold" w={80} />
  </Group>
);

export const WithChildren = () => (
  <Stack ax="stretch" gap={4} fullwidth maxw={400}>
    <ExampleBox bg="dodgerblue" h={48} />
    <Separator shade="halftone">
      <Box px={2}>
        <strong>OR</strong>
      </Box>
    </Separator>
    <ExampleBox bg="mediumseagreen" h={48} />
  </Stack>
);

export const Shades = () => (
  <Stack ax="stretch" gap={4} fullwidth maxw={400}>
    {SHADES.map((shade) => (
      <Stack key={shade} ax="stretch" gap={1} fullwidth>
        <Box>{shade}</Box>
        <Separator shade={shade} />
      </Stack>
    ))}
  </Stack>
);
