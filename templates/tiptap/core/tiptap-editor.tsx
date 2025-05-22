'use client';
import styles from './tiptap-editor.module.css';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '../context/editor-context';
import { useEffect } from 'react';
import { useContentStore } from '@/components/ui/tiptap/plugin';
import { cn } from '@/lib/utils';
import { Toolbar } from './toolbar';
import { ScrollArea } from '../../scroll-area/scroll-area';
import { TableContextMenu } from '../menus/table-context-menu';

type Props = React.HTMLAttributes<HTMLElement> & {
  keyId: string;
  height?: number;
};

export const TiptapEditor = ({ className, keyId, height = 400 }: Props) => {
  const editor = useEditorContext();
  const { getContent, setContent } = useContentStore();

  useEffect(() => {
    const initial = getContent(keyId);
    if (editor && initial && editor.getHTML() !== initial) {
      editor.commands.setContent(initial);
    }
  }, [editor, keyId, getContent]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      setContent(keyId, editor.getHTML());
    };
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, setContent, keyId]);

  if (!editor) return null;

  return (
    <div className={`${cn('border rounded-xl relative', className)}`}>
      <Toolbar />
      <ScrollArea style={{ height: `${height}px` }}>
        <EditorContent
          editor={editor}
          className={cn(
            'p-6 border-none [&>.tiptap]:!outline-none',
            '[&_.resize-cursor]:cursor-col-resize',
            styles.tiptapGlobalStyles,
            className
          )}
          style={{ height: `${height}px` }}
        />
        <TableContextMenu />
      </ScrollArea>
    </div>
  );
};
