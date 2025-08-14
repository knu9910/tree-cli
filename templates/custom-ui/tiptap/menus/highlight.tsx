import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/custom-ui/popover/popover';
import {Colors} from '../plugin/tiptap-font-config/constants';
import {cn} from '@/lib/utils';
import {Highlighter} from 'lucide-react';
import {IconButtonWrapper} from './common/icon-button-wrapper';
import {IconButton} from './common/icon-button';
import {useState} from 'react';
import {Editor} from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
	editor: Editor;
};

export const Highlight = ({className, editor}: Readonly<Props>) => {
	const [selectedColor, setSelectedColor] = useState<string>('');

	if (!editor) return null;

	const setHighlight = (color: string) => {
		if (selectedColor === color) {
			editor.commands.unsetHighlight();
			setSelectedColor('');
		} else {
			editor.commands.setHighlight({color});
			setSelectedColor(color);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<IconButtonWrapper className={cn(className)}>
					<IconButton>
						<Highlighter
							style={{color: selectedColor || undefined}}
							className=""
						/>
					</IconButton>
				</IconButtonWrapper>
			</PopoverTrigger>
			<PopoverContent className="flex flex-wrap justify-around flex-col h-[160px] w-[200px] bg-slate-100 rounded-md">
				{Object.values(Colors).map(color => (
					<div
						key={color}
						onClick={() => setHighlight(color)}
						className={cn(
							'w-[16px] h-[16px] rounded-sm cursor-pointer',
							selectedColor === color && 'ring-2 ring-yellow-400',
						)}
						style={{backgroundColor: color}}
					></div>
				))}
			</PopoverContent>
		</Popover>
	);
};
