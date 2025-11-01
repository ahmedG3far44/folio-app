// src/Tiptap.tsx
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  LucideBadge,
  LucideBold,
  LucideCode,
  LucideHeading1,
  LucideHeading2,
  LucideHeading3,
  LucideHeading4,
  LucideItalic,
  LucideList,
  LucideListOrdered,
  LucideRedo,
  LucideSeparatorHorizontal,
  LucideStrikethrough,
  LucideUndo,
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
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("bold")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideBold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("italic")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideItalic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("strike")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideStrikethrough size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("code")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideCode size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("paragraph")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideBadge size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("heading", { level: 1 })
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideHeading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("heading", { level: 2 })
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideHeading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("heading", { level: 3 })
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideHeading3 size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("heading", { level: 4 })
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideHeading4 size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("bulletList")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideList size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("orderedList")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("horizontalRule")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideSeparatorHorizontal size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("undo")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideUndo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("redo") || editor.isActive("undo")
              ? activeTheme.cardColor
              : activeTheme.backgroundColor
          }`}
        >
          <LucideRedo size={16} />
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
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      onUpdate={({ editor }) => {
        setContent(editor.getHTML());
      }}
    />
  );
}

export default Tiptap;
