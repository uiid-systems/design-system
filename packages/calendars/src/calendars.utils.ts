import type { Locale, Month, LocaleWidth } from "date-fns";
import { enUS } from "date-fns/locale";

export function getMonthNames({
  locale = enUS,
  width = "wide",
}: {
  locale?: Locale;
  width?: LocaleWidth;
}): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    locale.localize.month(i as Month, { width }),
  );
}
