/**
 * The text a piece of highlighter markup paints, read from its `<code>`
 * element. The markup is parsed in an inert `<template>`, so nothing in it
 * runs or loads. Returns `""` for no markup, and on the server, where there is
 * no document to parse with.
 */
export function textOfMarkup(html: string): string {
  if (!html || typeof document === "undefined") return "";
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.querySelector("code")?.textContent ?? "";
}
