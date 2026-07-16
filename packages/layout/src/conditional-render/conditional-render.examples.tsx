import { ConditionalRender } from "./conditional-render";
import { Box } from "../box/box";

export const Wrapped = () => (
  <ConditionalRender condition={true} render={<Box bordered p={2} rounded />}>
    Wrapped in a bordered Box because condition is true
  </ConditionalRender>
);

export const Unwrapped = () => (
  <ConditionalRender condition={false} render={<Box bordered p={2} rounded />}>
    Rendered as plain text because condition is false
  </ConditionalRender>
);

export const ConditionalLink = ({ href = "#" }: { href?: string }) => (
  <ConditionalRender condition={!!href} render={<a href={href} />}>
    element renders as a link because an href ({href}) is present
  </ConditionalRender>
);
