import { useRef } from "react";

import { Box, type BoxProps } from "@uiid/layout";

import { useContainerSize } from "../hooks";

type MeasuredContainerProps = BoxProps & {
  name?: string;
};

export const MeasuredContainer = ({
  name,
  children,
  style = {},
  ...props
}: MeasuredContainerProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const rect = useContainerSize(innerRef.current);

  const customStyle: React.CSSProperties = {
    [`--${name}-width`]: `${rect.width}px`,
    [`--${name}-height`]: `${rect.height}px`,
  };

  return (
    <Box
      data-slot="measured-container"
      {...props}
      ref={innerRef}
      style={{ ...customStyle, ...style }}
    >
      {children}
    </Box>
  );
};
MeasuredContainer.displayName = "MeasuredContainer";
