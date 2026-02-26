import { Button, type ButtonProps } from "@uiid/buttons";

export const ActionButton = ({ tooltip, children, ...props }: ButtonProps) => (
  <Button
    variant="subtle"
    size="small"
    tooltip={tooltip}
    shape="square"
    {...props}
  >
    {children}
  </Button>
);
ActionButton.displayName = "ActionButton";
