import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Table as TableIcon } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { Editor } from '@tiptap/react';

const MAX_ROWS = 8;
const MAX_COLS = 12;

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const Table = ({ className, editor }: Readonly<Props>) => {
  const [showGrid, setShowGrid] = useState(false);
  const [hovered, setHovered] = useState<[number, number]>([0, 0]);

  if (!editor) return null;

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowGrid(false);
  };

  return (
    <div className={cn('flex gap-1 items-center', className)}>
      <div className="relative">
        <IconButtonWrapper>
          <IconButton onClick={() => setShowGrid((v) => !v)}>
            <TableIcon className="w-4 h-4" />
          </IconButton>
        </IconButtonWrapper>
        {showGrid && (
          <div className="absolute z-10 mt-2 p-2 bg-white border rounded shadow-lg left-0">
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: MAX_ROWS }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-0.5">
                  {Array.from({ length: MAX_COLS }).map((_, colIdx) => {
                    const selected = rowIdx <= hovered[0] && colIdx <= hovered[1];
                    return (
                      <div
                        key={colIdx}
                        className={cn(
                          'w-5 h-5 border border-gray-300 cursor-pointer transition-colors',
                          selected ? 'bg-blue-500 border-blue-600' : 'bg-white hover:bg-blue-100'
                        )}
                        onMouseEnter={() => setHovered([rowIdx, colIdx])}
                        onClick={() => insertTable(rowIdx + 1, colIdx + 1)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="text-xs text-center mt-2 text-gray-700">
              {hovered[0] + 1}행 x {hovered[1] + 1}열
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
