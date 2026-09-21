import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { useGsapReveal } from '../../../hooks/useGsapReveal';

interface CollectionEnquirySectionProps {
    collectionName: string;
}

export function CollectionEnquirySection({
    collectionName,
}: CollectionEnquirySectionProps) {
    const contentRef = useGsapReveal<HTMLDivElement>({
        type: 'text',
        delay: 0.1,
    });

    return (
        <section
            aria-label={`Enquire on ${collectionName}`}
            className="bg-graphite relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
        >
            {/* Subtle Architectural Texture Line */}
            <div
                className="from-taupe/10 to-bronze/10 pointer-events-none absolute inset-0 bg-gradient-to-b opacity-20"
                aria-hidden="true"
            />

            <Container className="relative z-10">
                <div ref={contentRef} className="mx-auto max-w-3xl text-center">
                    <p className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase sm:text-xs">
                        Trade & Private Inquiries
                    </p>

                    <h2 className="text-ivory mt-4 font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        Find the Right Stone for Your Space.
                    </h2>

                    <p className="text-ivory-warm/75 mx-auto mt-6 max-w-xl text-sm leading-relaxed font-light sm:text-base">
                        Tell us what you are creating. Our team can help you
                        explore materials, finishes and possibilities for{' '}
                        {collectionName} and custom spatial installations.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            variant="primary"
                            href="/contact"
                            className="w-full sm:w-auto"
                        >
                            Begin a Conversation
                        </Button>
                    </div>

                    <div className="border-border-graphite mt-14 border-t pt-8">
                        <p className="text-taupe text-[10px] tracking-widest uppercase">
                            Material Consultation · Specification Guidance ·
                            Private Viewings
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
