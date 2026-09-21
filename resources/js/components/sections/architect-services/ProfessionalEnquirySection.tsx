import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { ARCHITECT_SERVICES_CONTENT } from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ProfessionalEnquirySectionProps {
    content?: {
        headline?: string;
        supportingCopy?: string;
        ctaPrimary?: string;
        ctaPrimaryHref?: string;
        ctaSecondary?: string;
        ctaSecondaryHref?: string;
    };
}

export function ProfessionalEnquirySection({ content }: ProfessionalEnquirySectionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!textRef.current || prefersReducedMotion()) return;
        verticalTextReveal(textRef.current, {
            duration: 1.1,
            scrollTrigger: {
                trigger: textRef.current,
                start: 'top 85%',
            },
        });
    }, []);

    const enquiry = {
        headline:
            content?.headline || ARCHITECT_SERVICES_CONTENT.enquiry.headline,
        supportingCopy:
            content?.supportingCopy ||
            ARCHITECT_SERVICES_CONTENT.enquiry.supportingCopy,
        ctaPrimary:
            content?.ctaPrimary ||
            ARCHITECT_SERVICES_CONTENT.enquiry.ctaPrimary,
        ctaPrimaryHref:
            content?.ctaPrimaryHref ||
            ARCHITECT_SERVICES_CONTENT.enquiry.ctaPrimaryHref,
        ctaSecondary:
            content?.ctaSecondary ||
            ARCHITECT_SERVICES_CONTENT.enquiry.ctaSecondary,
        ctaSecondaryHref:
            content?.ctaSecondaryHref ||
            ARCHITECT_SERVICES_CONTENT.enquiry.ctaSecondaryHref,
    };

    return (
        <section
            aria-label="Professional Trade Enquiry"
            className="bg-ivory-warm border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div
                    ref={textRef}
                    className="border-border-stone mx-auto max-w-3xl border bg-ivory p-10 text-center shadow-xs md:p-16 lg:p-20"
                >
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        TRADE ADVISORY & COLLABORATION
                    </span>

                    <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                        {enquiry.headline}
                    </h2>

                    <p className="text-graphite/80 mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed font-light sm:text-lg">
                        {enquiry.supportingCopy}
                    </p>

                    {/* Dual CTAs */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            href={enquiry.ctaPrimaryHref}
                            variant="primary"
                            className="w-full sm:w-auto"
                        >
                            {enquiry.ctaPrimary}
                        </Button>
                        <Button
                            href={enquiry.ctaSecondaryHref}
                            variant="secondary"
                            className="w-full sm:w-auto"
                        >
                            {enquiry.ctaSecondary}
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
