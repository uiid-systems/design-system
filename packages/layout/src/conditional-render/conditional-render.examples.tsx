import { ConditionalRender } from "./conditional-render";
import { Box } from "../box/box";
import { Stack } from "../stack/stack";

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

type LabelProps = {
  href?: string;
  children: React.ReactNode;
};
const Label = ({ href, children }: LabelProps) => (
  <ConditionalRender
    condition={Boolean(href)}
    render={<a href={href} style={{ color: "dodgerblue" }} />}
  >
    {children}
  </ConditionalRender>
);

export const ConditionalLink = () => (
  <Stack gap={2}>
    <Label href="https://example.com">With href — renders as a link</Label>
    <Label>Without href — renders as plain text</Label>
  </Stack>
);
