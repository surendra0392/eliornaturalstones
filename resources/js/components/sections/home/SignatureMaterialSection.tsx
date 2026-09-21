import { useRef, useEffect } from 'react';
import { EliorImage } from '../../media/EliorImage';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { subtleParallax, prefersReducedMotion } from '../../../animations/gsap';

interface SignatureMaterialSectionProps {
    content?: {
        eyebrow?: string;
        line1?: string;
        line2?: string;
        subline?: string;
        image?: string;
        imageAlt?: string;
    };
}

export function SignatureMaterialSection({ content }: SignatureMaterialSectionProps = {}) {
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        if (imageContainerRef.current) {
            subtleParallax(imageContainerRef.current, undefined, 15);
        }
    }, []);

    const eyebrow =
        content?.eyebrow || 'Signature Architectural Presence';
    const line1 = content?.line1 || 'Chosen by Nature.';
    const line2 = content?.line2 || 'Defined by Design.';
    const subline = content?.subline || 'Material becomes architecture.';
    const imageSrc = content?.image || HOMEPAGE_IMAGES.signatureMoment.src;
    const imageAlt =
        content?.imageAlt || HOMEPAGE_IMAGES.signatureMoment.alt;

    return (
        <section
            aria-label="Signature Material Pause"
            className="bg-graphite relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
        >
            {/* Background Full-Width Image with Parallax & Dramatic Overlay */}
            <div
                ref={imageContainerRef}
                className="absolute inset-0 -top-[10%] h-[120%] w-full"
            >
                <EliorImage
                    src={imageSrc}
                    alt={imageAlt}
                    aspectRatio="auto"
                    containerClassName="h-full w-full"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Dark Architectural Contrast Overlay */}
            <div
                className="bg-graphite/45 absolute inset-0 backdrop-brightness-[0.85]"
                aria-hidden="true"
            />

            {/* Minimalist Monumental Typography */}
            <div
                ref={contentRef}
                className="relative z-10 mx-auto max-w-5xl px-6 text-center"
            >
                <p className="text-champagne text-[10px] font-medium tracking-[0.28em] uppercase md:text-xs">
                    {eyebrow}
                </p>

                <h2 className="mt-5 font-serif text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[54px] leading-tight">
                    {line1}
                    <br />
                    <span className="text-champagne italic">
                        {line2}
                    </span>
                </h2>

                <p className="mx-auto mt-4 max-w-lg font-sans text-sm font-light tracking-wide text-white/80 sm:text-base">
                    {subline}
                </p>
            </div>
        </section>
    );
}
