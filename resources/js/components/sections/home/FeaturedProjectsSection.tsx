import { Link } from '@inertiajs/react';
import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { PROJECTS_DATA, type ProjectItem } from '../../../data/projectsData';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { useGsapStagger } from '../../../hooks/useGsapStagger';

interface FeaturedProjectsSectionProps {
    content?: {
        eyebrow?: string;
        marker?: string;
        title?: string;
        heading?: string;
        subtitle?: string;
        description?: string;
        ctaText?: string;
        ctaHref?: string;
    };
    projects?: ProjectItem[];
}

export function FeaturedProjectsSection({
    content,
    projects: customProjects,
}: FeaturedProjectsSectionProps = {}) {
    const headerRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: ':scope > div',
        stagger: 0.08,
        yOffset: 20,
    });

    const eyebrow =
        content?.eyebrow || 'ELIOR / ARCHITECTURAL COMMISSIONS';
    const marker = content?.marker || '08 — FEATURED COMMISSIONS';
    const title =
        content?.title || content?.heading || 'Spaces Defined by Stone.';
    const subtitle =
        content?.subtitle ||
        content?.description ||
        'Distinguished private residences, commercial pavilions, and luxury hospitality destinations executed with ELIOR natural stone reserves across India.';
    const ctaText = content?.ctaText || 'EXPLORE ALL PROJECTS';
    const ctaHref = content?.ctaHref || '/projects';

    const displayProjects =
        customProjects && customProjects.length > 0
            ? customProjects.slice(0, 4)
            : PROJECTS_DATA.filter((p) => p.featured).slice(0, 4);

    return (
        <Section
            background="warm"
            spacing="spacious"
            border="top"
            aria-label="Featured Architectural Projects & Commissions"
        >
            <Container>
                {/* Section Header */}
                <div
                    ref={headerRevealRef}
                    className="border-border-stone mb-10 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end lg:mb-12"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] tracking-[0.24em] text-bronze uppercase">
                                {marker}
                            </span>
                            <span className="h-px w-6 bg-bronze/40" />
                            <p className="font-eyebrow text-stone-500 uppercase">
                                {eyebrow}
                            </p>
                        </div>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            {title}
                        </h2>
                        <p className="font-body text-graphite-muted mt-2.5">
                            {subtitle}
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0">
                        <Button
                            href={ctaHref}
                            variant="primary"
                            size="md"
                        >
                            {ctaText}
                        </Button>
                    </div>
                </div>

                {/* 4 Featured Projects Grid — Strictly 2 Cards Per Row */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8"
                >
                    {displayProjects.map((project, idx) => (
                        <div
                            key={project.id}
                            className="group border-border-subtle bg-ivory hover:border-bronze/60 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 flex flex-col justify-between border p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        >
                            <div>
                                <div className="border-border-subtle/50 relative overflow-hidden border">
                                    <EliorImage
                                        src={project.image}
                                        alt={project.imageAlt}
                                        aspectRatio="16/9"
                                        className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute top-3 left-3 bg-stone-900/85 px-2.5 py-1 text-[10px] font-medium tracking-wider text-ivory uppercase backdrop-blur-xs">
                                        {project.typology}
                                    </div>
                                    <div className="absolute right-3 bottom-3 bg-ivory/90 px-2.5 py-1 text-[10px] font-mono tracking-wider text-graphite backdrop-blur-xs">
                                        {project.year}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs text-bronze uppercase tracking-wider">
                                            {String(idx + 1).padStart(2, '0')} — {project.location}
                                        </span>
                                        {project.area && (
                                            <span className="font-mono text-[11px] text-stone-400">
                                                {project.area}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-graphite group-hover:text-bronze mt-2 font-serif text-2xl font-light transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="font-body-sm text-graphite-muted mt-2.5 line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Stones Specified Badges */}
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {project.stones.map((stone) => (
                                            <span
                                                key={stone}
                                                className="border border-stone-200 bg-stone-50/80 px-2 py-0.5 text-[10px] font-medium text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                                            >
                                                {stone}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-border-stone/60 mt-6 border-t pt-4">
                                <Link
                                    href={`/projects#${project.id}`}
                                    className="group/link text-graphite group-hover:text-bronze inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase transition-colors"
                                >
                                    <span>View Commission Details</span>
                                    <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                                        &rarr;
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
