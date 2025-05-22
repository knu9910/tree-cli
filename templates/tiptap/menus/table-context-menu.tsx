import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useEditorContext } from '../context/editor-context';
import { CellSelection } from '@tiptap/pm/tables';

type Props = React.HTMLAttributes<HTMLElement>;

export const TableContextMenu = ({ className }: Readonly<Props>) => {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [lastCellSelection, setLastCellSelection] = useState<any>(null);
  const editor = useEditorContext();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('td, th')) {
        event.preventDefault();
        // 현재 selection이 CellSelection이면 저장
        const sel = editor?.state?.selection;
        if (sel && sel instanceof CellSelection) {
          // instanceof CellSelection를 빼면 열을 병합할때 문제가 생김
          setLastCellSelection(sel);
        }
        setMenu({ x: event.clientX, y: event.clientY });
      } else {
        setMenu(null);
      }
    };
    const handleClick = () => {
      if (menu) setMenu(null);
    };
    const preventWheel = (e: WheelEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [menu, editor]);

  useEffect(() => {
    if (!menu) return;
    const preventWheel = (e: WheelEvent) => e.preventDefault();
    document.addEventListener('wheel', preventWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', preventWheel);
    };
  }, [menu]);

  const restoreSelection = () => {
    if (lastCellSelection && editor) {
      editor.view.dispatch(editor.state.tr.setSelection(lastCellSelection));
    }
  };

  // 공통 핸들러 함수
  const handleMenuAction = (command: () => void) => {
    restoreSelection();
    command();
    setMenu(null);
  };

  const buttonGroups = [
    [
      { label: '행 위에 추가', action: () => handleMenuAction(() => editor.chain().focus().addRowBefore().run()) },
      { label: '행 아래에 추가', action: () => handleMenuAction(() => editor.chain().focus().addRowAfter().run()) },
      { label: '행 삭제', action: () => handleMenuAction(() => editor.chain().focus().deleteRow().run()) },
    ],
    [
      { label: '열 왼쪽에 추가', action: () => handleMenuAction(() => editor.chain().focus().addColumnBefore().run()) },
      {
        label: '열 오른쪽에 추가',
        action: () => handleMenuAction(() => editor.chain().focus().addColumnAfter().run()),
      },
      { label: '열 삭제', action: () => handleMenuAction(() => editor.chain().focus().deleteColumn().run()) },
    ],
    [
      { label: '셀 병합', action: () => handleMenuAction(() => editor.chain().focus().mergeCells().run()) },
      { label: '셀 분할', action: () => handleMenuAction(() => editor.chain().focus().splitCell().run()) },
    ],
    [
      {
        label: '셀 헤더/일반 변경',
        action: () => handleMenuAction(() => editor.chain().focus().toggleHeaderCell().run()),
      },
      {
        label: '행 헤더/일반 변경',
        action: () => handleMenuAction(() => editor.chain().focus().toggleHeaderRow().run()),
      },
      {
        label: '열 헤더/일반 변경',
        action: () => handleMenuAction(() => editor.chain().focus().toggleHeaderColumn().run()),
      },
    ],
    [
      {
        label: '테이블 삭제',
        action: () => handleMenuAction(() => editor.chain().focus().deleteTable().run()),
        danger: true,
      },
    ],
  ];

  if (!menu) return null;

  return (
    <div
      ref={menuRef}
      style={{ position: 'fixed', top: menu.y, left: menu.x, zIndex: 9999 }}
      className={cn('bg-white border rounded shadow-lg p-2 flex flex-col gap-1 min-w-[160px]', className)}
    >
      {buttonGroups.map((group, groupIdx) => (
        <div key={groupIdx}>
          {group.map(({ label, action, danger }: any) => (
            <button
              key={label}
              onClick={action}
              className={cn('hover:bg-gray-100 px-2 py-1 text-left w-full', danger && 'hover:bg-red-100 text-red-600')}
            >
              {label}
            </button>
          ))}
          {groupIdx < buttonGroups.length - 1 && <hr className="my-1" />}
        </div>
      ))}
    </div>
  );
};
