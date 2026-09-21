import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'text';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    loading?: boolean;
    arrow?: boolean;
    className?: string;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    loading = false,
    arrow = false,
    disabled = false,
    className,
    ...props
}: ButtonProps) {
    const baseClasses =
        'relative inline-flex items-center justify-center font-sans uppercase transition-all duration-300 select-none cursor-pointer active:scale-[0.98] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-graphite disabled:pointer-events-none disabled:opacity-40';

    const sizeClasses = {
        sm: 'px-4 py-2 text-[11px] font-medium tracking-[0.2em]',
        md: 'px-7 py-3.5 text-xs font-medium tracking-[0.22em]',
        lg: 'px-9 py-4 text-xs font-medium tracking-[0.24em]',
    }[size];

    const variantClasses = {
        primary:
            'bg-graphite text-ivory border border-graphite hover:bg-bronze hover:border-bronze hover:text-white shadow-xs hover:shadow-sm',
        secondary:
            'bg-transparent text-graphite border border-graphite/50 hover:border-bronze hover:text-bronze hover:bg-bronze/[0.04]',
        text: 'bg-transparent text-graphite hover:text-bronze px-0 py-1 tracking-[0.22em] text-xs border-none',
    }[variant];

    const content = (
        <>
            {loading && (
                <span
                    className="mr-2.5 inline-block h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent"
                    aria-hidden="true"
                />
            )}
            <span>{children}</span>
            {arrow && (
                <span
                    className="ml-2.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                >
                    →
                </span>
            )}
        </>
    );

    if (href && !disabled) {
        return (
            <Link
                href={href}
                className={cn(
                    baseClasses,
                    variant !== 'text' && sizeClasses,
                    variantClasses,
                    'group',
                    className,
                )}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={props.type || 'button'}
            disabled={disabled || loading}
            aria-busy={loading}
            className={cn(
                baseClasses,
                variant !== 'text' && sizeClasses,
                variantClasses,
                'group',
                className,
            )}
            {...props}
        >
            {content}
        </button>
    );
}
