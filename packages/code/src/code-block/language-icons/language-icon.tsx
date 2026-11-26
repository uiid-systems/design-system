import type { CodeLanguage } from "../../highlighter/highlighter.types";
import { getLanguageIcon } from "./language-icon.utils";

export type LanguageIconProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "dangerouslySetInnerHTML"
> & {
  /** A bundled language or an alias of one; other names render no icon */
  language: CodeLanguage;
  size?: number | string;
};

export const LanguageIcon = ({
  language: languageProp,
  size = 16,
  ...props
}: LanguageIconProps) => {
  const icon = getLanguageIcon(languageProp);
  if (!icon) return null;
  return (
    <svg
      data-slot="language-icon"
      data-language={icon.language}
      role="img"
      aria-label={icon.language}
      viewBox={icon.viewBox}
      width={size}
      height={size}
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
};
LanguageIcon.displayName = "LanguageIcon";
