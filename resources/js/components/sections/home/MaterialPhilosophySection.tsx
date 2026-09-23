import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { MaterialImage } from '../../media/MaterialImage';
import { EliorImage } from '../../media/EliorImage';
import { EditorialLink } from '../../ui/EditorialLink';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';

export interface MaterialPhilosophyContent {
    headline?: string;
    supportingStatement?: string;
    paragraph?: string;
}

export function MaterialPhilosophySection({
    content,
}: { content?: MaterialPhilosophyContent } = {}) {
    const textRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    
    // Graceful fallback from deprecated placeholder copy
    const headline =
        !content?.headline || content.headline === 'Material First. Text Second.'
            ? 'Formed by Nature. Defined by Architecture.'
            : content.headline;

    const supportingStatement =
        !content?.supportingStatement ||
        content.supportingStatement === 'We believe the stone should speak before the specification does. Vein, texture, tone and finish shape the character of a space.' ||
        content.supportingStatement === 'We believe the stone should speak before the specification does.'
            ? 'Every block of stone carries an unrepeatable geological story, curated to bring enduring elegance and quiet luxury to spaces.'
            : content.supportingStatement;

    const paragraph =
        content?.paragraph ||
        'Natural stone is a living medium shaped by deep tectonic pressure and mineral composition. At ELIOR, we honor this organic journey—sourcing quarry blocks with exceptional veining and calibrating each slab with architectural precision, ensuring every installation remains timeless, distinctive, and unrepeatable.';

    return (
        <Section
            background="ivory"
            spacing="spacious"
            border="none"
            aria-label="Material Philosophy & Stone Study"
        >
            <Container>
                {/* Asymmetrical Editorial Composition (60 / 40 Split with Overlapping Detail Plate) */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left: Large Architectural Slab Study & Macro Inset */}
                    <div className="relative lg:col-span-7">
                        <div className="border-border-subtle bg-stone-light/20 overflow-hidden border shadow-[0_20px_50px_-20px_rgba(15,15,15,0.1)]">
                            <MaterialImage
                                src={
                                    HOMEPAGE_IMAGES.materialPhilosophy.primary
                                        .src
                                }
                                alt={
                                    HOMEPAGE_IMAGES.materialPhilosophy.primary
                                        .alt
                                }
                                finishLabel="Macro Plate 04 - Geological Vein Mapping"
                                aspectRatio="16/9"
                            />
                        </div>

                        {/* Floating Asymmetric Detail Inset (Desktop) */}
                        <div className="border-ivory bg-ivory-light absolute -right-8 -bottom-10 hidden w-64 border-4 shadow-[0_20px_40px_-10px_rgba(15,15,15,0.15)] lg:block">
                            <EliorImage
                                src={
                                    HOMEPAGE_IMAGES.materialPhilosophy.detail
                                        .src
                                }
                                alt={
                                    HOMEPAGE_IMAGES.materialPhilosophy.detail
                                        .alt
                                }
                                aspectRatio="1/1"
                            />
                            <div className="p-3">
                                <span className="font-caption text-taupe block text-[9px] tracking-widest uppercase">
                                    Detail Study
                                </span>
                                <p className="text-graphite mt-0.5 font-serif text-xs">
                                    Honed Crystal Edge
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Narrative Philosophy */}
                    <div ref={textRevealRef} className="lg:col-span-5 lg:pl-4">
                        <p className="font-eyebrow">Material Philosophy</p>

                        <h2 className="font-display-md text-graphite mt-4 leading-tight font-light">
                            {headline}
                        </h2>

                        <p className="font-body-lg text-graphite mt-6 leading-relaxed">
                            {supportingStatement}
                        </p>

                        <p className="font-body text-graphite-muted mt-4 leading-relaxed">
                            {paragraph}
                        </p>

                        {/* Architectural Material Properties */}
                        <div className="border-border-stone mt-8 space-y-4 border-t pt-6">
                            <div className="border-border-subtle flex items-baseline justify-between border-b pb-3">
                                <span className="font-body-sm text-graphite">
                                    Geological Density
                                </span>
                                <span className="font-caption text-taupe uppercase">
                                    Enduring Longevity
                                </span>
                            </div>
                            <div className="border-border-subtle flex items-baseline justify-between border-b pb-3">
                                <span className="font-body-sm text-graphite">
                                    Natural Veining
                                </span>
                                <span className="font-caption text-taupe uppercase">
                                    Singular Individuality
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between pb-1">
                                <span className="font-body-sm text-graphite">
                                    Surface Patina
                                </span>
                                <span className="font-caption text-taupe uppercase">
                                    Evolves with Time
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <EditorialLink href="/collections">
                                Examine Material Finishes & Slabs
                            </EditorialLink>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
