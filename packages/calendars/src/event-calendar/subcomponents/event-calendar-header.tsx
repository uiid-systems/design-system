import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";
import {
  Calendar,
  ChevronLeftIcon,
  ChevronRightIcon,
  type Icon,
} from "@uiid/icons";
import { Text } from "@uiid/typography";

import styles from "./event-calendar-header.module.css";

type EventCalendarHeaderProps = {
  handleToday: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  viewTitle?: string;
};

export const EventCalendarHeader = ({
  handleToday,
  handlePrevious,
  handleNext,
  viewTitle,
}: EventCalendarHeaderProps) => {
  return (
    <Group
      ay="center"
      gap={4}
      py={4}
      px={2}
      fullwidth
      className={styles["event-calendar-header"]}
    >
      <Group ay="center" gap={2}>
        <HeaderButton
          label="Jump to today"
          onClick={handleToday}
          icon={Calendar}
        />

        <HeaderButton
          label="Previous"
          onClick={handlePrevious}
          icon={ChevronLeftIcon}
        />
        <HeaderButton
          label="Next"
          onClick={handleNext}
          icon={ChevronRightIcon}
        />
      </Group>
      <Text size={2} bold>
        {viewTitle}
      </Text>
    </Group>
  );
};
EventCalendarHeader.displayName = "EventCalendarHeader";

const HeaderButton = ({
  onClick,
  icon: Icon,
  label,
  square = true,
  children,
}: {
  onClick: () => void;
  label: string;
  icon?: Icon;
  children?: React.ReactNode;
  square?: boolean;
}) => {
  return (
    <Button
      aria-label={label}
      tooltip={label}
      onClick={onClick}
      variant="ghost"
      size="sm"
      square={square}
    >
      <>
        {Icon && <Icon />}
        {children}
      </>
    </Button>
  );
};
