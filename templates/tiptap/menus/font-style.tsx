import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';
import { FontOptions } from '../plugin/tiptap-font-config/constants';
import { cn } from '@/lib/utils';
import { Type } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const TipTapFontStyle = ({ className, editor }: Readonly<Props>) => {
  const changeFont = (font: string) => {
    // 폰트 변경 적용
    editor.chain().setFontFamily(FontOptions[font]).run();
  };

  return (
    <div className={cn('', className)}>
      {/* 폰트 설정 메뉴 */}
      <Select onValueChange={changeFont}>
        <SelectTrigger
          className={cn(
            'group w-fit mr-2 border-none shadow-none focus:outline-none focus:ring-0 px-2 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-100 transition-colors cursor-pointer',
            className
          )}
        >
          <IconButtonWrapper>
            <IconButton>
              <Type className="" />
            </IconButton>
          </IconButtonWrapper>
          <SelectValue placeholder="맑은고딕" className="text-sm text-gray-700 " />
        </SelectTrigger>
        <SelectContent className="rounded-md shadow-lg bg-white border border-gray-300 mt-1">
          {Object.keys(FontOptions).map((fontName) => (
            <SelectItem
              key={fontName}
              value={fontName}
              className="cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100 focus:bg-gray-100 rounded transition-colors"
            >
              {fontName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
