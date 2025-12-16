import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";
import { ChevronLeftIcon, ChevronRightIcon } from "@uiid/icons";
import { Text } from "@uiid/typography";

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
    <Group ay="center" gap={4}>
      <HeaderButton label="Jump to today" onClick={handleToday}>
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
  children,
}: {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <Button
      aria-label={label}
      onClick={onClick}
      variant="ghost"
      size="sm"
      icon={icon}
      square
    >
      {children}
    </Button>
  );
};
