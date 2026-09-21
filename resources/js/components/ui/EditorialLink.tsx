import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '../../lib/utils';

export interface EditorialLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    external?: boolean;
    arrow?: boolean;
    underline?: boolean;
    className?: string;
}

export function EditorialLink({
    href,
    children,
    external = false,
    arrow = true,
    underline = true,
    className,
    ...props
}: EditorialLinkProps) {
    const isExternal = external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

    const linkClasses = cn(
        'group relative inline-flex items-center text-xs font-medium tracking-[0.2em] uppercase text-graphite transition-colors duration-300 hover:text-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite',
        underline &&
            'pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-bronze after:transition-all after:duration-400 after:ease-out hover:after:w-full',
        className,
    );

    const content = (
        <>
            <span>{children}</span>
            {arrow && (
                <span
                    className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                    aria-hidden="true"
                >
                    →
                </span>
            )}
        </>
    );

    if (isExternal) {
        return (
            <a
                href={href}
                target={props.target || (isExternal && !href.startsWith('mailto:') && !href.startsWith('tel:') ? '_blank' : undefined)}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={linkClasses}
                {...props}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={linkClasses}>
            {content}
        </Link>
    );
}
