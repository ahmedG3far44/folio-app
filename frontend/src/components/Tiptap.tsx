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
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideBold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("italic")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideItalic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("strike")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideStrikethrough size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("code")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideCode size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("paragraph")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
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
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
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
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
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
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
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
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideHeading4 size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("bulletList")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideList size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("orderedList")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
          }`}
        >
          <LucideListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`p-2 px-4 text-sm rounded-md border ${
            editor.isActive("horizontalRule")
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
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
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-950 border-zinc-950"
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
              ? "bg-zinc-950 border-zinc-950"
              : "bg-zinc-900 border-zinc-800"
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
