import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { useGsapStagger } from '../../../hooks/useGsapStagger';
import type { ApplicationItem } from '../../../data/collectionDetailImages';

interface ApplicationsSectionProps {
    collectionName: string;
    applications: ApplicationItem[];
}

export function ApplicationsSection({
    collectionName,
    applications,
}: ApplicationsSectionProps) {
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: '.app-card',
        y: 20,
        stagger: 0.08,
    });

    return (
        <section
            aria-label={`${collectionName} Applications`}
            className="border-border-subtle bg-ivory-warm relative w-full border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Section Header */}
                <div className="mb-12 max-w-2xl md:mb-16">
                    <p className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase md:text-xs">
                        Spatial Intent
                    </p>
                    <h2 className="text-graphite mt-3 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                        Where the Material Belongs
                    </h2>
                    <p className="text-graphite-muted mt-3 text-xs tracking-wider uppercase">
                        Architectural disciplines suited for {collectionName}
                    </p>
                </div>

                {/* 4-Column Applications Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {applications.map((app, index) => (
                        <div
                            key={app.name}
                            className="app-card group border-border-stone bg-ivory hover:border-bronze/70 card-lift flex flex-col border transition-all duration-500 shadow-xs hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                        >
                            {/* Application Architectural Photography */}
                            <div className="bg-stone-light relative aspect-[3/2] w-full overflow-hidden">
                                <EliorImage
                                    src={app.image.src}
                                    alt={app.image.alt}
                                    aspectRatio="3/2"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                                <span className="bg-graphite/85 text-ivory absolute top-3 left-3 px-2 py-0.5 text-[9px] tracking-widest uppercase backdrop-blur-xs">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* Application Copy */}
                            <div className="p-6">
                                <h3 className="text-graphite font-serif text-xl font-normal tracking-wide group-hover:text-bronze transition-colors duration-300">
                                    {app.name}
                                </h3>
                                <p className="text-graphite-muted mt-3 text-xs leading-relaxed font-light">
                                    {app.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
