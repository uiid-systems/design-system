import { Stack, type StackProps } from "@uiid/layout";

import styles from "./rendered-container.module.css";

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
      fullwidth
      fullheight
      {...props}
    >
      {children}
    </Stack>
  );
};
RenderedContainer.displayName = "RenderedContainer";
