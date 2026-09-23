import type { ReactNode } from 'react';
import { Header, type HeaderProps } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { BackToTop } from '../components/common/BackToTop';
import { Breadcrumbs, type BreadcrumbItem } from '../components/common/Breadcrumbs';
import { FloatingConcierge } from '../components/common/FloatingConcierge';
import { Container } from '../components/layout/Container';
import { PageTransition } from '../components/layout/PageTransition';

export interface PublicLayoutProps {
    children: ReactNode;
    headerVariant?: HeaderProps['variant'];
    breadcrumbs?: BreadcrumbItem[];
}

export function PublicLayout({
    children,
    headerVariant = 'solid',
    breadcrumbs,
}: PublicLayoutProps) {
    return (
        <div className="bg-ivory text-graphite selection:bg-stone selection:text-graphite flex min-h-screen flex-col">
            {/* Accessible Skip to Main Content Link */}
            <a
                href="#main-content"
                className="focus:border-graphite focus:bg-ivory focus:text-graphite focus:ring-bronze sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:px-4 focus:py-2 focus:text-xs focus:tracking-widest focus:uppercase focus:ring-2 focus:outline-none"
            >
                Skip to content
            </a>

            <Header variant={headerVariant} />

            {breadcrumbs && breadcrumbs.length > 1 && (
                <div className="border-border-stone/60 bg-ivory-warm/75 border-b py-2.5 backdrop-blur-xs">
                    <Container>
                        <Breadcrumbs items={breadcrumbs} />
                    </Container>
                </div>
            )}

            <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 outline-none"
            >
                <PageTransition>{children}</PageTransition>
            </main>

            <Footer />

            <BackToTop />

            <FloatingConcierge />
        </div>
    );
}
