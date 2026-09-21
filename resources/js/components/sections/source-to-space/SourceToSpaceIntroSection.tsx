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

export interface SourceToSpaceIntroProps {
    content?: Partial<typeof SOURCE_TO_SPACE_CONTENT.intro>;
}

export function SourceToSpaceIntroSection({
    content,
}: SourceToSpaceIntroProps = {}) {
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

    const intro = {
        ...SOURCE_TO_SPACE_CONTENT.intro,
        ...content,
    };

    return (
        <section
            aria-label="From Material to Meaning"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Narrative (7 Columns) */}
                    <div ref={textRef} className="lg:col-span-7">
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            PHILOSOPHY OF PASSAGE
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl lg:text-6xl">
                            {intro.headline}
                        </h2>

                        <div className="text-graphite/85 mt-8 space-y-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            <p className="text-graphite font-serif text-xl leading-relaxed italic sm:text-2xl">
                                &ldquo;{intro.paragraph1}&rdquo;
                            </p>
                            <p>{intro.paragraph2}</p>
                            <p className="text-graphite font-medium">
                                {intro.paragraph3}
                            </p>
                        </div>
                    </div>

                    {/* Right Raw Stone Image Plate (5 Columns) */}
                    <div ref={imgRef} className="lg:col-span-5">
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[4/5] w-full overflow-hidden">
                                <EliorImage
                                    src={SOURCE_TO_SPACE_IMAGES.intro.src}
                                    alt={SOURCE_TO_SPACE_IMAGES.intro.alt}
                                    aspectRatio="4/5"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                />
                            </div>
                            <div className="p-3 text-right">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    FIG. 01 - GEOLOGICAL ORIGIN
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
