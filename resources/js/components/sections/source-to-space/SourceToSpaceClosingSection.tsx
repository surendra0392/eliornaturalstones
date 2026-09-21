import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { SOURCE_TO_SPACE_IMAGES } from '../../../data/sourceToSpaceImages';
import { SOURCE_TO_SPACE_CONTENT } from '../../../data/sourceToSpaceContent';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

export interface SourceToSpaceClosingProps {
    content?: Partial<typeof SOURCE_TO_SPACE_CONTENT.closing>;
}

export function SourceToSpaceClosingSection({
    content,
}: SourceToSpaceClosingProps = {}) {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!contentRef.current || prefersReducedMotion()) return;
        verticalTextReveal(contentRef.current, {
            duration: 1.1,
            scrollTrigger: {
                trigger: contentRef.current,
                start: 'top 85%',
            },
        });
    }, []);

    const closing = {
        ...SOURCE_TO_SPACE_CONTENT.closing,
        ...content,
    };

    return (
        <section
            aria-label="Source to Space Closing Statement"
            className="bg-graphite relative w-full overflow-hidden py-20 text-white sm:py-24 lg:py-32"
        >
            {/* Full-width architectural backdrop */}
            <div className="absolute inset-0">
                <img
                    src={SOURCE_TO_SPACE_IMAGES.closing.src}
                    alt={SOURCE_TO_SPACE_IMAGES.closing.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-30"
                />
                <div
                    className="from-graphite via-graphite/70 to-graphite/50 absolute inset-0 bg-gradient-to-t"
                    aria-hidden="true"
                />
            </div>

            <Container className="relative z-10">
                <div ref={contentRef} className="mx-auto max-w-3xl text-center">
                    <span className="text-champagne/90 font-sans text-xs tracking-[0.3em] uppercase">
                        {closing.signature}
                    </span>

                    <h2 className="mt-6 font-serif text-4xl leading-[1.1] font-light whitespace-pre-line text-white sm:text-5xl md:text-6xl">
                        {closing.headline}
                    </h2>

                    <div className="mt-10 flex justify-center">
                        <Button
                            href={closing.ctaHref}
                            variant="primary"
                            className="text-graphite hover:bg-ivory-warm bg-ivory shadow-md"
                        >
                            {closing.cta}
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
