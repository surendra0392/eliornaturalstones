import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface EditorialGridProps extends HTMLAttributes<HTMLDivElement> {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    cols?: 1 | 2 | 3 | 4 | 12;
    gap?: 'compact' | 'default' | 'spacious';
    align?: 'start' | 'center' | 'end' | 'stretch';
}

export function EditorialGrid({
    as: Component = 'div',
    children,
    className,
    cols = 12,
    gap = 'default',
    align = 'stretch',
    ...props
}: EditorialGridProps) {
    const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12',
    }[cols];

    const gapClasses = {
        compact: 'gap-4 md:gap-6',
        default: 'gap-6 md:gap-8 lg:gap-12',
        spacious: 'gap-8 md:gap-12 lg:gap-16',
    }[gap];

    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
    }[align];

    return (
        <Component
            className={cn(
                'grid',
                colClasses,
                gapClasses,
                alignClasses,
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
