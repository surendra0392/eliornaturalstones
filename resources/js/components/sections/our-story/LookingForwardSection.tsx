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

export interface LookingForwardProps {
    content?: Partial<typeof OUR_STORY_CONTENT.lookingForward>;
}

export function LookingForwardSection({ content }: LookingForwardProps = {}) {
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

    const lookingForward = {
        ...OUR_STORY_CONTENT.lookingForward,
        ...content,
    };

    return (
        <section
            aria-label="Today and Looking Forward"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Contemporary Architectural Photography */}
                    <div
                        ref={imgRef}
                        className="order-2 lg:order-1 lg:col-span-6"
                    >
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={OUR_STORY_IMAGES.lookingForward.src}
                                    alt={OUR_STORY_IMAGES.lookingForward.alt}
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-left">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    CONTEMPORARY ARCHITECTURAL HARMONY
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Editorial Vision */}
                    <div
                        ref={textRef}
                        className="order-1 lg:order-2 lg:col-span-6"
                    >
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            TODAY & BEYOND
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {lookingForward.heading}
                        </h2>

                        <div className="text-graphite/85 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p>{lookingForward.paragraph1}</p>
                            <p className="text-graphite font-serif text-xl leading-relaxed font-light italic">
                                {lookingForward.paragraph2}
                            </p>
                        </div>

                        <div className="border-stone/20 mt-10 border-t pt-6">
                            <div className="flex items-center space-x-6">
                                <div>
                                    <span className="text-graphite font-serif text-lg">
                                        Architectural Focus
                                    </span>
                                    <p className="text-graphite/60 font-sans text-xs">
                                        Natural & Engineered Slabs
                                    </p>
                                </div>
                                <div className="bg-stone/20 h-8 w-px" />
                                <div>
                                    <span className="text-graphite font-serif text-lg">
                                        Considered Design
                                    </span>
                                    <p className="text-graphite/60 font-sans text-xs">
                                        Form That Endures
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
