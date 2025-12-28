import { Button, type ButtonProps } from "@uiid/buttons";

export const ActionButton = ({ tooltip, children, ...props }: ButtonProps) => (
  <Button variant="subtle" size="sm" tooltip={tooltip} square {...props}>
    {children}
  </Button>
);
ActionButton.displayName = "ActionButton";
