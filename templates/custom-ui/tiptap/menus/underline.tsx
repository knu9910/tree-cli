import { cn } from '@/lib/utils';
import { Underline } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const UnderLine = ({ className, editor }: Readonly<Props>) => {
  const isActive = useIsActive(editor, 'underline');

  if (!editor) return null;

  const toggleUnderline = () => editor.chain().toggleUnderline().run();

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper onClick={toggleUnderline} data-state={isActive ? 'on' : 'off'}>
        <IconButton data-state={isActive ? 'on' : 'off'}>
          <Underline />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
