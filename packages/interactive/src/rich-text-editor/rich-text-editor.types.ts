import type { Content, Editor } from "@tiptap/react";
import type { EditorView } from "@tiptap/pm/view";
import type { EditorState } from "@tiptap/pm/state";

import type { UseRichTextEditorProps } from "./hooks/use-rich-text-editor";

export interface LinkProps {
  url: string;
  text?: string;
  openInNewTab?: boolean;
}

export interface ShouldShowProps {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}

export interface FormatAction {
  label: string;
  value: string;
  icon?: React.ReactNode;
  shortcuts: string[];
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
  canExecute: (editor: Editor) => boolean;
}

export interface RichTextEditorProps
  extends Omit<UseRichTextEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}
