"use client";

import { enUS } from "date-fns/locale";
import { useMemo } from "react";

import { ChevronLeft, ChevronRight } from "@uiid/icons";
import { Carousel } from "@uiid/interactive";

import { getMonthNames } from "../calendars.utils";

import type { MonthCarouselProps } from "./month-carousel.types";
import { MonthCarouselSlide } from "./subcomponents";

export const MonthCarousel = ({
  locale = enUS,
  monthFormat = "abbreviated",
}: MonthCarouselProps) => {
  const MONTH_NAMES = useMemo(() => {
    return getMonthNames({ locale, width: monthFormat });
  }, [monthFormat]);

  const slides = MONTH_NAMES.map((month) => ({
    id: month,
    render: <MonthCarouselSlide month={month} />,
  }));

  return (
    <Carousel
      ay="center"
      gap={1}
      slidesInView={3}
      size="3rem"
      previousButton={{
        render: <ChevronLeft size={16} strokeWidth={4} />,
      }}
      nextButton={{
        render: <ChevronRight size={16} strokeWidth={4} />,
      }}
      slides={slides}
    />
  );
};
MonthCarousel.displayName = "MonthCarousel";
