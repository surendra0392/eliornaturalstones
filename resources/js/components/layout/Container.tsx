import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    size?: 'default' | 'narrow' | 'reading' | 'wide' | 'full';
    noGutters?: boolean;
}

export function Container({
    as: Component = 'div',
    children,
    className,
    size = 'default',
    noGutters = false,
    ...props
}: ContainerProps) {
    const sizeClasses = {
        reading: 'max-w-[760px]',
        narrow: 'max-w-[960px]',
        default: 'max-w-[1440px]',
        wide: 'max-w-[1600px]',
        full: 'max-w-full',
    }[size];

    return (
        <Component
            className={cn(
                'mx-auto w-full',
                !noGutters && 'px-5 sm:px-6 md:px-12 lg:px-16',
                sizeClasses,
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
