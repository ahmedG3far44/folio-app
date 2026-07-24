// src/Tiptap.tsx
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  Pilcrow,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  List,
  ListOrdered,
  Redo,
  SeparatorHorizontal,
  Strikethrough,
  Undo,
} from "lucide-react";
import { Card } from "./ui/card";
import { useTheme } from "@/contexts/ThemeProvider";

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const { activeTheme } = useTheme();

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-content">
      <Card
        style={{
          backgroundColor: activeTheme.backgroundColor,
          color: activeTheme.primaryText,
          borderColor: activeTheme.borderColor,
        }}
        className="button-group flex flex-wrap flex-row gap-2 mb-4  rounded-md p-2"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("bold") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("bold") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("italic") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("italic") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("strike") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("strike") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("code") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("code") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Code size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("paragraph") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("paragraph") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Pilcrow size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("heading", { level: 1 }) ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("heading", { level: 1 }) ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("heading", { level: 2 }) ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("heading", { level: 2 }) ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("heading", { level: 3 }) ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("heading", { level: 3 }) ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Heading3 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("heading", { level: 4 }) ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("heading", { level: 4 }) ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <Heading4 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("bulletList") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("bulletList") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md border text-sm ${
            editor.isActive("orderedList") ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            backgroundColor: editor.isActive("orderedList") ? activeTheme.cardColor : "transparent",
            borderColor: activeTheme.borderColor,
          }}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`p-1.5 rounded-md border text-sm opacity-60 hover:opacity-100`}
          style={{ borderColor: activeTheme.borderColor }}
        >
          <SeparatorHorizontal size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`p-1.5 rounded-md border text-sm opacity-60 hover:opacity-100 disabled:opacity-30`}
          style={{ borderColor: activeTheme.borderColor }}
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`p-1.5 rounded-md border text-sm opacity-60 hover:opacity-100 disabled:opacity-30`}
          style={{ borderColor: activeTheme.borderColor }}
        >
          <Redo size={16} />
        </button>
      </Card>
    </div>
  );
};

const extensions = [StarterKit];

function Tiptap({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  return (
    <div className="tiptap-editor">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          setContent(editor.getHTML());
        }}
      />
    </div>
  );
}

export default Tiptap;
