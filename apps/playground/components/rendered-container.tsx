import { Stack, type StackProps } from "@uiid/layout";

type RenderedContainerProps = StackProps;

export const RenderedContainer = ({
  children,
  ...props
}: RenderedContainerProps) => {
  return (
    <Stack
      data-slot="rendered-container"
      ay="center"
      ax="center"
      p={16}
      fullwidth
      fullheight
      {...props}
    >
      {children}
    </Stack>
  );
};
RenderedContainer.displayName = "RenderedContainer";
