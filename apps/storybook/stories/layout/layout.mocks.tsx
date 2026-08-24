import { Box, type BoxProps } from "@uiid/design-system";

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
