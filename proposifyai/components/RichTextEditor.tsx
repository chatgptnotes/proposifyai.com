'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, useEffect } from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import { motion } from 'framer-motion';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  editable = true,
  minHeight = '300px',
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[' + minHeight + '] p-4',
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!isMounted) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />;
  }

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      {/* Toolbar */}
      {editable && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Cmd+B)"
            >
              <FormatBoldIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Cmd+I)"
            >
              <FormatItalicIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline Code"
            >
              <CodeIcon fontSize="small" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <span className="text-sm font-bold">H1</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <span className="text-sm font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <span className="text-sm font-bold">H3</span>
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <FormatListBulletedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <FormatListNumberedIcon fontSize="small" />
            </ToolbarButton>
          </div>

          {/* Blocks */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <FormatQuoteIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              title="Code Block"
            >
              <CodeIcon fontSize="small" />
            </ToolbarButton>
          </div>

          {/* History */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Cmd+Z)"
            >
              <UndoIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Cmd+Shift+Z)"
            >
              <RedoIcon fontSize="small" />
            </ToolbarButton>
          </div>

          {/* Clear Formatting */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              title="Clear Formatting"
            >
              <FormatClearIcon fontSize="small" />
            </ToolbarButton>
          </div>

          {/* Character Count */}
          <div className="ml-auto flex items-center px-3 text-xs text-gray-500 dark:text-gray-400">
            {editor.state.doc.textContent.split(/\s+/).filter(w => w.length > 0).length} words
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-800">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none"
        />
      </div>

      {/* Footer with character count */}
      {editable && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{editor.state.doc.textContent.length} characters</span>
          <span className="italic">Press Tab for formatting options</span>
        </div>
      )}
    </div>
  );
}
