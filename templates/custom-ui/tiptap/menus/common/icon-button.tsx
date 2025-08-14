import { cn } from '@/lib/utils';
import React from 'react';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const IconButton = ({ children, className, ...props }: Readonly<IconButtonProps>) => {
  return (
    <span
      className={cn(
        'text-gray-500 size-4 flex items-center hover:text-gray-900 transition-colors',
        '[&[data-state=on]]:text-blue-600',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
