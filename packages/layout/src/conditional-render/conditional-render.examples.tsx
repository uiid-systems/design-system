import { Box } from "../box/box";
import { ConditionalRender } from "./conditional-render";

export const Wrapped = () => (
  <ConditionalRender condition={true} render={<Box b={1} p={2} />}>
    Wrapped in a bordered Box because condition is true
  </ConditionalRender>
);

export const Unwrapped = () => (
  <ConditionalRender condition={false} render={<Box b={1} p={2} />}>
    Rendered as plain text because condition is false
  </ConditionalRender>
);

export const ConditionalLink = ({ href = "#" }: { href?: string }) => (
  <ConditionalRender condition={!!href} render={<a href={href} />}>
    element renders as a link because an href ({href}) is present
  </ConditionalRender>
);
