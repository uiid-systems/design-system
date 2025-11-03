import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";

import type { GroupProps } from "@uiid/layout";

export type CarouselApi = UseEmblaCarouselType[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselSlide = {
  id: string;
  render: React.ReactNode;
};

export type CarouselButtonProps = {
  render: React.ReactNode;
  onClick?: () => void;
};

export type CarouselProps = {
  options?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  loop?: NonNullable<CarouselOptions>["loop"];
  align?: NonNullable<CarouselOptions>["align"];
  setApi?: (api: CarouselApi) => void;
};

export type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

export type CarouselComponentProps = {
  size?: React.CSSProperties["width"];
  slides: CarouselSlide[];
  slidesInView?: number;
  previousButton?: CarouselButtonProps;
  nextButton?: CarouselButtonProps;
} & CarouselProps &
  GroupProps;
