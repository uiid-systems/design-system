"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { Group, Stack, SwitchRender } from "@uiid/layout";

import { CarouselContext } from "./carousel.context";
import type { CarouselApi, CarouselComponentProps } from "./carousel.types";
import {
  CarouselContainer,
  CarouselContent,
  CarouselSlide,
} from "./subcomponents";

export const Carousel = ({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  ...props
}: CarouselComponentProps) => {
  /** @see https://www.embla-carousel.com/api/methods/#reference */
  const axis = orientation === "horizontal" ? "x" : "y";
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis }, plugins);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

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
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <CarouselContainer onKeyDown={handleKeyDown} {...props}>
        <button onClick={scrollPrev} disabled={!canScrollPrev}>
          Previous
        </button>

        <CarouselContent ref={carouselRef}>
          <SwitchRender
            condition={orientation === "horizontal"}
            render={{ true: <Group />, false: <Stack /> }}
          >
            <CarouselSlide>Slide 1</CarouselSlide>
            <CarouselSlide>Slide 2</CarouselSlide>
            <CarouselSlide>Slide 3</CarouselSlide>
          </SwitchRender>
        </CarouselContent>

        <button onClick={scrollNext} disabled={!canScrollNext}>
          Next
        </button>
      </CarouselContainer>
    </CarouselContext.Provider>
  );
};
Carousel.displayName = "Carousel";
