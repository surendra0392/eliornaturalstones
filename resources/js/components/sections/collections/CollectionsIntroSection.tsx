import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { EditorialImage } from '../../media/EditorialImage';
import { COLLECTIONS_IMAGES } from '../../../data/collectionsImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';

interface CollectionsIntroSectionProps {
    content?: {
        eyebrow?: string;
        headline?: string;
        paragraph1?: string;
        paragraph2?: string;
    };
}

export function CollectionsIntroSection({ content }: CollectionsIntroSectionProps = {}) {
    const textRevealRef = useGsapReveal<HTMLDivElement>({
        type: 'text',
        delay: 0.1,
    });

    const eyebrow = content?.eyebrow || 'Material Selection';
    const headline = content?.headline || 'Stone, Selected With Intention.';
    const paragraph1 =
        content?.paragraph1 ||
        'From the expressive veining of marble to the quiet permanence of limestone, each material is selected for its character, performance and ability to belong naturally within architecture.';
    const paragraph2 =
        content?.paragraph2 ||
        'Our reserve represents over three decades of geological relationships, pairing raw block extraction with meticulous calibrating to offer architects and spatial designers materials of authentic provenance and lasting presence.';

    return (
        <Section
            background="ivory"
            spacing="spacious"
            border="none"
            aria-label="Collection Curation & Philosophy"
        >
            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
                    {/* Left: Magazine-style Asymmetrical Narrative */}
                    <div ref={textRevealRef} className="lg:col-span-7">
                        <p className="font-eyebrow">{eyebrow}</p>

                        <h2 className="font-display-lg text-graphite mt-4 leading-tight font-light">
                            {headline}
                        </h2>

                        <div className="mt-8 space-y-6">
                            <p className="font-body-lg text-graphite-muted max-w-2xl leading-relaxed">
                                {paragraph1}
                            </p>

                            <p className="font-body text-graphite-muted max-w-2xl leading-relaxed">
                                {paragraph2}
                            </p>
                        </div>

                        {/* Subtle Material Indicators */}
                        <div className="border-border-stone mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-3">
                            <div>
                                <span className="font-caption text-taupe block uppercase">
                                    Reserves
                                </span>
                                <p className="font-heading-md text-graphite mt-1">
                                    09 Curated Reserves
                                </p>
                            </div>
                            <div>
                                <span className="font-caption text-taupe block uppercase">
                                    Format
                                </span>
                                <p className="font-heading-md text-graphite mt-1">
                                    Slabs, Tiles & Bespoke
                                </p>
                            </div>
                            <div>
                                <span className="font-caption text-taupe block uppercase">
                                    Application
                                </span>
                                <p className="font-heading-md text-graphite mt-1">
                                    Interior & Monolithic
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Close Material Detail Plate */}
                    <div className="lg:col-span-5">
                        <EditorialImage
                            src={COLLECTIONS_IMAGES.intro.src}
                            alt={COLLECTIONS_IMAGES.intro.alt}
                            aspectRatio="4/5"
                            caption="Expressive natural veining and honed crystalline finish"
                            containerClassName="shadow-[0_12px_40px_-15px_rgba(15,15,15,0.07)]"
                        />
                    </div>
                </div>
            </Container>
        </Section>
    );
}
