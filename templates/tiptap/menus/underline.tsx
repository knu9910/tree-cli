import { useEditorContext } from '../context/editor-context';
import { cn } from '@/lib/utils';
import { Underline } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { useIsActive } from '../plugin/use-active';

type Props = React.HTMLAttributes<HTMLElement>;

export const UnderLine = ({ className }: Readonly<Props>) => {
  const editor = useEditorContext();
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
