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
export const Toolbar = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center py-1 px-4 border-b', className)}>
    <TipTapFontStyle />
    <Separator />
    <TipTapFontSize />
    <Separator />
    <TipTapFontColor />
    <Highlight />
    <Separator />
    <Bold />
    <Italic />
    <UnderLine />
    <Strike />
    <UrlLink />
    <Separator />
    <Table />
    <Separator />
    <TextAlignLeft />
    <TextAlignCenter />
    <TextAlignRight />
    <Separator />
    <Img />
  </div>
);
