import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface SplitLayoutProps extends HTMLAttributes<HTMLDivElement> {
    left: ReactNode;
    right: ReactNode;
    ratio?: '50-50' | '60-40' | '40-60' | '70-30';
    reverse?: boolean;
    gap?: 'compact' | 'default' | 'spacious';
    align?: 'start' | 'center' | 'end' | 'stretch';
    className?: string;
}

export function SplitLayout({
    left,
    right,
    ratio = '50-50',
    reverse = false,
    gap = 'default',
    align = 'center',
    className,
    ...props
}: SplitLayoutProps) {
    const gapClasses = {
        compact: 'gap-8 lg:gap-12',
        default: 'gap-10 lg:gap-16 xl:gap-20',
        spacious: 'gap-12 lg:gap-24',
    }[gap];

    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
    }[align];

    const leftSpan = {
        '50-50': 'lg:col-span-6',
        '60-40': 'lg:col-span-7',
        '40-60': 'lg:col-span-5',
        '70-30': 'lg:col-span-8',
    }[ratio];

    const rightSpan = {
        '50-50': 'lg:col-span-6',
        '60-40': 'lg:col-span-5',
        '40-60': 'lg:col-span-7',
        '70-30': 'lg:col-span-4',
    }[ratio];

    return (
        <div
            className={cn(
                'grid grid-cols-1 lg:grid-cols-12',
                gapClasses,
                alignClasses,
                className,
            )}
            {...props}
        >
            <div
                className={cn(
                    'w-full',
                    leftSpan,
                    reverse ? 'lg:order-2' : 'lg:order-1',
                )}
            >
                {left}
            </div>
            <div
                className={cn(
                    'w-full',
                    rightSpan,
                    reverse ? 'lg:order-1' : 'lg:order-2',
                )}
            >
                {right}
            </div>
        </div>
    );
}
