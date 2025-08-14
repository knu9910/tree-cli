import {useState} from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/custom-ui/popover/popover';
import {Input} from '@/components/custom-ui/input/input';
import {Button} from '@/components/custom-ui/button/button';
import {cn} from '@/lib/utils';
import {Link} from 'lucide-react';
import {IconButton} from './common/icon-button';
import {IconButtonWrapper} from './common/icon-button-wrapper';
import {Editor} from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
	editor: Editor;
};

export const UrlLink = ({className, editor}: Readonly<Props>) => {
	const [link, setLink] = useState<string>('');
	const [open, setOpen] = useState(false);

	if (!editor) return null;

	const handleLinkClick = () => {
		if (link) {
			editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({href: link})
				.run();
			setLink('');
			setOpen(false);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className={cn('', className)}>
				<IconButtonWrapper data-state={open ? 'on' : 'off'}>
					<IconButton data-state={open ? 'on' : 'off'}>
						<Link />
					</IconButton>
				</IconButtonWrapper>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-7 space-y-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
				<div className="space-y-2">
					<h3 className="text-lg font-bold text-gray-900">링크 추가</h3>
					<p className="text-xs text-gray-500">
						연결할 웹사이트 주소를 입력하세요.
					</p>
				</div>
				<Input
					type="text"
					placeholder="https://example.com"
					value={link}
					onChange={e => setLink(e.target.value)}
					className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm placeholder:text-gray-400"
				/>
				<Button
					onClick={handleLinkClick}
					disabled={!link}
					className={cn(
						'w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 transition-all py-2.5 rounded-lg font-semibold shadow-sm mt-2 group hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
					)}
				>
					<Link className="size-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
					<span>링크 추가</span>
				</Button>
			</PopoverContent>
		</Popover>
	);
};
