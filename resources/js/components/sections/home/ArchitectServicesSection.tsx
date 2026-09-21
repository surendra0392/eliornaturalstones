import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { useGsapStagger } from '../../../hooks/useGsapStagger';

interface ArchitectServicesSectionProps {
    content?: {
        eyebrow?: string;
        heading?: string;
        description?: string;
        ctaText?: string;
        ctaHref?: string;
    };
}

export function ArchitectServicesSection({ content }: ArchitectServicesSectionProps = {}) {
    const headerRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const servicesGridRef = useGsapStagger<HTMLDivElement>({
        selector: ':scope > div',
        stagger: 0.08,
        yOffset: 20,
    });

    const eyebrow = content?.eyebrow || 'Professional Partnerships';
    const heading = content?.heading || 'Designed Around Your Vision.';
    const description =
        content?.description ||
        'From material selection to technical guidance, ELIOR works alongside architects and designers to help bring considered material choices into exceptional spaces.';
    const ctaText = content?.ctaText || 'Work With ELIOR';
    const ctaHref = content?.ctaHref || '/architect-designer-services';

    return (
        <Section
            background="warm"
            spacing="spacious"
            border="top"
            aria-label="Architect & Designer Trade Services"
        >
            <Container size="wide">
                {/* Section Header */}
                <div
                    ref={headerRevealRef}
                    className="border-border-stone mb-10 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end lg:mb-12"
                >
                    <div className="max-w-2xl">
                        <p className="font-eyebrow">{eyebrow}</p>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            {heading}
                        </h2>
                        <p className="font-body text-graphite-muted mt-2.5">
                            {description}
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0">
                        <Button
                            href={ctaHref}
                            variant="primary"
                            size="md"
                        >
                            {ctaText}
                        </Button>
                    </div>
                </div>

                {/* 6 Service Disciplines - Image-Led Architectural Cards */}
                <div
                    ref={servicesGridRef}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
                >
                    {HOMEPAGE_IMAGES.architectServices.map((service) => (
                        <div
                            key={service.number}
                            className="group border-border-subtle bg-ivory hover:border-bronze/60 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 border p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        >
                            <div className="border-border-subtle/50 relative overflow-hidden border">
                                <EliorImage
                                    src={service.src}
                                    alt={`${service.title} - Architectural Service`}
                                    aspectRatio="16/9"
                                    className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                />
                            </div>

                            <div className="mt-5">
                                <span className="font-caption text-bronze block font-serif text-sm tracking-wider">
                                    {service.number}
                                </span>
                                <h3 className="text-graphite group-hover:text-bronze mt-1.5 font-serif text-xl font-normal transition-colors">
                                    {service.title}
                                </h3>
                                <p className="font-body-sm text-graphite-muted mt-2 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
