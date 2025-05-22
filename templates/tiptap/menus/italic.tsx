import { useEditorContext } from '../context/editor-context';
import { cn } from '@/lib/utils';
import { ItalicIcon } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';

type Props = React.HTMLAttributes<HTMLElement>;

export const Italic = ({ className }: Readonly<Props>) => {
  const editor = useEditorContext();
  const isActive = useIsActive(editor, 'italic');
  const toggleItalic = () => editor.chain().toggleItalic().run();

  if (!editor) return null;

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper onClick={toggleItalic} data-state={isActive ? 'on' : 'off'}>
        <IconButton data-state={isActive ? 'on' : 'off'}>
          <ItalicIcon />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
