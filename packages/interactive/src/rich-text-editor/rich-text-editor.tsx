import "./styles/index.css";

import {
  EditorContent,
  EditorContext,
  type Content,
  type Editor,
} from "@tiptap/react";

import { Separator } from "@uiid/layout";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import {
  useRichTextEditor,
  useEditorInstance,
  type UseRichTextEditorProps,
} from "./hooks";

import { Section1 } from "./subcomponents/section-1";
// import { SectionTwo } from "./components/section/two";
// import { SectionThree } from "./components/section/three";
// import { SectionFour } from "./components/section/four";
// import { SectionFive } from "./components/section/five";
import { LinkBubbleMenu, MeasuredContainer } from "./subcomponents";

export interface RichTextEditorProps
  extends Omit<UseRichTextEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      <Section1 editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2" />

      {/* <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      /> */}
    </div>
  </div>
);

export const RichTextEditor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: RichTextEditorProps) => {
  const editor = useRichTextEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <MainRichTextEditor
        editor={editor}
        className={className}
        editorContentClassName={editorContentClassName}
      />
    </EditorContext.Provider>
  );
};
RichTextEditor.displayName = "RichTextEditor";

export const MainRichTextEditor = ({
  editor: providedEditor,
  editorContentClassName,
}: RichTextEditorProps & { editor: Editor }) => {
  const { editor } = useEditorInstance(providedEditor);

  if (!editor) {
    return null;
  }

  return (
    <MeasuredContainer render={<Card trimmed />} name="editor">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cx("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
};
MainRichTextEditor.displayName = "MainRichTextEditor";
