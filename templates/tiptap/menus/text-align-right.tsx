import { useEditorContext } from '../context/editor-context';
import { cn } from '@/lib/utils';
import { AlignRight } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';

type Props = React.HTMLAttributes<HTMLElement>;

export const TextAlignRight = ({ className }: Readonly<Props>) => {
  const editor = useEditorContext();
  const isActive = useIsActive(editor, 'textAlign', { textAlign: 'right' });
  if (!editor) return null;

  const alignRight = () => {
    editor.chain().focus().setTextAlign('right').run();
  };

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper
        onClick={alignRight}
        data-state={isActive ? 'on' : 'off'}
        className={cn(isActive && 'bg-blue-100')}
      >
        <IconButton data-state={isActive ? 'on' : 'off'} className={cn(isActive && 'text-blue-600')}>
          <AlignRight />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
