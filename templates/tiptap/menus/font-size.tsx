import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';
import { Pxs } from '../plugin/tiptap-font-config/constants';
import { cn } from '@/lib/utils';
import { TextCursorInput } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const TipTapFontSize = ({ className, editor }: Readonly<Props>) => {
  const changeFontSize = (size: Pxs) => {
    editor.chain().setFontSize(size).run();
  };

  const toggleSize = () => {
    // Implementation of toggleSize function
  };

  return (
    <div className={cn('', className)}>
      {/* 폰트 크기 설정 메뉴 */}
      <Select onValueChange={changeFontSize}>
        <SelectTrigger
          className={cn(
            'group w-fit border-none shadow-none mr-2 focus:outline-none focus:ring-0 px-2 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-100 transition-colors cursor-pointer',
            className
          )}
        >
          <IconButtonWrapper>
            <IconButton>
              <TextCursorInput className="" />
            </IconButton>
          </IconButtonWrapper>
          <SelectValue placeholder={'12px'} className="text-sm text-gray-700" />
        </SelectTrigger>
        <SelectContent className="rounded-md shadow-lg bg-white border border-gray-300 mt-1 h-72 w-32 overflow-y-auto">
          {Object.values(Pxs).map((px) => (
            <SelectItem
              key={px}
              value={px}
              className="cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100 focus:bg-gray-100 rounded transition-colors"
            >
              {px}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
