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

interface MovementSectionProps {
    content?: {
        stageIndex?: string;
        stageLabel?: string;
        heading?: string;
        subtitle?: string;
        paragraph1?: string;
        image?: string;
    };
}

export function MovementSection({ content }: MovementSectionProps = {}) {
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

    const movement = {
        stageIndex:
            content?.stageIndex || SOURCE_TO_SPACE_CONTENT.movement.stageIndex,
        stageLabel:
            content?.stageLabel || SOURCE_TO_SPACE_CONTENT.movement.stageLabel,
        heading: content?.heading || SOURCE_TO_SPACE_CONTENT.movement.heading,
        subtitle:
            content?.subtitle || SOURCE_TO_SPACE_CONTENT.movement.subtitle,
        paragraph1:
            content?.paragraph1 || SOURCE_TO_SPACE_CONTENT.movement.paragraph1,
    };

    return (
        <section
            aria-label="Movement and Transit Stage"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Movement Photography */}
                    <div ref={imgRef} className="lg:col-span-6">
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        SOURCE_TO_SPACE_IMAGES.features.movement
                                            .src
                                    }
                                    alt={
                                        SOURCE_TO_SPACE_IMAGES.features.movement
                                            .alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-left">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    TRANSIT TOWARD ARCHITECTURAL DESTINATION
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Narrative */}
                    <div ref={textRef} className="lg:col-span-6">
                        <div className="flex items-center space-x-3">
                            <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                                {movement.stageLabel}
                            </span>
                            <span
                                className="bg-stone/30 h-px w-6"
                                aria-hidden="true"
                            />
                            <span className="text-stone-dark font-sans text-[10px] tracking-[0.2em] uppercase">
                                {movement.subtitle}
                            </span>
                        </div>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {movement.heading}
                        </h2>

                        <div className="text-graphite/85 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p className="text-graphite font-serif text-xl leading-relaxed italic sm:text-2xl">
                                &ldquo;{movement.paragraph1}&rdquo;
                            </p>
                        </div>

                        <div className="border-stone/20 mt-10 border-t pt-6">
                            <span className="text-bronze font-mono text-xs uppercase">
                                DESTINATION ALIGNED WITH ARCHITECTURAL SCHEDULE
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
