import { resolveLanguage } from "../../highlighter/highlighter";
import type {
  BundledLanguage,
  CodeLanguage,
} from "../../highlighter/highlighter.types";
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

/**
 * The icon `LanguageIcon` draws for a language or an alias of one, with the
 * resolved language name. Other names have no icon. Kept out of the barrel.
 */
export const getLanguageIcon = (language: CodeLanguage | undefined) => {
  const resolved = language ? resolveLanguage(language) : undefined;
  const icon = resolved ? LANGUAGE_ICONS[resolved] : undefined;
  return resolved && icon ? { language: resolved, ...icon } : undefined;
};
