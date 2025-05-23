import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { BoldIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsActive } from '../plugin/use-active';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const Bold = ({ className, editor }: Readonly<Props>) => {
  const isActive = useIsActive(editor, 'bold');

  if (!editor) return null;

  const toggleBold = () => editor.chain().toggleBold().run();

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper onClick={toggleBold} data-state={isActive ? 'on' : 'off'}>
        <IconButton data-state={isActive ? 'on' : 'off'}>
          <BoldIcon />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
