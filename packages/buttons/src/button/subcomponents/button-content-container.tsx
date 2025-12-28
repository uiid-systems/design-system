import { Group, type GroupProps } from "@uiid/layout";

export type ButtonContentContainerProps = GroupProps;

export const ButtonContentContainer = ({
  children,
  ...props
}: ButtonContentContainerProps) => {
  return (
    <Group data-slot="button-content-container" ay="center" gap={2} {...props}>
      {children}
    </Group>
  );
};
ButtonContentContainer.displayName = "ButtonContentContainer";
