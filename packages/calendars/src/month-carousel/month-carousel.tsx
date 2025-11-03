"use client";

import { enUS } from "date-fns/locale";
import { useMemo } from "react";

import { Button } from "@uiid/buttons";
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

  return (
    <Carousel
      slides={MONTH_NAMES.map((month) => ({
        id: month,
        render: <MonthCarouselSlide month={month} />,
      }))}
      previousButton={{
        render: (
          <Button
            aria-label="Previous month"
            tooltip="Previous month"
            icon={<ChevronLeft />}
            variant="subtle"
            size="sm"
          />
        ),
        onClick: () => console.log("previous"),
      }}
      nextButton={{
        render: (
          <Button
            aria-label="Next month"
            tooltip="Next month"
            icon={<ChevronRight />}
            variant="subtle"
            size="sm"
          />
        ),
        onClick: () => console.log("next"),
      }}
    />
  );
};
MonthCarousel.displayName = "MonthCarousel";
