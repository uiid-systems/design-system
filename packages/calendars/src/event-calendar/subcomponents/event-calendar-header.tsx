import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";
import { ChevronLeftIcon, ChevronRightIcon } from "@uiid/icons";
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
      <HeaderButton label="Jump to today" onClick={handleToday} square={false}>
        Today
      </HeaderButton>

      <Group ay="center" gap={2}>
        <HeaderButton
          label="Previous"
          onClick={handlePrevious}
          icon={<ChevronLeftIcon />}
        />
        <HeaderButton
          label="Next"
          onClick={handleNext}
          icon={<ChevronRightIcon />}
        />
      </Group>
      <Text level={2} bold>
        {viewTitle}
      </Text>
    </Group>
  );
};
EventCalendarHeader.displayName = "EventCalendarHeader";

const HeaderButton = ({
  onClick,
  icon,
  label,
  square = true,
  children,
}: {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  square?: boolean;
}) => {
  return (
    <Button
      aria-label={label}
      onClick={onClick}
      variant="ghost"
      size="sm"
      icon={icon}
      square={square}
    >
      {children}
    </Button>
  );
};
