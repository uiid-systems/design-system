import { cx } from "@uiid/utils";
import { Stack, type StackProps } from "@uiid/layout";

export const PageContainer = ({
  gap = 8,
  className,
  children,
  ...props
}: StackProps) => {
  return (
    <main className="p-8 w-full">
      <Stack
        fullwidth
        gap={gap}
        className={cx("max-w-7xl", className)}
        {...props}
      >
        {children}
      </Stack>
    </main>
  );
};
PageContainer.displayName = "PageContainer";
