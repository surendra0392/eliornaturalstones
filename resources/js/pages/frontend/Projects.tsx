import { useState, useMemo, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { SeoHead } from '../../components/seo/SeoHead';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { EliorImage } from '../../components/media/EliorImage';
import {
    PROJECTS_DATA,
    PROJECT_CATEGORIES,
    type ProjectItem,
} from '../../data/projectsData';
import { useGsapReveal } from '../../hooks/useGsapReveal';
import { useGsapStagger } from '../../hooks/useGsapStagger';
import { cn } from '../../lib/utils';
import type { PublicSiteSettings } from '../../types/setting';

interface ProjectsPageProps {
    cmsContent?: {
        title?: string;
        subtitle?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: {
            hero?: {
                eyebrow?: string;
                marker?: string;
                title?: string;
                subtitle?: string;
                image?: string;
                imageAlt?: string;
            };
            intro?: {
                headline?: string;
                paragraph1?: string;
                paragraph2?: string;
            };
            categories?: Array<{ id: string; label: string }>;
            projects?: ProjectItem[];
            cta?: {
                headline?: string;
                subline?: string;
                buttonText?: string;
                buttonHref?: string;
            };
            closing?: {
                headline?: string;
                signature?: string;
            };
        };
    } | null;
}

export default function Projects({ cmsContent }: ProjectsPageProps) {
    const { siteSettings, appUrl } = usePage<{
        siteSettings?: PublicSiteSettings;
        appUrl?: string;
    }>().props;

    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/projects`;

    const heroContent = cmsContent?.content?.hero;
    const introContent = cmsContent?.content?.intro;
    const ctaContent = cmsContent?.content?.cta;

    const rawProjects: ProjectItem[] =
        cmsContent?.content?.projects &&
        Array.isArray(cmsContent.content.projects) &&
        cmsContent.content.projects.length > 0
            ? cmsContent.content.projects
            : PROJECTS_DATA;

    const categories =
        cmsContent?.content?.categories &&
        Array.isArray(cmsContent.content.categories) &&
        cmsContent.content.categories.length > 0
            ? cmsContent.content.categories
            : PROJECT_CATEGORIES;

    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null,
    );

    // Deep link hash handling (e.g. #the-courtyard-villa)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash.replace('#', '');
            const matched = rawProjects.find((p) => p.id === hash);
            if (matched) {
                setSelectedProject(matched);
            }
        }
    }, [rawProjects]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedProject(null);
            }
        };
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedProject]);

    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return rawProjects;
        return rawProjects.filter((p) => p.category === activeCategory);
    }, [rawProjects, activeCategory]);

    const heroRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const introRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: ':scope > div',
        stagger: 0.08,
        yOffset: 20,
    });

    const pageTitle =
        cmsContent?.meta_title ||
        'ELIOR Natural Stones | Architectural Projects & Commissions';
    const pageDescription =
        cmsContent?.meta_description ||
        'Discover private residences, luxury hospitality retreats, and cultural pavilions executed with ELIOR natural stone reserves across India.';

    const heroImage =
        heroContent?.image || '/images/elior/projects/projects-hero.jpg';

    // JSON-LD structured data for architectural works
    const schemaData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: pageTitle,
            description: pageDescription,
            url: canonicalUrl,
            publisher: {
                '@type': 'Organization',
                name: 'ELIOR Natural Stones',
                url: baseUrl,
            },
            mainEntity: {
                '@type': 'ItemList',
                itemListElement: rawProjects.map((proj, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    item: {
                        '@type': 'ArchitecturalWork',
                        name: proj.title,
                        description: proj.description,
                        locationCreated: {
                            '@type': 'Place',
                            address: proj.location,
                        },
                        image: `${baseUrl}${proj.image}`,
                    },
                })),
            },
        },
    ];

    return (
        <PublicLayout>
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath="/projects"
                ogImage={heroImage}
                keywords={[
                    'architectural stone projects',
                    'Indian marble installations',
                    'luxury villa stone surfaces',
                    'hospitality natural stone',
                    'bespoke stone commissions',
                    'Hyderabad luxury residences',
                    'Delhi stone pavilion',
                    'Kota limestone retreat',
                ]}
                schemas={schemaData}
            />

            {/* 01 — HERO SECTION */}
            <section
                aria-label="Projects Hero"
                className="relative flex min-h-[46vh] items-center justify-center overflow-hidden border-b border-border-subtle bg-ivory-warm pt-20 pb-12 sm:pt-24 sm:pb-14 lg:min-h-[52vh] lg:pt-28 lg:pb-16"
            >
                {/* Background Architectural Canvas */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt={heroContent?.imageAlt || 'Architectural Stone Projects'}
                        className="h-full w-full object-cover object-center opacity-25 filter grayscale contrast-125 transition-opacity duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ivory-warm via-ivory-warm/85 to-ivory-warm/40" />
                </div>

                <Container className="relative z-10 text-center">
                    <div ref={heroRevealRef} className="mx-auto max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-3">
                            <span className="font-mono text-[10px] tracking-[0.28em] text-bronze uppercase">
                                {heroContent?.marker || 'PORTFOLIO'}
                            </span>
                            <span className="h-px w-6 bg-bronze/40" />
                            <p className="font-eyebrow text-stone-500 uppercase">
                                {heroContent?.eyebrow || 'ELIOR / ARCHITECTURAL COMMISSIONS'}
                            </p>
                        </div>

                        <h1 className="font-display-lg text-graphite font-light tracking-tight">
                            {heroContent?.title || 'Spaces Defined by Stone.'}
                        </h1>

                        <p className="font-body text-graphite-muted mx-auto mt-5 max-w-2xl leading-relaxed">
                            {heroContent?.subtitle ||
                                'Distinguished private residences, commercial pavilions, and luxury hospitality destinations executed with ELIOR natural stone reserves across India.'}
                        </p>
                    </div>
                </Container>
            </section>

            {/* 02 — INTRODUCTORY STATEMENT */}
            <section className="border-b border-border-subtle bg-ivory py-16 lg:py-20">
                <Container>
                    <div
                        ref={introRevealRef}
                        className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12"
                    >
                        <div className="md:col-span-5">
                            <span className="font-mono text-[10px] tracking-[0.24em] text-bronze uppercase">
                                Material Architecture
                            </span>
                            <h2 className="font-display-md text-graphite mt-2 font-light">
                                {introContent?.headline || 'Form Follows Material.'}
                            </h2>
                        </div>
                        <div className="space-y-4 md:col-span-7">
                            <p className="font-body text-graphite leading-relaxed">
                                {introContent?.paragraph1 ||
                                    'Every building begins as an intention; natural stone grounds that intention in permanent geological reality.'}
                            </p>
                            <p className="font-body-sm text-graphite-muted leading-relaxed">
                                {introContent?.paragraph2 ||
                                    'At ELIOR, we collaborate directly with leading architects, structural engineers, and interior designers to supply monumental block reserves, calibrate finishes, and deliver bespoke cut-to-size stone solutions for notable commissions across India.'}
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 03 — FILTERABLE PROJECTS PORTFOLIO */}
            <Section background="warm" spacing="spacious" aria-label="Projects Gallery">
                <Container>
                    {/* Category Filter Navigation */}
                    <div className="border-border-stone mb-12 flex flex-wrap items-center justify-center gap-2 border-b pb-6 sm:gap-3 lg:mb-16">
                        {categories.map((cat) => {
                            const isSelected = activeCategory === cat.id;
                            const count =
                                cat.id === 'all'
                                    ? rawProjects.length
                                    : rawProjects.filter((p) => p.category === cat.id).length;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        'group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300',
                                        isSelected
                                            ? 'border-graphite bg-graphite text-ivory shadow-xs'
                                            : 'border-border-subtle bg-ivory text-graphite-light hover:border-bronze hover:text-graphite',
                                        'border',
                                    )}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={cn(
                                            'font-mono text-[10px]',
                                            isSelected ? 'text-ivory/70' : 'text-stone-400',
                                        )}
                                    >
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Projects Grid — 3 Cards Per Row */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
                    >
                        {filteredProjects.map((project, idx) => (
                            <article
                                key={project.id}
                                id={project.id}
                                className="group border-border-subtle bg-ivory hover:border-bronze/60 hover:shadow-[0_20px_45px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 flex flex-col justify-between border p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            >
                                <div>
                                    {/* Image Frame */}
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
                                        <div className="absolute right-3 bottom-3 bg-ivory/95 px-2.5 py-1 text-[10px] font-mono tracking-wider text-graphite backdrop-blur-xs">
                                            {project.year}
                                        </div>
                                    </div>

                                    {/* Project Meta */}
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

                                        <h3 className="text-graphite group-hover:text-bronze mt-2 font-serif text-xl font-light transition-colors lg:text-[22px]">
                                            {project.title}
                                        </h3>

                                        <p className="font-body-sm text-graphite-muted mt-2.5 line-clamp-3 leading-relaxed">
                                            {project.description}
                                        </p>

                                        {/* Stones Specified */}
                                        <div className="mt-4">
                                            <span className="text-[10px] font-medium tracking-wider text-taupe uppercase block mb-1.5">
                                                Stones Specified
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.stones.map((stone) => (
                                                    <span
                                                        key={stone}
                                                        className="border border-stone-200 bg-stone-50/90 px-2 py-0.5 text-[10px] font-medium text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
                                                    >
                                                        {stone}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="border-border-stone/60 mt-6 flex items-center justify-between border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProject(project)}
                                        className="group/btn text-graphite hover:text-bronze inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase transition-colors"
                                    >
                                        <span>View Commission</span>
                                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                                            &rarr;
                                        </span>
                                    </button>

                                    <Link
                                        href={`/contact?project=${encodeURIComponent(project.title)}`}
                                        className="text-[11px] text-taupe hover:text-bronze font-mono uppercase tracking-wider underline underline-offset-4 transition-colors"
                                    >
                                        Inquire Spec
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* 04 — SPECIFICATION & CONSULTATION DESK CTA */}
            <section className="border-t border-border-subtle bg-ivory py-20 lg:py-24">
                <Container>
                    <div className="border-border-stone bg-ivory-warm border p-8 md:p-12 lg:p-16">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="font-mono text-[10px] tracking-[0.28em] text-bronze uppercase">
                                Trade & Architectural Consultation
                            </span>
                            <h2 className="font-display-md text-graphite mt-3 font-light">
                                {ctaContent?.headline || 'Developing an Architectural Project?'}
                            </h2>
                            <p className="font-body text-graphite-muted mx-auto mt-4 max-w-2xl leading-relaxed">
                                {ctaContent?.subline ||
                                    'Our material specialists assist with slab reservations, technical test data, custom cut-to-size specifications, and physical sample boxes delivered across India.'}
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
                                <Button
                                    href={ctaContent?.buttonHref || '/contact'}
                                    variant="primary"
                                    size="lg"
                                >
                                    {ctaContent?.buttonText || 'REQUEST MATERIAL SPECIFICATION'}
                                </Button>
                                <Button
                                    href="/collections"
                                    variant="secondary"
                                    size="lg"
                                >
                                    EXPLORE COLLECTIONS
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 05 — DETAIL MODAL */}
            {selectedProject && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10"
                >
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-stone-950/75 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setSelectedProject(null)}
                    />

                    {/* Modal Dialog Body */}
                    <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-stone-200 bg-ivory p-6 shadow-2xl sm:p-8 lg:p-10 dark:border-stone-800 dark:bg-stone-900">
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setSelectedProject(null)}
                            className="text-graphite-light hover:text-graphite absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-lg transition-colors dark:border-stone-700 dark:bg-stone-800"
                            aria-label="Close project modal"
                        >
                            &times;
                        </button>

                        <div className="space-y-6">
                            {/* Modal Header */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-bronze uppercase tracking-wider">
                                    <span>{selectedProject.typology}</span>
                                    <span>•</span>
                                    <span>{selectedProject.location}</span>
                                    <span>•</span>
                                    <span>{selectedProject.year}</span>
                                </div>
                                <h3
                                    id="modal-title"
                                    className="font-display-md text-graphite mt-2 font-light"
                                >
                                    {selectedProject.title}
                                </h3>
                            </div>

                            {/* Full Image */}
                            <div className="border border-border-subtle overflow-hidden">
                                <EliorImage
                                    src={selectedProject.image}
                                    alt={selectedProject.imageAlt}
                                    aspectRatio="16/9"
                                />
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-2 gap-4 border-y border-border-stone py-4 font-mono text-xs sm:grid-cols-4">
                                <div>
                                    <span className="text-taupe block text-[10px] uppercase">
                                        Typology
                                    </span>
                                    <span className="text-graphite mt-0.5 block font-medium">
                                        {selectedProject.typology}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-taupe block text-[10px] uppercase">
                                        Location
                                    </span>
                                    <span className="text-graphite mt-0.5 block font-medium">
                                        {selectedProject.location}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-taupe block text-[10px] uppercase">
                                        Year
                                    </span>
                                    <span className="text-graphite mt-0.5 block font-medium">
                                        {selectedProject.year}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-taupe block text-[10px] uppercase">
                                        Scale
                                    </span>
                                    <span className="text-graphite mt-0.5 block font-medium">
                                        {selectedProject.area || 'Architectural Custom'}
                                    </span>
                                </div>
                            </div>

                            {/* Long Narrative */}
                            <div className="space-y-3 font-body text-graphite-muted leading-relaxed">
                                <h4 className="font-serif text-lg font-normal text-graphite">
                                    Spatial Narrative & Stone Curation
                                </h4>
                                <p>{selectedProject.longDescription || selectedProject.description}</p>
                            </div>

                            {/* Stones Specified */}
                            <div>
                                <h4 className="font-serif text-sm font-normal text-graphite uppercase tracking-wider mb-2">
                                    Materials Applied
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.stones.map((s) => (
                                        <span
                                            key={s}
                                            className="border border-stone-300 bg-stone-100 px-3 py-1 font-mono text-xs font-medium text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="border-border-stone flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row">
                                <Button
                                    href={`/contact?project=${encodeURIComponent(selectedProject.title)}`}
                                    variant="primary"
                                    size="md"
                                >
                                    INQUIRE ABOUT THIS SPECIFICATION
                                </Button>
                                <Button
                                    onClick={() => setSelectedProject(null)}
                                    variant="secondary"
                                    size="md"
                                >
                                    CLOSE
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
