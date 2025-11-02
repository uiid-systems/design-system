import { Group, type GroupProps } from "@uiid/layout";

export type CarouselContainerProps = GroupProps;

export const CarouselContainer = ({
  children,
  ...props
}: CarouselContainerProps) => {
  return (
    <Group
      uiid="carousel"
      role="region"
      aria-roledescription="carousel"
      gap={2}
      {...props}
    >
      {children}
    </Group>
  );
};
CarouselContainer.displayName = "CarouselContainer";
