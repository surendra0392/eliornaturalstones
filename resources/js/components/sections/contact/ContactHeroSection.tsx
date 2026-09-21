import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { contactContent } from '../../../data/contactContent';
import { contactImages } from '../../../data/contactImages';

export interface ContactHeroProps {
    content?: Partial<typeof contactContent.hero>;
}

export function ContactHeroSection({ content }: ContactHeroProps = {}) {
    const hero = { ...contactContent.hero, ...content };
    const { hero: heroImage } = contactImages;

    function handleScrollToForm(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const target = document.getElementById('enquiry-form');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <section className="bg-ivory border-border-subtle relative overflow-hidden border-b pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
            <Container>
                {/* Header Copy */}
                <div className="max-w-3xl">
                    <p className="text-bronze font-mono text-[11px] font-medium tracking-[0.28em] uppercase">
                        {hero.eyebrow}
                    </p>
                    <h1 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light tracking-tight sm:text-4xl lg:text-5xl">
                        {hero.title}
                    </h1>
                    <p className="text-graphite-muted mt-4 max-w-2xl text-base leading-relaxed font-light sm:text-lg">
                        {hero.supportingCopy}
                    </p>

                    <div className="mt-6 flex items-center gap-6">
                        <a
                            href={hero.ctaHref}
                            onClick={handleScrollToForm}
                            className="border-graphite bg-graphite text-ivory hover:bg-graphite/90 shadow-xs active:scale-[0.98] inline-flex min-h-[48px] items-center justify-center border px-8 py-3.5 text-xs font-medium tracking-[0.24em] uppercase transition-all duration-300 focus:outline-none"
                        >
                            {hero.ctaText}
                        </a>
                        <span className="text-taupe hidden font-mono text-xs tracking-[0.2em] uppercase sm:inline-block">
                            ARCHITECTURAL ENQUIRY
                        </span>
                    </div>
                </div>

                {/* Hero Architectural Visual */}
                <div className="border-border-stone bg-ivory-warm/40 mt-8 overflow-hidden border shadow-xs sm:mt-10 lg:mt-12">
                    <EliorImage
                        src={heroImage.src}
                        alt={heroImage.alt}
                        aspectRatio="auto"
                        containerClassName="h-[220px] sm:h-[280px] lg:h-[340px] w-full"
                        priority
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.01]"
                    />
                </div>
            </Container>
        </section>
    );
}
