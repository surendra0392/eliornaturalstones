import { Link } from '@inertiajs/react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { contactContent } from '../../../data/contactContent';
import { contactImages } from '../../../data/contactImages';

export interface ContactClosingProps {
    content?: Partial<typeof contactContent.closing>;
}

export function ContactClosingSection({ content }: ContactClosingProps = {}) {
    const closing = { ...contactContent.closing, ...content };
    const { closing: closingImage } = contactImages;

    return (
        <section className="relative overflow-hidden bg-graphite py-20 text-white sm:py-24 lg:py-32">
            {/* Background Image with Architectural Overlay */}
            <div className="absolute inset-0 z-0">
                <EliorImage
                    src={closingImage.src}
                    alt={closingImage.alt}
                    aspectRatio="auto"
                    className="h-full w-full object-cover object-center opacity-30 transition-transform duration-1000 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/75 to-graphite/40" />
            </div>

            {/* Editorial Content */}
            <Container className="relative z-10">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="font-eyebrow text-champagne/90">
                        {closing.brandMarker}
                    </p>
                    <h2 className="mt-4 font-serif text-3xl leading-[1.12] font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {closing.heading}
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base text-ivory/80 sm:text-lg leading-relaxed">
                        {closing.supportingLine}
                    </p>

                    <div className="mt-10">
                        <Link
                            href={closing.ctaHref}
                            className="inline-flex min-h-[48px] items-center justify-center border border-border-stone bg-ivory px-9 py-3.5 text-xs font-medium tracking-[0.24em] text-graphite uppercase transition-all duration-300 hover:bg-white active:scale-[0.98] active:translate-y-px focus:ring-2 focus:ring-bronze focus:outline-none shadow-sm"
                        >
                            {closing.ctaText}
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
