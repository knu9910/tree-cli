import { cn } from '@/lib/utils';
import { AlignLeft } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const TextAlignLeft = ({ className, editor }: Readonly<Props>) => {
  const isActive = useIsActive(editor, 'textAlign', { textAlign: 'left' });

  if (!editor) return null;

  const alignLeft = () => editor.chain().setTextAlign('left').run();

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper
        onClick={alignLeft}
        data-state={isActive ? 'on' : 'off'}
        className={cn(isActive && 'bg-blue-100')}
      >
        <IconButton data-state={isActive ? 'on' : 'off'} className={cn(isActive && 'text-blue-600')}>
          <AlignLeft />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
