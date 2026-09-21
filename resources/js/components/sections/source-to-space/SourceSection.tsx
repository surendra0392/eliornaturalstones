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

interface SourceSectionProps {
    content?: {
        stageIndex?: string;
        heading?: string;
        subtitle?: string;
        paragraph1?: string;
        paragraph2?: string;
        image?: string;
    };
}

export function SourceSection({ content }: SourceSectionProps = {}) {
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

    const source = {
        stageIndex:
            content?.stageIndex || SOURCE_TO_SPACE_CONTENT.source.stageIndex,
        heading: content?.heading || SOURCE_TO_SPACE_CONTENT.source.heading,
        subtitle: content?.subtitle || SOURCE_TO_SPACE_CONTENT.source.subtitle,
        paragraph1:
            content?.paragraph1 || SOURCE_TO_SPACE_CONTENT.source.paragraph1,
        paragraph2:
            content?.paragraph2 || SOURCE_TO_SPACE_CONTENT.source.paragraph2,
    };

    return (
        <section
            aria-label="Source and Quarry Stage"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Quarry Photography */}
                    <div ref={imgRef} className="lg:col-span-6">
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        SOURCE_TO_SPACE_IMAGES.features.source
                                            .src
                                    }
                                    alt={
                                        SOURCE_TO_SPACE_IMAGES.features.source
                                            .alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-left">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    GEOLOGICAL BEDROCK & NATURAL STRATIFICATION
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Editorial Narrative */}
                    <div ref={textRef} className="lg:col-span-6">
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            {source.subtitle}
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {source.heading}
                        </h2>

                        <div className="text-graphite/85 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p className="text-graphite font-serif text-xl leading-relaxed italic sm:text-2xl">
                                &ldquo;{source.paragraph1}&rdquo;
                            </p>
                            <p>{source.paragraph2}</p>
                        </div>

                        <div className="border-stone/20 mt-10 border-t pt-6">
                            <span className="text-bronze font-mono text-xs uppercase">
                                KEY CRITERIA: MINERAL INTEGRITY & NATURAL
                                VARIATION
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
