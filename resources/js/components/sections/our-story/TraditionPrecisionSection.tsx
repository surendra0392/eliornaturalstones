import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { OUR_STORY_IMAGES } from '../../../data/ourStoryImages';
import {
    OUR_STORY_CONTENT,
    type TraditionPrecisionStage,
} from '../../../data/ourStoryContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

export interface TraditionPrecisionProps {
    content?: Partial<typeof OUR_STORY_CONTENT.traditionPrecision>;
}

export function TraditionPrecisionSection({
    content,
}: TraditionPrecisionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);
    const progressionRef = useRef<HTMLDivElement | null>(null);

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

        if (progressionRef.current) {
            const cards =
                progressionRef.current.querySelectorAll('.stage-card');
            if (cards.length > 0) {
                staggerReveal(Array.from(cards) as HTMLElement[], {
                    stagger: 0.12,
                    duration: 0.85,
                    scrollTrigger: {
                        trigger: progressionRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const traditionPrecision = {
        ...OUR_STORY_CONTENT.traditionPrecision,
        ...content,
    };

    const getStageImage = (index: string) => {
        switch (index) {
            case '01':
                return OUR_STORY_IMAGES.traditionPrecision.stage1;
            case '02':
                return OUR_STORY_IMAGES.traditionPrecision.stage2;
            case '03':
                return OUR_STORY_IMAGES.traditionPrecision.stage3;
            case '04':
            default:
                return OUR_STORY_IMAGES.traditionPrecision.stage4;
        }
    };

    return (
        <section
            aria-label="From Tradition to Precision"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Asymmetric Header Split */}
                <div
                    ref={textRef}
                    className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-16"
                >
                    <div className="lg:col-span-6">
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            EVOLUTION & CRAFT
                        </span>
                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.1] font-light sm:text-4xl md:text-5xl lg:text-6xl">
                            {traditionPrecision.headline}
                        </h2>
                    </div>

                    <div className="space-y-4 lg:col-span-6">
                        <p className="text-graphite/85 font-sans text-base leading-relaxed font-light sm:text-lg">
                            {traditionPrecision.paragraph1}
                        </p>
                        <p className="text-graphite font-serif text-lg leading-relaxed font-light italic sm:text-xl">
                            {traditionPrecision.paragraph2}
                        </p>
                    </div>
                </div>

                {/* Visual Progression Grid: 4 Stages */}
                <div
                    ref={progressionRef}
                    className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8"
                >
                    {traditionPrecision.stages.map(
                        (stage: TraditionPrecisionStage) => {
                            const image = getStageImage(stage.index);
                            return (
                                <div
                                    key={stage.index}
                                    className="stage-card group border-border-stone bg-ivory-warm/30 hover:border-bronze/70 card-lift flex flex-col border p-4 shadow-xs transition-all duration-500 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                                >
                                    {/* Stage Image */}
                                    <div className="bg-stone-light relative aspect-[4/3] w-full overflow-hidden">
                                        <EliorImage
                                            src={image.src}
                                            alt={image.alt}
                                            aspectRatio="4/3"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                        <div className="bg-graphite/85 absolute top-2.5 left-2.5 px-2 py-0.5 text-white backdrop-blur-xs">
                                            <span className="font-mono text-[10px] tracking-wider uppercase">
                                                STAGE {stage.index}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-4 flex flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="text-graphite font-serif text-lg font-medium group-hover:text-bronze transition-colors duration-300">
                                                {stage.title}
                                            </h3>
                                            <p className="text-graphite/70 mt-2 font-sans text-xs leading-relaxed font-light">
                                                {stage.caption}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </Container>
        </section>
    );
}
