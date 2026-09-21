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

interface MaterialConsultationSectionProps {
    content?: {
        heading?: string;
        subtitle?: string;
        paragraph?: string;
        considerations?: string[];
        image?: string;
    };
}

export function MaterialConsultationSection({ content }: MaterialConsultationSectionProps = {}) {
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

    const consultation = {
        heading:
            content?.heading || ARCHITECT_SERVICES_CONTENT.consultation.heading,
        subtitle:
            content?.subtitle ||
            ARCHITECT_SERVICES_CONTENT.consultation.subtitle,
        paragraph:
            content?.paragraph ||
            ARCHITECT_SERVICES_CONTENT.consultation.paragraph,
        considerations:
            content?.considerations ||
            ARCHITECT_SERVICES_CONTENT.consultation.considerations,
    };

    return (
        <section
            aria-label="Material Consultation"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                    {/* Left Column: Material Photography */}
                    <div ref={imgRef} className="lg:col-span-6">
                        <div className="bg-ivory-warm/70 border-border-stone relative overflow-hidden border p-3 shadow-xs">
                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                <EliorImage
                                    src={
                                        ARCHITECT_SERVICES_IMAGES.consultation
                                            .src
                                    }
                                    alt={
                                        ARCHITECT_SERVICES_IMAGES.consultation
                                            .alt
                                    }
                                    aspectRatio="16/9"
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-3 text-left">
                                <span className="text-graphite/50 font-mono text-[10px] tracking-wider uppercase">
                                    CURATORIAL SLAB INSPECTION & SURFACE
                                    HARMONIZATION
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Narrative & Considerations */}
                    <div ref={textRef} className="lg:col-span-6">
                        <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                            {consultation.subtitle}
                        </span>

                        <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                            {consultation.heading}
                        </h2>

                        <p className="text-graphite/85 mt-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                            {consultation.paragraph}
                        </p>

                        {/* 5 Consideration Tags */}
                        <div className="mt-8">
                            <span className="text-graphite/60 font-sans text-[11px] tracking-[0.2em] uppercase">
                                KEY EVALUATION CRITERIA:
                            </span>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {consultation.considerations.map(
                                    (item: string) => (
                                        <span
                                            key={item}
                                            className="border-border-stone text-graphite border bg-ivory-warm/60 px-3.5 py-1 font-mono text-xs tracking-wider"
                                        >
                                            {item}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
