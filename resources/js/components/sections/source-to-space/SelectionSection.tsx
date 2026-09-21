import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { SOURCE_TO_SPACE_IMAGES } from '../../../data/sourceToSpaceImages';
import {
    SOURCE_TO_SPACE_CONTENT,
    type SelectionAttribute,
} from '../../../data/sourceToSpaceContent';
import {
    verticalTextReveal,
    imageClipReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface SelectionSectionProps {
    content?: {
        stageIndex?: string;
        heading?: string;
        subtitle?: string;
        paragraph1?: string;
        attributes?: SelectionAttribute[];
        image?: string;
    };
}

export function SelectionSection({ content }: SelectionSectionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

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

        if (listRef.current) {
            const items = listRef.current.querySelectorAll('.attr-item');
            if (items.length > 0) {
                staggerReveal(Array.from(items) as HTMLElement[], {
                    stagger: 0.1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const selection = {
        stageIndex:
            content?.stageIndex || SOURCE_TO_SPACE_CONTENT.selection.stageIndex,
        heading: content?.heading || SOURCE_TO_SPACE_CONTENT.selection.heading,
        subtitle:
            content?.subtitle || SOURCE_TO_SPACE_CONTENT.selection.subtitle,
        paragraph1:
            content?.paragraph1 || SOURCE_TO_SPACE_CONTENT.selection.paragraph1,
        attributes:
            content?.attributes ||
            SOURCE_TO_SPACE_CONTENT.selection.attributes,
    };

    return (
        <section
            aria-label="Selection and Curation Stage"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Slab Selection Photography */}
                    <div ref={imgRef} className="lg:col-span-6">
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        SOURCE_TO_SPACE_IMAGES.features
                                            .selection.src
                                    }
                                    alt={
                                        SOURCE_TO_SPACE_IMAGES.features
                                            .selection.alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-left">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    CURATORIAL SLAB INSPECTION & HARMONIZATION
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Editorial Considerations */}
                    <div ref={textRef} className="lg:col-span-6">
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            {selection.subtitle}
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {selection.heading}
                        </h2>

                        <p className="text-graphite/85 mt-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            {selection.paragraph1}
                        </p>

                        {/* 4-Point Design Consideration List */}
                        <div
                            ref={listRef}
                            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2"
                        >
                            {selection.attributes.map(
                                (attr: SelectionAttribute) => (
                                    <div
                                        key={attr.title}
                                        className="attr-item border-bronze/40 hover:border-bronze border-l-2 pl-4 transition-colors duration-300"
                                    >
                                        <h3 className="text-graphite font-serif text-base font-medium tracking-wide">
                                            {attr.title}
                                        </h3>
                                        <p className="text-graphite/70 mt-1.5 font-sans text-xs leading-relaxed font-light">
                                            {attr.description}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
