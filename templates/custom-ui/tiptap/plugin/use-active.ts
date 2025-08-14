import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

export const useIsActive = (editor: Editor | null, type: string, attrs?: Record<string, any>) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      if (type === 'textAlign' && attrs?.textAlign) {
        // 직접 노드의 textAlign 속성 검사
        const { state } = editor;
        const { from, to } = state.selection;
        let found = false;
        state.doc.nodesBetween(from, to, (node) => {
          if (
            (node.type.name === 'paragraph' || node.type.name === 'heading') &&
            node.attrs.textAlign === attrs.textAlign
          ) {
            found = true;
          }
        });
        setIsActive(found);
      } else {
        setIsActive(editor.isActive(type, attrs));
      }
    };

    update();
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor, type, JSON.stringify(attrs)]);

  return isActive;
};
