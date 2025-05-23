import React from 'react';
import { cn } from '@/lib/utils';
import { TipTapFontStyle } from '../menus/font-style';
import { Separator } from '../menus/common/separator';
import { TipTapFontSize } from '../menus/font-size';
import { TipTapFontColor } from '../menus/font-color';
import { Highlight } from '../menus/highlight';
import { Bold } from '../menus/bold';
import { Italic } from '../menus/italic';
import { UnderLine } from '../menus/underline';
import { Strike } from '../menus/strike';
import { UrlLink } from '../menus/url-link';
import { TextAlignLeft } from '../menus/text-align-left';
import { TextAlignCenter } from '../menus/text-align-center';
import { TextAlignRight } from '../menus/text-align-right';
import { Img } from '../menus/img';
import { Table } from '../menus/table';
import { Editor } from '@tiptap/core';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const Toolbar = ({ className, editor }: Readonly<Props>) => (
  <div className={cn('flex items-center py-1 px-4 border-b', className)}>
    <TipTapFontStyle editor={editor} />
    <Separator />
    <TipTapFontSize editor={editor} />
    <Separator />
    <TipTapFontColor editor={editor} />
    <Highlight editor={editor} />
    <Separator />
    <Bold editor={editor} />
    <Italic editor={editor} />
    <UnderLine editor={editor} />
    <Strike editor={editor} />
    <UrlLink editor={editor} />
    <Separator />
    <Table editor={editor} />
    <Separator />
    <TextAlignLeft editor={editor} />
    <TextAlignCenter editor={editor} />
    <TextAlignRight editor={editor} />
    <Separator />
    <Img editor={editor} />
  </div>
);
