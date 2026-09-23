import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { EditorialImage } from '../../media/EditorialImage';
import { EditorialLink } from '../../ui/EditorialLink';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';

export interface BrandPositioningContent {
    heading?: string;
    paragraph1?: string;
    paragraph2?: string;
}

export function BrandPositioningSection({
    content,
}: { content?: BrandPositioningContent } = {}) {
    const textRevealRef = useGsapReveal<HTMLDivElement>({
        type: 'text',
        delay: 0.1,
    });

    const heading = content?.heading || 'Permanent. Tactile. Distinct.';
    const paragraph1 =
        content?.paragraph1 ||
        'From the earth to the spaces we inhabit, natural stone carries a story of time, place and craftsmanship. ELIOR brings that story into contemporary architecture through carefully selected materials and considered expertise.';
    const paragraph2 =
        content?.paragraph2 ||
        'Every slab is evaluated for geological purity, structural integrity, and architectural resonance - bridging ancient geological formations with modern spaces of quiet permanence.';

    return (
        <Section
            background="ivory"
            spacing="spacious"
            border="none"
            aria-label="Brand Positioning & Ethos"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
                    {/* Left Editorial Narrative */}
                    <div ref={textRevealRef} className="lg:col-span-7">
                        <p className="font-eyebrow">Brand Positioning</p>

                        <h2 className="font-display-lg text-graphite mt-3.5 font-light">
                            {heading}
                        </h2>

                        <div className="mt-7 space-y-4">
                            <p className="font-body-lg text-graphite-muted max-w-2xl leading-relaxed">
                                {paragraph1}
                            </p>

                            <p className="font-body text-graphite-muted max-w-2xl leading-relaxed">
                                {paragraph2}
                            </p>
                        </div>

                        <div className="border-border-stone mt-8 grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-3">
                            <div>
                                <span className="font-caption text-taupe block uppercase">
                                    Discipline
                                </span>
                                <p className="font-heading-md text-graphite mt-1">
                                    Architectural
                                </p>
                            </div>
                            <div>
                                <span className="font-caption text-taupe block uppercase">
                                    Selection
                                </span>
                                <p className="font-heading-md text-graphite mt-1">
                                    Quarry Direct
                                </p>
                            </div>
                            <div>
                                <span className="font-caption text-taupe block uppercase">
                                    Ethos
                                </span>
                                <p className="font-heading-md text-graphite mt-1">
                                    Made for Generations
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <EditorialLink href="/our-story">
                                Discover Our Heritage & Ethos
                            </EditorialLink>
                        </div>
                    </div>

                    {/* Right Editorial Architectural Plate */}
                    <div className="lg:col-span-5">
                        <EditorialImage
                            src={HOMEPAGE_IMAGES.brandPositioning.src}
                            alt={HOMEPAGE_IMAGES.brandPositioning.alt}
                            aspectRatio="4/5"
                            caption="Architectural harmony of living stone within contemporary spatial volumes"
                            containerClassName="shadow-[0_12px_40px_-15px_rgba(15,15,15,0.07)]"
                        />
                    </div>
                </div>
            </Container>
        </Section>
    );
}
