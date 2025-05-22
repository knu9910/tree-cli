'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import FontSize from 'tiptap-extension-font-size';
import { CustomImage, YouTubeVideo } from '../extended';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

// 기본적인 Tiptap extensions 설정 (필요시 추가 가능)
const EditorContext = createContext<Editor | null>(null);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const editor = useEditor({
    extensions: [
      Color,
      Highlight.configure({ multicolor: true }),
      StarterKit,
      Underline,
      FontFamily,
      TextStyle,
      FontSize,
      CustomImage,
      YouTubeVideo,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'right', 'center'],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'font-bold hover:text-orange-600 hover:underline', // TailwindCSS 클래스 적용
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
      attributes: {
        class: 'h-full',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null; // Editor가 초기화되지 않았다면 아무것도 렌더링하지 않음

  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
};
// useEditor 훅을 통해 다른 컴포넌트에서 editor에 접근할 수 있습니다.
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};
