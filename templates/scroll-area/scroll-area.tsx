'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    variant?: 'default' | 'primary' | 'secondary' | 'green' | 'destructive'; // variant prop 추가
  }
>(({ className, children, variant = 'default', ...props }, ref) => (
  <ScrollAreaPrimitive.Root type="auto" className={cn('relative', className)} {...props}>
    <ScrollAreaPrimitive.Viewport ref={ref} className="h-full w-full rounded-[inherit] overflow-auto">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar variant={variant} /> {/* variant 전달 */}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const scrollBarVariants = cva('flex touch-none select-none transition-colors', {
  variants: {
    variant: {
      default: 'bg-gray-100', // 깔끔한 연회색 트랙
      primary: 'bg-[#dbeafe] hover:bg-primary-foreground/80',
      secondary: 'bg-secondary-foreground hover:bg-secondary-foreground/80',
      green: 'bg-green-foreground hover:bg-green-foreground/80',
      destructive: 'bg-destructive-foreground hover:bg-destructive-foreground/80',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const thumbVariants = cva('relative flex-1 rounded-full transition-colors', {
  variants: {
    variant: {
      default: 'bg-gray-300 hover:bg-gray-400', // thumb도 무난한 회색 계열
      primary: 'bg-[#93c5fd] hover:bg-primary/80',
      secondary: 'bg-secondary/50 hover:bg-secondary/80',
      green: 'bg-green/50 hover:bg-green/80',
      destructive: 'bg-destructive/50 hover:bg-destructive/80',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    variant?: 'default' | 'primary' | 'secondary' | 'green' | 'destructive';
  }
>(({ className, orientation = 'vertical', variant = 'default', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      scrollBarVariants({ variant }),
      orientation === 'vertical' && 'h-full w-3 border-l border-l-transparent p-[2px] pr-[2px]', // bar 두께 살짝 더 키움
      orientation === 'horizontal' && 'h-3 flex-col border-t border-t-transparent', // bar 두께 살짝 더 키움
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className={cn(thumbVariants({ variant }))} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
