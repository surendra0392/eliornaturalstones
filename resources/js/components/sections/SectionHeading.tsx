import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    description?: string;
    align?: 'left' | 'center';
    className?: string;
    children?: ReactNode;
}

export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    description,
    align = 'left',
    className,
    children,
}: SectionHeadingProps) {
    const isCenter = align === 'center';

    return (
        <div
            className={cn(
                'mb-12 lg:mb-16',
                isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl',
                className,
            )}
        >
            {eyebrow && (
                <p className="text-bronze mb-3 text-[11px] font-medium tracking-[0.3em] uppercase">
                    {eyebrow}
                </p>
            )}

            <h2 className="text-graphite font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                {title}
            </h2>

            {subtitle && (
                <p className="text-taupe mt-2 font-serif text-lg font-light italic">
                    {subtitle}
                </p>
            )}

            {description && (
                <p className="text-graphite-muted mt-4 max-w-2xl text-sm leading-relaxed lg:text-base">
                    {description}
                </p>
            )}

            {children}
        </div>
    );
}
