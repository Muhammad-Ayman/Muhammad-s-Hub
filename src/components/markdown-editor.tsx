'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  height = 400,
}: MarkdownEditorProps) {
  return (
    <div className='markdown-editor-wrapper'>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview='edit'
        hideToolbar={false}
        data-color-mode='auto'
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          },
        }}
      />

      <style jsx global>{`
        .markdown-editor-wrapper .w-md-editor {
          background-color: transparent;
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .markdown-editor-wrapper .w-md-editor.w-md-editor-focus {
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        .markdown-editor-wrapper .w-md-editor-text-pre,
        .markdown-editor-wrapper .w-md-editor-text-input,
        .markdown-editor-wrapper .w-md-editor-text {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }

        .markdown-editor-wrapper .w-md-editor-bar {
          background-color: hsl(var(--muted)) !important;
          border-bottom: 1px solid hsl(var(--border));
        }

        .markdown-editor-wrapper .w-md-editor-bar button {
          color: hsl(var(--muted-foreground)) !important;
          border-radius: 0.375rem;
          margin: 0 1px;
        }

        .markdown-editor-wrapper .w-md-editor-bar button:hover {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }

        .markdown-editor-wrapper .w-md-editor-bar button.active {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }

        [data-theme='dark'] .markdown-editor-wrapper .w-md-editor {
          background-color: hsl(var(--background));
        }
      `}</style>
    </div>
  );
}
