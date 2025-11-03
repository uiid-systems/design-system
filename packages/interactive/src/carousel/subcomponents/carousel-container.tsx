import { SwitchRender, Group, type GroupProps, Stack } from "@uiid/layout";

import type { CarouselProps } from "../carousel.types";

export type CarouselContainerProps = Omit<GroupProps, "ax" | "ay"> &
  Pick<CarouselProps, "orientation">;

export const CarouselContainer = ({
  orientation = "horizontal",
  children,
  ...props
}: CarouselContainerProps) => {
  const commonProps: CarouselContainerProps = {
    uiid: "carousel",
    ...props,
    role: "region",
    "aria-roledescription": "carousel",
    style: {
      ...props.style,
      width:
        orientation === "vertical" ? "var(--carousel-size, 100%)" : undefined,
    },
  };

  return (
    <SwitchRender
      condition={orientation === "horizontal"}
      render={{
        true: <Group fullwidth {...commonProps} />,
        false: <Stack {...commonProps} />,
      }}
    >
      {children}
    </SwitchRender>
  );
};
CarouselContainer.displayName = "CarouselContainer";
