import type { BundledLanguage } from "../../highlighter/highlighter.types";
import bashSvg from "./bash-original.svg?raw";
import css3Svg from "./css3-original.svg?raw";
import html5Svg from "./html5-original.svg?raw";
import javascriptSvg from "./javascript-original.svg?raw";
import jsonSvg from "./json-original.svg?raw";
import markdownSvg from "./markdown-original.svg?raw";
import pythonSvg from "./python-original.svg?raw";
import reactSvg from "./react-original.svg?raw";
import typescriptSvg from "./typescript-original.svg?raw";

type ParsedIcon = { viewBox: string; body: string };

function parseSvg(svg: string): ParsedIcon {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 128 128";
  const body = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1] ?? "";
  return { viewBox, body };
}

const LANGUAGE_ICONS: Partial<Record<BundledLanguage, ParsedIcon>> = {
  typescript: parseSvg(typescriptSvg),
  tsx: parseSvg(reactSvg),
  javascript: parseSvg(javascriptSvg),
  jsx: parseSvg(reactSvg),
  python: parseSvg(pythonSvg),
  html: parseSvg(html5Svg),
  css: parseSvg(css3Svg),
  json: parseSvg(jsonSvg),
  bash: parseSvg(bashSvg),
  markdown: parseSvg(markdownSvg),
};

export type LanguageIconProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "dangerouslySetInnerHTML"
> & {
  language: BundledLanguage;
  size?: number | string;
};

export const LanguageIcon = ({
  language,
  size = 16,
  ...props
}: LanguageIconProps) => {
  const icon = LANGUAGE_ICONS[language];
  if (!icon) return null;
  return (
    <svg
      data-slot="language-icon"
      data-language={language}
      role="img"
      aria-label={language}
      viewBox={icon.viewBox}
      width={size}
      height={size}
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
};
LanguageIcon.displayName = "LanguageIcon";
