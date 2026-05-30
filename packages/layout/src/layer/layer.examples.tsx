import { Layer } from "./layer";
import { Box } from "../box/box";
import type { BoxProps } from "../box/box.types";

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

export const Stacked = () => (
  <Layer>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Layer>
);

export const OffsetX = () => (
  <Layer offset={{ x: 20 }}>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Layer>
);

export const OffsetY = () => (
  <Layer offset={{ y: 20 }}>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Layer>
);

export const Diagonal = () => (
  <Layer offset={{ x: 20, y: 20 }}>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </Layer>
);

export const FragmentChildren = () => (
  <Layer offset={{ x: 20, y: 20 }}>
    <>
      <ExampleBox bg="tomato" />
      <ExampleBox bg="gold" />
      <ExampleBox bg="dodgerblue" />
    </>
  </Layer>
);

export const ComponentChildren = () => (
  <Layer offset={{ x: 20, y: 20 }}>
    <FragmentComponent />
  </Layer>
);

const FragmentComponent = () => (
  <>
    <ExampleBox bg="tomato" />
    <ExampleBox bg="gold" />
    <ExampleBox bg="dodgerblue" />
  </>
);
