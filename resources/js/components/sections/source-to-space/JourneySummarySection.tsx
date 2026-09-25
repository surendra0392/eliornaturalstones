import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

export function JourneySummarySection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current || prefersReducedMotion()) return;

        verticalTextReveal(sectionRef.current, {
            duration: 1.0,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 85%',
            },
        });
    }, []);

    const pillars = [
        {
            number: '01',
            title: 'Direct Provenance',
            subtitle: 'Geological Authenticity',
            description:
                'Noble blocks extracted directly from historic reserves in Rajasthan and South India, preserving natural compressive density and authentic veining.',
        },
        {
            number: '02',
            title: 'Calibrated Precision',
            subtitle: 'Millimetric Tolerance',
            description:
                'Automated diamond bridge sawing, thickness calibration, and edge refinement ensuring flawless dry-lay alignment and monolithic continuity.',
        },
        {
            number: '03',
            title: 'Protected Delivery',
            subtitle: 'Surface Integrity',
            description:
                'Export-grade timber A-frame crating, high-density foam isolation, and dedicated pan-India logistics preserving each surface until installation.',
        },
    ];

    return (
        <section
            aria-label="Journey Summary and Architectural Synthesis"
            className="bg-ivory-warm border-border-subtle relative border-b py-20 sm:py-24 lg:py-28"
        >
            <Container>
                <div ref={sectionRef} className="mx-auto max-w-4xl text-center">
                    <span className="text-bronze font-sans text-xs tracking-[0.3em] uppercase">
                        Architectural Synthesis
                    </span>

                    <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.15] font-light sm:text-4xl md:text-5xl">
                        Six Stages. One Continuous Standard.
                    </h2>

                    <p className="text-graphite/75 mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed font-light sm:text-lg">
                        From geological extraction in historic Indian reserves to final
                        monolithic realization, every phase in our journey is calibrated
                        to ensure that natural stone preserves its tactile character and
                        architectural permanence.
                    </p>
                </div>

                {/* Three Core Commitments Grid */}
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
                    {pillars.map((pillar) => (
                        <div
                            key={pillar.number}
                            className="bg-ivory/80 border-border-stone relative border p-8 shadow-xs transition-shadow duration-300 hover:shadow-sm"
                        >
                            <span className="text-bronze/60 font-mono text-xs tracking-wider">
                                {pillar.number}
                            </span>
                            <h3 className="text-graphite mt-3 font-serif text-xl font-light">
                                {pillar.title}
                            </h3>
                            <p className="text-graphite/50 font-sans text-xs uppercase tracking-wider mt-1">
                                {pillar.subtitle}
                            </p>
                            <p className="text-graphite/70 mt-4 font-sans text-sm leading-relaxed font-light">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
