import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { ARCHITECT_SERVICES_IMAGES } from '../../../data/architectServicesImages';
import { ARCHITECT_SERVICES_CONTENT } from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    imageClipReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface DesignSupportSectionProps {
    content?: {
        heading?: string;
        subtitle?: string;
        paragraph?: string;
        supportingStatement?: string;
        image?: string;
    };
}

export function DesignSupportSection({ content }: DesignSupportSectionProps = {}) {
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

    const designSupport = {
        heading:
            content?.heading || ARCHITECT_SERVICES_CONTENT.designSupport.heading,
        subtitle:
            content?.subtitle ||
            ARCHITECT_SERVICES_CONTENT.designSupport.subtitle,
        paragraph:
            content?.paragraph ||
            ARCHITECT_SERVICES_CONTENT.designSupport.paragraph,
        supportingStatement:
            content?.supportingStatement ||
            ARCHITECT_SERVICES_CONTENT.designSupport.supportingStatement,
    };

    return (
        <section
            aria-label="Design Support in Context"
            className="bg-ivory-warm border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Narrative (Order 2 on mobile, Order 1 on Desktop) */}
                    <div
                        ref={textRef}
                        className="order-2 lg:order-1 lg:col-span-6"
                    >
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            {designSupport.subtitle}
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {designSupport.heading}
                        </h2>

                        <p className="text-graphite/85 mt-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            {designSupport.paragraph}
                        </p>

                        <blockquote className="border-bronze mt-8 border-l-2 pl-6">
                            <p className="text-graphite font-serif text-xl leading-relaxed font-light italic sm:text-2xl">
                                &ldquo;{designSupport.supportingStatement}
                                &rdquo;
                            </p>
                        </blockquote>

                        <div className="border-border-stone mt-10 border-t pt-6">
                            <span className="text-bronze font-mono text-xs uppercase">
                                PROPORTION, HARMONY & AMBIENT ILLUMINATION
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Architectural Photography (Order 1 on mobile, Order 2 on Desktop) */}
                    <div
                        ref={imgRef}
                        className="order-1 lg:order-2 lg:col-span-6"
                    >
                        <div className="bg-ivory/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        ARCHITECT_SERVICES_IMAGES.designSupport
                                            .src
                                    }
                                    alt={
                                        ARCHITECT_SERVICES_IMAGES.designSupport
                                            .alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-right">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    MONUMENTAL INTERIOR STONE WALLS & GEOMETRY
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
