import { cn } from '@/lib/utils';
import { Strikethrough } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const Strike = ({ className, editor }: Readonly<Props>) => {
  const isActive = useIsActive(editor, 'strike');

  if (!editor) return null;

  const toggleStrike = () => editor.chain().toggleStrike().run();

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper onClick={toggleStrike} data-state={isActive ? 'on' : 'off'}>
        <IconButton data-state={isActive ? 'on' : 'off'}>
          <Strikethrough />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
