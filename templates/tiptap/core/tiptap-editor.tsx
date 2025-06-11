'use client';
import styles from './tiptap-editor.module.css';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import FontSize from 'tiptap-extension-font-size';
import {CustomImage, YouTubeVideo} from '../extended';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import {useEffect, useRef} from 'react';
import {useContentStore} from '@/components/custom-ui/tiptap/plugin';
import {cn} from '@/lib/utils';
import {Toolbar} from './toolbar';
import {ScrollArea} from '../../scroll-area/scroll-area';
import {TableContextMenu} from '../menus/table-context-menu';
import {FontOptions} from '../plugin/tiptap-font-config/constants';

type Props = React.HTMLAttributes<HTMLElement> & {
	keyId: string;
	height?: number;
	onImageUpload?: (file: File) => Promise<string>;
	content?: string;
};

export const TiptapEditor = ({
	className,
	keyId,
	height = 400,
	content: initialContentProp,
	onImageUpload,
}: Props) => {
	const {getContent, setContent} = useContentStore();
	const initialContent = initialContentProp ?? getContent(keyId);

	const editor = useEditor({
		extensions: [
			Color,
			Highlight.configure({multicolor: true}),
			StarterKit,
			Underline,
			FontFamily,
			TextStyle,
			FontSize,
			CustomImage,
			YouTubeVideo,
			TextAlign.configure({
				types: ['paragraph', 'heading'],
				alignments: ['left', 'right', 'center'],
			}),
			Link.configure({
				openOnClick: true,
				autolink: true,
				HTMLAttributes: {
					class: 'font-bold hover:text-orange-600 hover:underline',
				},
			}),
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
		],
		content: initialContent,
		editorProps: {
			attributes: {
				class: 'h-full',
			},
		},
		immediatelyRender: false,
		onCreate: ({editor}) => {
			// 에디터 생성 시 기본 폰트 크기와 폰트 설정
			editor
				.chain()
				.selectAll()
				.setFontSize('18px')
				.setFontFamily(FontOptions['맑은 고딕'])
				.run();
			editor.commands.blur();
		},
	});

	const didSetInitialContent = useRef(false);
	useEffect(() => {
		if (!editor) return;

		// 초기값 설정 (최초 1회)
		if (initialContentProp !== undefined && !didSetInitialContent.current) {
			editor.commands.setContent(initialContentProp);
			setContent(keyId, initialContentProp);
			didSetInitialContent.current = true;
		}

		// 스토어에서 복구
		const saved = getContent(keyId);
		if (saved && editor.getHTML() !== saved) {
			editor.commands.setContent(saved);
		}

		// 실시간 저장 핸들러
		const handler = () => {
			setContent(keyId, editor.getHTML());
		};
		editor.on('update', handler);

		return () => {
			editor.off('update', handler);
		};
	}, [editor, initialContentProp, keyId, setContent, getContent]);

	if (!editor) return null;

	return (
		<div className={`${cn('border rounded-xl relative', className)}`}>
			<Toolbar editor={editor} onImageUpload={onImageUpload} />
			<ScrollArea style={{height: `${height}px`}}>
				<EditorContent
					editor={editor}
					className={cn(
						'p-6 border-none [&>.tiptap]:!outline-none',
						'[&_.resize-cursor]:cursor-col-resize',
						styles.tiptapGlobalStyles,
						className,
					)}
					style={{height: `${height}px`}}
				/>
				<TableContextMenu editor={editor} />
			</ScrollArea>
		</div>
	);
};
