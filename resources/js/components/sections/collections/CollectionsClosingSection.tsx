import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { COLLECTIONS_IMAGES } from '../../../data/collectionsImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';

interface CollectionsClosingSectionProps {
    content?: {
        headline?: string;
        subline?: string;
        ctaText?: string;
        ctaHref?: string;
    };
}

export function CollectionsClosingSection({ content }: CollectionsClosingSectionProps = {}) {
    const textRevealRef = useGsapReveal<HTMLDivElement>({
        type: 'fade',
        delay: 0.1,
    });

    const headline = content?.headline || 'Every Surface Has a Story.';
    const subline =
        content?.subline ||
        'Natural stone carries the evidence of time, place and formation. ELIOR brings that character into spaces shaped to endure.';
    const ctaText = content?.ctaText || 'Discover ELIOR';
    const ctaHref = content?.ctaHref || '/our-story';

    return (
        <section
            aria-label="Collections Closing Reflection"
            className="bg-graphite relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
        >
            {/* Wide Architectural Background Image */}
            <div className="absolute inset-0 h-full w-full">
                <EliorImage
                    src={COLLECTIONS_IMAGES.closing.src}
                    alt={COLLECTIONS_IMAGES.closing.alt}
                    aspectRatio="auto"
                    containerClassName="h-full w-full"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Architectural Contrast Vignette */}
            <div
                className="from-graphite via-graphite/70 to-graphite/40 absolute inset-0 bg-gradient-to-t"
                aria-hidden="true"
            />

            {/* Editorial Content */}
            <div
                ref={textRevealRef}
                className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
            >
                <p className="text-champagne text-[10px] font-medium tracking-[0.36em] uppercase md:text-xs">
                    Material Philosophy
                </p>

                <h2 className="mt-6 font-serif text-3xl leading-tight font-light tracking-tight sm:text-5xl md:text-6xl">
                    {headline}
                </h2>

                <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed font-light text-white/85 sm:text-lg">
                    {subline}
                </p>

                <div className="mt-10 flex justify-center">
                    <Button
                        href={ctaHref}
                        variant="primary"
                        size="lg"
                        className="bg-ivory text-graphite hover:text-graphite shadow-md hover:bg-white"
                    >
                        {ctaText}
                    </Button>
                </div>
            </div>
        </section>
    );
}
