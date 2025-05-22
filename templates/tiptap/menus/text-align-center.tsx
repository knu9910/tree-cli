import { useEditorContext } from '../context/editor-context';
import { cn } from '@/lib/utils';
import { AlignCenter } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';

type Props = React.HTMLAttributes<HTMLElement>;

export const TextAlignCenter = ({ className }: Readonly<Props>) => {
  const editor = useEditorContext();
  const isActive = useIsActive(editor, 'textAlign', { textAlign: 'center' });

  if (!editor) return null;

  const alignCenter = () => editor.chain().setTextAlign('center').run();

  return (
    <div className={cn('', className)}>
      <IconButtonWrapper
        onClick={alignCenter}
        data-state={isActive ? 'on' : 'off'}
        className={cn(isActive && 'bg-blue-100')}
      >
        <IconButton data-state={isActive ? 'on' : 'off'} className={cn(isActive && 'text-blue-600')}>
          <AlignCenter />
        </IconButton>
      </IconButtonWrapper>
    </div>
  );
};
