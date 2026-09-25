import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { SOURCE_TO_SPACE_IMAGES } from '../../../data/sourceToSpaceImages';
import { SOURCE_TO_SPACE_CONTENT } from '../../../data/sourceToSpaceContent';
import {
    verticalTextReveal,
    imageClipReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ArchitectureSectionProps {
    content?: {
        stageIndex?: string;
        heading?: string;
        subtitle?: string;
        paragraph1?: string;
        paragraph2?: string;
        cta?: string;
        ctaHref?: string;
        image?: string;
    };
}

export function ArchitectureSection({ content }: ArchitectureSectionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        if (textRef.current) {
            verticalTextReveal(textRef.current, {
                duration: 1.0,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                },
            });
        }

        if (imgRef.current) {
            imageClipReveal(imgRef.current, {
                duration: 1.2,
                scrollTrigger: {
                    trigger: imgRef.current,
                    start: 'top 85%',
                },
            });
        }
    }, []);

    const architecture = {
        stageIndex:
            content?.stageIndex ||
            SOURCE_TO_SPACE_CONTENT.architecture.stageIndex,
        heading:
            content?.heading || SOURCE_TO_SPACE_CONTENT.architecture.heading,
        subtitle:
            content?.subtitle || SOURCE_TO_SPACE_CONTENT.architecture.subtitle,
        paragraph1:
            content?.paragraph1 ||
            SOURCE_TO_SPACE_CONTENT.architecture.paragraph1,
        paragraph2:
            content?.paragraph2 ||
            SOURCE_TO_SPACE_CONTENT.architecture.paragraph2,
        cta: content?.cta || SOURCE_TO_SPACE_CONTENT.architecture.cta,
        ctaHref:
            content?.ctaHref || SOURCE_TO_SPACE_CONTENT.architecture.ctaHref,
    };

    return (
        <section
            aria-label="Where Material Becomes Architecture"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Narrative (Order 2 on mobile, Order 1 on Desktop) */}
                    <div
                        ref={textRef}
                        className="order-2 lg:order-1 lg:col-span-6"
                    >
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            {architecture.subtitle}
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {architecture.heading}
                        </h2>

                        <div className="text-graphite/85 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p className="text-graphite font-serif text-xl leading-relaxed italic sm:text-2xl">
                                &ldquo;{architecture.paragraph1}&rdquo;
                            </p>
                            <p>{architecture.paragraph2}</p>
                        </div>

                        <div className="border-border-stone mt-10 grid grid-cols-3 gap-4 border-t pt-6">
                            <div>
                                <span className="text-graphite font-serif text-base">
                                    Proportion
                                </span>
                                <p className="text-graphite/60 font-sans text-xs">
                                    Monolithic Scale
                                </p>
                            </div>
                            <div>
                                <span className="text-graphite font-serif text-base">
                                    Atmosphere
                                </span>
                                <p className="text-graphite/60 font-sans text-xs">
                                    Light & Acoustic Depth
                                </p>
                            </div>
                            <div>
                                <span className="text-graphite font-serif text-base">
                                    Permanence
                                </span>
                                <p className="text-graphite/60 font-sans text-xs">
                                    Generational Life
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button
                                href={architecture.ctaHref}
                                variant="secondary"
                                className="border-graphite/30 text-graphite hover:border-graphite hover:bg-graphite/5"
                            >
                                {architecture.cta}
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Architectural Photography (Order 1 on mobile, Order 2 on Desktop) */}
                    <div
                        ref={imgRef}
                        className="order-1 lg:order-2 lg:col-span-6"
                    >
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        SOURCE_TO_SPACE_IMAGES.features
                                            .architecture.src
                                    }
                                    alt={
                                        SOURCE_TO_SPACE_IMAGES.features
                                            .architecture.alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-right">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    SPATIAL FULFILLMENT & MONOLITHIC REALIZATION
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
