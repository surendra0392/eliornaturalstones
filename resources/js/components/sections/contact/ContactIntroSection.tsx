import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { contactContent } from '../../../data/contactContent';
import { contactImages } from '../../../data/contactImages';

interface ContactIntroSectionProps {
    content?: {
        eyebrow?: string;
        title?: string;
        description1?: string;
        description2?: string;
        pillars?: Array<{ title: string; description: string }>;
        image?: string;
    };
}

export function ContactIntroSection({ content }: ContactIntroSectionProps = {}) {
    const intro = {
        eyebrow: content?.eyebrow || contactContent.intro.eyebrow,
        title: content?.title || contactContent.intro.title,
        description1:
            content?.description1 || contactContent.intro.description1,
        description2:
            content?.description2 || contactContent.intro.description2,
        pillars: content?.pillars || contactContent.intro.pillars,
    };
    const { intro: introImage } = contactImages;

    return (
        <section className="border-border-subtle bg-ivory relative border-b py-16 md:py-20 lg:py-24">
            <Container>
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left 7 Columns: Editorial Copy & 6 Pillars */}
                    <div className="lg:col-span-7">
                        <p className="text-bronze font-mono text-[11px] font-medium tracking-[0.28em] uppercase">
                            {intro.eyebrow}
                        </p>
                        <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light tracking-tight sm:text-4xl lg:text-5xl">
                            {intro.title}
                        </h2>

                        <div className="text-graphite-muted mt-8 space-y-4 text-base leading-relaxed font-light sm:text-lg">
                            <p>{intro.description1}</p>
                            <p>{intro.description2}</p>
                        </div>

                        {/* 6 Exploration Pillars */}
                        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {intro.pillars.map((pillar, idx) => (
                                <div
                                    key={idx}
                                    className="border-border-stone bg-ivory-warm/30 hover:border-bronze/70 card-lift border p-6 transition-all duration-300 shadow-xs"
                                >
                                    <div className="text-bronze font-mono text-[10px] tracking-widest">
                                        0{idx + 1}
                                    </div>
                                    <h3 className="text-graphite mt-2 font-serif text-sm font-medium tracking-wider uppercase">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-graphite-muted mt-2 text-xs leading-relaxed font-light">
                                        {pillar.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right 5 Columns: Architectural Stone Plate */}
                    <div className="lg:col-span-5">
                        <div className="border-border-stone bg-ivory-warm/70 overflow-hidden border p-3 shadow-xs">
                            <EliorImage
                                src={introImage.src}
                                alt={introImage.alt}
                                aspectRatio="4/5"
                                className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                            />
                        </div>
                        <p className="text-taupe mt-3 font-mono text-[11px] tracking-wider uppercase">
                            Surface depth · Natural light interaction
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
