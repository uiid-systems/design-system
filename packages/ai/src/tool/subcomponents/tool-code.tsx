import { Prose } from "@uiid/typography";

/* Prose already styles a `pre` the way Markdown renders a fence: the surface
   fill, the mono face and horizontal scroll. So the tool body matches a fenced
   block in the reply above it, at no bundle cost. */
export const ToolCode = ({ children }: { children: string }) => (
  <Prose data-slot="tool-code">
    <pre>
      <code>{children}</code>
    </pre>
  </Prose>
);
ToolCode.displayName = "ToolCode";
