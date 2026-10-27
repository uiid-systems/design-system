import { Box } from "./box";
import type { BoxProps } from "./box.types";

const commonProps: BoxProps = { b: 1 };

export const Centered = () => (
  <Box ax="center" ay="center" h={240} {...commonProps}>
    Centered along both axes
  </Box>
);

export const WithSpacing = () => (
  <Box p={4} m={2} {...commonProps}>
    Padding 4 on all sides, margin 2 around the box
  </Box>
);

export const Polymorphic = () => (
  <Box render={<section />} p={4} {...commonProps}>
    Rendered as &lt;section&gt; instead of &lt;div&gt;
  </Box>
);

export const Grow = () => (
  <Box direction="column" gap={2} h={240} p={2} {...commonProps}>
    <Box p={3} {...commonProps}>
      Header at its content height
    </Box>
    <Box grow p={3} {...commonProps}>
      grow takes the rest of the 240px column
    </Box>
  </Box>
);
