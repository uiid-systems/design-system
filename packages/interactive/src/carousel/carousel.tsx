"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { Group, Stack, SwitchRender } from "@uiid/layout";

import { CarouselContext } from "./carousel.context";
import type { CarouselApi, CarouselComponentProps } from "./carousel.types";
import {
  CarouselContainer,
  CarouselContent,
  CarouselControl,
  CarouselSlide,
} from "./subcomponents";

export const Carousel = ({
  orientation = "horizontal",
  loop = true,
  align = "start",
  slides,
  options,
  setApi,
  plugins,
  previousButton,
  nextButton,
  ...props
}: CarouselComponentProps) => {
  if (!slides || slides.length === 0) {
    throw new Error(
      "Carousel requires at least one slide using the `slides` prop",
    );
  }

  const axis = orientation === "horizontal" ? "x" : "y";

  /** @see https://www.embla-carousel.com/api/methods/#reference */
  const [carouselRef, api] = useEmblaCarousel(
    { ...options, axis, loop, align },
    plugins,
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    previousButton?.onClick?.();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    nextButton?.onClick?.();
  }, [api, nextButton]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);
  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        options,
        orientation:
          orientation || (options?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <CarouselContainer onKeyDown={handleKeyDown} {...props}>
        {previousButton && (
          <CarouselControl
            aria-label="Previous"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            {previousButton?.render || "Previous"}
          </CarouselControl>
        )}

        <CarouselContent ref={carouselRef}>
          <SwitchRender
            condition={orientation === "horizontal"}
            render={{ true: <Group />, false: <Stack /> }}
          >
            {slides.map((slide) => (
              <CarouselSlide key={slide.id} id={slide.id} size={slide.size}>
                {slide.render}
              </CarouselSlide>
            ))}
          </SwitchRender>
        </CarouselContent>

        {nextButton && (
          <CarouselControl
            aria-label="Next"
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            {nextButton?.render || "Next"}
          </CarouselControl>
        )}
      </CarouselContainer>
    </CarouselContext.Provider>
  );
};
Carousel.displayName = "Carousel";
