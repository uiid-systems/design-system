import "./styles/index.css";

import {
  EditorContent,
  EditorContext,
  type Content,
  type Editor,
} from "@tiptap/react";

import { Card } from "@uiid/cards";
import { Group, Separator } from "@uiid/layout";
import { cx } from "@uiid/utils";

import {
  useRichTextEditor,
  useEditorInstance,
  type UseRichTextEditorProps,
} from "./hooks";

import {
  LinkBubbleMenu,
  MeasuredContainer,
  Section1,
  Section2,
  Section3,
} from "./subcomponents";

import styles from "./rich-text-editor.module.css";

export interface RichTextEditorProps
  extends Omit<UseRichTextEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div data-slot="toolbar-container" className={styles["toolbar-container"]}>
    <Group ay="center" gap={1} fullwidth>
      <Section1 editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" style={{ marginInline: "0.5rem" }} />

      <Section2
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

      <Separator orientation="vertical" style={{ marginInline: "0.5rem" }} />

      <Section3 editor={editor} />

      {/* 

      <Separator orientation="vertical" className="mx-2" />


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
    </Group>
  </div>
);
Toolbar.displayName = "Toolbar";

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
    <MeasuredContainer
      render={<Card gap={0} trimmed fullwidth />}
      name="editor"
    >
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
