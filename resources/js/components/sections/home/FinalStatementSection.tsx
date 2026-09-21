import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';

export interface FinalStatementContent {
    headline?: string;
    subline?: string;
    ctaText?: string;
    ctaHref?: string;
}

export function FinalStatementSection({
    content,
}: { content?: FinalStatementContent } = {}) {
    const textRevealRef = useGsapReveal<HTMLDivElement>({
        type: 'fade',
        delay: 0.1,
    });

    const headline = content?.headline || 'Natural stone.\nTimeless spaces.';
    const subline =
        content?.subline || 'Inspired by Nature. Made for Generations.';
    const ctaText = content?.ctaText || 'Begin a Conversation';
    const ctaHref = content?.ctaHref || '/contact';

    return (
        <section
            aria-label="Final Brand Reflection"
            className="bg-graphite relative w-full overflow-hidden py-20 sm:py-28 lg:py-32"
        >
            {/* Immersive Background Architectural Plate */}
            <div className="absolute inset-0 h-full w-full">
                <EliorImage
                    src={HOMEPAGE_IMAGES.finalStatement.src}
                    alt={HOMEPAGE_IMAGES.finalStatement.alt}
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
                <p className="text-champagne text-[10px] font-medium tracking-[0.38em] uppercase md:text-xs">
                    Culmination & Dialogue
                </p>

                <h2 className="mt-6 font-serif text-3xl leading-tight font-light tracking-tight whitespace-pre-line sm:text-5xl md:text-6xl">
                    {headline}
                </h2>

                <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light text-white/85 sm:text-lg">
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
