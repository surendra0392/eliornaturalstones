import { Link } from '@inertiajs/react';
import { Container } from '../common/Container';

interface CtaSectionProps {
    eyebrow?: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonHref?: string;
}

export function CtaSection({
    eyebrow = 'Trade Collaboration',
    title,
    description,
    buttonText = 'Initiate Specification',
    buttonHref = '/contact',
}: CtaSectionProps) {
    return (
        <section className="border-border-subtle bg-ivory-warm border-t py-24 lg:py-32">
            <Container size="narrow" className="text-center">
                <p className="text-bronze text-[11px] font-medium tracking-[0.3em] uppercase">
                    {eyebrow}
                </p>

                <h2 className="text-graphite mt-4 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                    {title}
                </h2>

                <p className="text-graphite-muted mx-auto mt-6 max-w-xl text-sm leading-relaxed lg:text-base">
                    {description}
                </p>

                <div className="mt-10">
                    <Link
                        href={buttonHref}
                        className="border-graphite bg-graphite text-ivory hover:border-bronze hover:bg-bronze inline-block border px-8 py-4 text-xs tracking-[0.24em] uppercase transition-all duration-300 hover:text-white"
                    >
                        {buttonText}
                    </Link>
                </div>
            </Container>
        </section>
    );
}
