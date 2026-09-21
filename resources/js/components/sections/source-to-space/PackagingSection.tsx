import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { SOURCE_TO_SPACE_IMAGES } from '../../../data/sourceToSpaceImages';
import { SOURCE_TO_SPACE_CONTENT } from '../../../data/sourceToSpaceContent';
import {
    verticalTextReveal,
    imageClipReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface PackagingSectionProps {
    content?: {
        stageIndex?: string;
        heading?: string;
        subtitle?: string;
        paragraph1?: string;
        paragraph2?: string;
        image?: string;
    };
}

export function PackagingSection({ content }: PackagingSectionProps = {}) {
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

    const packaging = {
        stageIndex:
            content?.stageIndex ||
            SOURCE_TO_SPACE_CONTENT.packaging.stageIndex,
        heading:
            content?.heading || SOURCE_TO_SPACE_CONTENT.packaging.heading,
        subtitle:
            content?.subtitle || SOURCE_TO_SPACE_CONTENT.packaging.subtitle,
        paragraph1:
            content?.paragraph1 ||
            SOURCE_TO_SPACE_CONTENT.packaging.paragraph1,
        paragraph2:
            content?.paragraph2 ||
            SOURCE_TO_SPACE_CONTENT.packaging.paragraph2,
    };

    return (
        <section
            aria-label="Packaging and Protection Stage"
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
                            {packaging.subtitle}
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {packaging.heading}
                        </h2>

                        <div className="text-graphite/85 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p>{packaging.paragraph1}</p>
                            <p className="text-graphite font-serif text-xl leading-relaxed italic">
                                {packaging.paragraph2}
                            </p>
                        </div>

                        <div className="border-border-stone mt-10 border-t pt-6">
                            <span className="text-bronze font-mono text-xs uppercase">
                                CAREFUL CRATING & SURFACE ISOLATION
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Protected Material Photography (Order 1 on mobile, Order 2 on Desktop) */}
                    <div
                        ref={imgRef}
                        className="order-1 lg:order-2 lg:col-span-6"
                    >
                        <div className="bg-ivory/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        SOURCE_TO_SPACE_IMAGES.features
                                            .packaging.src
                                    }
                                    alt={
                                        SOURCE_TO_SPACE_IMAGES.features
                                            .packaging.alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-right">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    PROTECTIVE PREPARATION & HANDLING PROTOCOL
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
