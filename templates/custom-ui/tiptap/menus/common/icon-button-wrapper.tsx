import { cn } from '@/lib/utils';
import React from 'react';

type IconButtonWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const IconButtonWrapper = ({ children, className, ...props }: Readonly<IconButtonWrapperProps>) => {
  return (
    <div
      className={cn(
        'h-full flex cursor-pointer gap-2 items-center rounded-lg p-2 justify-center transition-all hover:bg-gray-100',
        '[&[data-state=on]]:bg-blue-50 [&[data-state=on]]:border-blue-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
