import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    spacing?: 'default' | 'compact' | 'spacious' | 'none';
    background?: 'transparent' | 'ivory' | 'warm' | 'light' | 'stone';
    border?: 'none' | 'top' | 'bottom' | 'both';
}

export function Section({
    as: Component = 'section',
    children,
    className,
    spacing = 'default',
    background = 'transparent',
    border = 'none',
    ...props
}: SectionProps) {
    const spacingClasses = {
        none: 'py-0',
        compact: 'py-8 md:py-12 lg:py-14',
        default: 'py-12 md:py-16 lg:py-20',
        spacious: 'py-16 md:py-22 lg:py-28',
    }[spacing];

    const bgClasses = {
        transparent: 'bg-transparent',
        ivory: 'bg-ivory',
        warm: 'bg-ivory-warm',
        light: 'bg-ivory-light',
        stone: 'bg-stone-light/50',
    }[background];

    const borderClasses = {
        none: '',
        top: 'border-t border-border-subtle',
        bottom: 'border-b border-border-subtle',
        both: 'border-y border-border-subtle',
    }[border];

    return (
        <Component
            className={cn(
                'relative w-full',
                spacingClasses,
                bgClasses,
                borderClasses,
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
