import React from 'react';
import { cn } from '@/lib/utils';

// 세로 구분선 컴포넌트
// 기본: 높이 5, 너비 1, 연한 회색
// className으로 커스텀 가능
export const Separator = ({ className }: { className?: string }) => (
  <div className={cn('w-px h-7 bg-gray-200 mx-2', className)} aria-hidden="true" />
);
