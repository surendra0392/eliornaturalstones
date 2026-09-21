import { Container } from '../../layout/Container';
import { useGsapStagger } from '../../../hooks/useGsapStagger';
import type { CharacteristicItem } from '../../../data/collectionDetailImages';

interface MaterialCharacteristicsSectionProps {
    collectionName: string;
    characteristics: CharacteristicItem[];
}

export function MaterialCharacteristicsSection({
    collectionName,
    characteristics,
}: MaterialCharacteristicsSectionProps) {
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: '.char-card',
        y: 20,
        stagger: 0.08,
    });

    return (
        <section
            aria-label={`${collectionName} Characteristics`}
            className="border-border-subtle bg-ivory-warm relative w-full border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Header */}
                <div className="mb-12 max-w-2xl md:mb-16">
                    <p className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase md:text-xs">
                        Tectonic & Surface Attributes
                    </p>
                    <h2 className="text-graphite mt-3 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                        Material Characteristics
                    </h2>
                    <p className="text-graphite-muted mt-3 text-xs tracking-wider uppercase">
                        Defining physical properties of {collectionName}
                    </p>
                </div>

                {/* 4-Column Editorial Characteristics Grid */}
                <div
                    ref={gridRef}
                    className="bg-border-stone grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
                >
                    {characteristics.map((char, index) => (
                        <div
                            key={char.title}
                            className="char-card bg-ivory group hover:bg-ivory-warm/80 flex flex-col justify-between p-8 transition-all duration-300 sm:p-10 hover:shadow-xs"
                        >
                            <div>
                                <span className="text-taupe font-serif text-sm italic group-hover:text-bronze transition-colors duration-300">
                                    0{index + 1}
                                </span>
                                <h3 className="text-graphite mt-6 font-serif text-xl font-normal tracking-tight">
                                    {char.title}
                                </h3>
                            </div>
                            <p className="text-graphite-muted mt-6 text-xs leading-relaxed font-light">
                                {char.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
