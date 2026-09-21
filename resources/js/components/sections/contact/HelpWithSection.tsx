import { useRef } from 'react';
import { Container } from '../../layout/Container';
import { contactContent } from '../../../data/contactContent';
import { useGsapStagger } from '../../../hooks/useGsapStagger';

interface HelpWithSectionProps {
    content?: {
        eyebrow?: string;
        heading?: string;
        items?: Array<{
            id: string;
            number: string;
            title: string;
            description: string;
        }>;
    };
}

export function HelpWithSection({ content }: HelpWithSectionProps = {}) {
    const howWeCanHelp = {
        eyebrow: content?.eyebrow || contactContent.howWeCanHelp.eyebrow,
        heading: content?.heading || contactContent.howWeCanHelp.heading,
        items: content?.items || contactContent.howWeCanHelp.items,
    };

    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: '.capability-card',
        yOffset: 24,
        stagger: 0.08,
        duration: 0.8,
    });

    return (
        <section className="border-b border-border-subtle bg-ivory-warm/40 py-16 md:py-20 lg:py-24">
            <Container>
                {/* Section Header */}
                <div className="max-w-2xl">
                    <p className="font-eyebrow text-bronze">
                        {howWeCanHelp.eyebrow}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl leading-tight font-normal tracking-tight text-graphite">
                        {howWeCanHelp.heading}
                    </h2>
                </div>

                {/* 6 Capabilities Grid */}
                <div
                    ref={gridRef}
                    className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                >
                    {howWeCanHelp.items.map((item) => (
                        <div
                            key={item.id}
                            className="capability-card card-lift border border-border-stone bg-ivory p-8 transition-all duration-500 hover:border-bronze hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                        >
                            <span className="font-mono text-xs font-semibold tracking-widest text-bronze">
                                {item.number}
                            </span>
                            <h3 className="mt-4 font-serif text-xl font-normal text-graphite">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-xs leading-relaxed text-graphite-muted">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
