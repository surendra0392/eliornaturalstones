import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { OUR_STORY_IMAGES } from '../../../data/ourStoryImages';
import { OUR_STORY_CONTENT } from '../../../data/ourStoryContent';
import {
    verticalTextReveal,
    imageClipReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface StoryOpeningProps {
    content?: {
        statement?: string;
        paragraph1?: string;
        paragraph2?: string;
    };
}

export function StoryOpeningSection({ content }: StoryOpeningProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        if (textRef.current) {
            verticalTextReveal(textRef.current, {
                duration: 1.1,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                },
            });
        }

        if (imgRef.current) {
            imageClipReveal(imgRef.current, {
                duration: 1.3,
                scrollTrigger: {
                    trigger: imgRef.current,
                    start: 'top 85%',
                },
            });
        }
    }, []);

    const opening = {
        ...OUR_STORY_CONTENT.opening,
        ...content,
    };

    return (
        <section
            aria-label="Story Opening Statement"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Editorial Narrative (7 Columns) */}
                    <div ref={textRef} className="lg:col-span-7">
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            ORIGIN & PROVENANCE
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl lg:text-6xl">
                            {opening.statement}
                        </h2>

                        <div className="text-graphite/80 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p>{opening.paragraph1}</p>
                            <p>{opening.paragraph2}</p>
                        </div>

                        {/* Architectural Accent Details */}
                        <div className="border-border-stone mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-3">
                            <div>
                                <span className="text-graphite font-serif text-2xl font-light sm:text-3xl">
                                    1990
                                </span>
                                <p className="text-graphite/60 mt-1 font-sans text-xs tracking-wider uppercase">
                                    Origins
                                </p>
                            </div>
                            <div>
                                <span className="text-graphite font-serif text-2xl font-light sm:text-3xl">
                                    30+
                                </span>
                                <p className="text-graphite/60 mt-1 font-sans text-xs tracking-wider uppercase">
                                    Years of Mastery
                                </p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <span className="text-graphite font-serif text-2xl font-light sm:text-3xl">
                                    01
                                </span>
                                <p className="text-graphite/60 mt-1 font-sans text-xs tracking-wider uppercase">
                                    Singular Focus
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Raw Stone Image Plate (5 Columns) */}
                    <div ref={imgRef} className="lg:col-span-5">
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[4/5] w-full overflow-hidden">
                                <EliorImage
                                    src={OUR_STORY_IMAGES.opening.src}
                                    alt={OUR_STORY_IMAGES.opening.alt}
                                    aspectRatio="4/5"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                />
                            </div>
                            <div className="p-3 text-right">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    FIG. 01 - RAW BLOCK EXTRACTION
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
