import { useEditorContext } from '../context/editor-context';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { BoldIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsActive } from '../plugin/use-active';

type Props = React.HTMLAttributes<HTMLElement>;

export const Bold = ({ className }: Readonly<Props>) => {
  const editor = useEditorContext();
  const isActive = useIsActive(editor, 'bold'); // ✅ 여기서 감지
  const toggleBold = () => {
    editor.chain().toggleBold().run();
  };

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
