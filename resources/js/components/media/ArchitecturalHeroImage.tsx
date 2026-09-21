import type { ReactNode } from 'react';
import { EliorImage, type EliorImageProps } from './EliorImage';
import { cn } from '../../lib/utils';

export interface ArchitecturalHeroImageProps extends Omit<
    EliorImageProps,
    'height'
> {
    children?: ReactNode;
    overlay?: 'none' | 'subtle' | 'medium' | 'gradient';
    height?: 'screen' | 'tall' | 'standard' | 'compact';
}

export function ArchitecturalHeroImage({
    children,
    overlay = 'subtle',
    height = 'tall',
    className,
    containerClassName,
    ...props
}: ArchitecturalHeroImageProps) {
    const heightClasses = {
        screen: 'min-h-screen',
        tall: 'min-h-[70vh] lg:min-h-[85vh]',
        standard: 'min-h-[46vh] lg:min-h-[54vh]',
        compact: 'min-h-[38vh] lg:min-h-[46vh]',
    }[height];

    const overlayClasses = {
        none: '',
        subtle: 'bg-graphite/20',
        medium: 'bg-graphite/40',
        gradient:
            'bg-gradient-to-t from-graphite/70 via-graphite/20 to-transparent',
    }[overlay];

    return (
        <div
            className={cn(
                'bg-ivory-warm relative w-full overflow-hidden',
                heightClasses,
                containerClassName,
            )}
        >
            <EliorImage
                priority
                aspectRatio="auto"
                containerClassName="absolute inset-0 h-full w-full"
                className={cn('h-full w-full object-cover', className)}
                {...props}
            />

            {overlay !== 'none' && (
                <div
                    className={cn('absolute inset-0', overlayClasses)}
                    aria-hidden="true"
                />
            )}

            {children && (
                <div className="relative z-10 flex h-full min-h-[inherit] w-full items-center">
                    {children}
                </div>
            )}
        </div>
    );
}
