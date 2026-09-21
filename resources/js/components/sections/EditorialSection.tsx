import type { ReactNode } from 'react';
import { Container } from '../common/Container';
import { EliorImage } from '../media/EliorImage';
import type { MediaAsset } from '../../types/media';
import { cn } from '../../lib/utils';

interface EditorialSectionProps {
    eyebrow?: string;
    title: string;
    lead?: string;
    children: ReactNode;
    imageAsset?: MediaAsset;
    imageSrc?: string;
    imageAlt?: string;
    reverse?: boolean;
    className?: string;
}

export function EditorialSection({
    eyebrow,
    title,
    lead,
    children,
    imageAsset,
    imageSrc,
    imageAlt = 'Architectural material detail',
    reverse = false,
    className,
}: EditorialSectionProps) {
    return (
        <section className={cn('py-20 lg:py-28', className)}>
            <Container>
                <div
                    className={cn(
                        'grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20',
                        reverse &&
                            'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1',
                    )}
                >
                    <div className="lg:col-span-6">
                        {eyebrow && (
                            <span className="text-bronze mb-3 inline-block text-[10px] font-medium tracking-[0.3em] uppercase">
                                {eyebrow}
                            </span>
                        )}
                        <h2 className="text-graphite font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                            {title}
                        </h2>
                        {lead && (
                            <p className="text-taupe mt-4 font-serif text-lg font-light italic lg:text-xl">
                                {lead}
                            </p>
                        )}
                        <div className="text-graphite-muted mt-6 space-y-4 text-sm leading-relaxed lg:text-base">
                            {children}
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <EliorImage
                            asset={imageAsset}
                            src={imageSrc}
                            alt={imageAlt}
                            aspectRatio="4/5"
                            className="shadow-sm"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
