import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/custom-ui/popover/popover';
import {useFontConfigStore} from '../plugin';
import {Colors} from '../plugin/tiptap-font-config/constants';
import {cn} from '@/lib/utils';
import {Pipette} from 'lucide-react';
import {IconButtonWrapper} from './common/icon-button-wrapper';
import {IconButton} from './common/icon-button';
import {Editor} from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
	editor: Editor;
};

export const TipTapFontColor = ({className, editor}: Readonly<Props>) => {
	const {setSelectedColor, selectedColor} = useFontConfigStore();

	if (!editor) return null;

	// 색상 변경 함수
	const changeTextColor = (color: Colors) => {
		if (color === '#FFFFFF') {
			setSelectedColor(Colors.Black);
		} else {
			setSelectedColor(color);
		}

		editor.chain().focus().setColor(color).run();
	};

	return (
		<div className={cn('', className)}>
			{/* 색상 선택 */}
			<Popover>
				<PopoverTrigger asChild>
					<IconButtonWrapper className={className}>
						<IconButton>
							<Pipette style={{color: selectedColor}} className="" />
						</IconButton>
					</IconButtonWrapper>
				</PopoverTrigger>
				<PopoverContent className="flex flex-wrap justify-around flex-col h-[160px] w-[200px] bg-slate-100 rounded-md">
					{Object.values(Colors).map((color, idx) => (
						<div
							key={color + idx}
							onClick={() => changeTextColor(color)}
							style={{backgroundColor: color}}
							className="w-[16px] h-[16px] rounded-sm cursor-pointer"
						></div>
					))}
				</PopoverContent>
			</Popover>
		</div>
	);
};
