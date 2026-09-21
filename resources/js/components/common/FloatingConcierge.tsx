import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

export function FloatingConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    // Close on click outside and Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const whatsappMessage = encodeURIComponent(
        'Hello ELIOR Natural Stones, I would like to consult with an architectural specialist regarding material specifications and slab availability.',
    );

    return (
        <aside
            aria-label="Architectural Consultation Concierge"
            className="fixed bottom-6 left-6 z-40 md:bottom-8 md:left-8"
        >
            {/* Expanded Consultation Drawer / Card */}
            {isOpen && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="concierge-dialog-title"
                    className="border-border-stone bg-ivory/95 mb-3 w-[320px] sm:w-[360px] border p-6 shadow-[0_20px_50px_rgba(15,15,15,0.18)] backdrop-blur-xl animate-fade-in"
                >
                    {/* Concierge Header */}
                    <div className="border-border-stone flex items-start justify-between border-b pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-bronze inline-block h-2 w-2 rounded-full animate-pulse" />
                                <span className="text-bronze text-[9px] font-medium tracking-[0.28em] uppercase">
                                    Specification Desk
                                </span>
                            </div>
                            <h3
                                id="concierge-dialog-title"
                                className="text-graphite mt-1 font-serif text-lg font-light tracking-wide"
                            >
                                Private Concierge
                            </h3>
                            <p className="text-graphite-muted mt-0.5 text-[11px] font-light">
                                Direct liaison with our quarry curators.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Concierge"
                            className="text-graphite-muted hover:text-graphite focus-visible:outline-graphite -mt-1 -mr-1 p-1 text-sm transition-colors focus-visible:outline-2"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Quick Consultation Actions */}
                    <div className="mt-4 space-y-2.5">
                        {/* WhatsApp Priority Chat */}
                        <a
                            href={`https://wa.me/918125958071?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-border-stone bg-ivory-warm/60 hover:border-bronze hover:bg-ivory flex items-center justify-between border p-3 text-left transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="border-border-stone bg-ivory flex h-8 w-8 items-center justify-center border text-[#25D366]">
                                    <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-graphite font-serif text-xs font-normal">
                                        WhatsApp Specification
                                    </div>
                                    <div className="text-taupe text-[9px] tracking-wider uppercase">
                                        Instant Slab & Spec Queries
                                    </div>
                                </div>
                            </div>
                            <span className="text-graphite group-hover:text-bronze text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                            </span>
                        </a>

                        {/* Telephone Direct Line */}
                        <a
                            href="tel:+918125958071"
                            className="border-border-stone bg-ivory-warm/60 hover:border-bronze hover:bg-ivory flex items-center justify-between border p-3 text-left transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="border-border-stone bg-ivory text-graphite flex h-8 w-8 items-center justify-center border">
                                    <svg
                                        className="h-3.5 w-3.5 text-bronze"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-graphite font-serif text-xs font-normal">
                                        Direct Specification Desk
                                    </div>
                                    <div className="text-taupe text-[9px] tracking-wider uppercase">
                                        +91 81259 58071
                                    </div>
                                </div>
                            </div>
                            <span className="text-graphite group-hover:text-bronze text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                            </span>
                        </a>

                        {/* Request Sample Box */}
                        <Link
                            href="/contact?interest=Physical%20Stone%20Sample%20Box&type=sample"
                            onClick={() => setIsOpen(false)}
                            className="border-border-stone bg-ivory-warm/60 hover:border-bronze hover:bg-ivory flex items-center justify-between border p-3 text-left transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="border-border-stone bg-ivory text-graphite flex h-8 w-8 items-center justify-center border">
                                    <svg
                                        className="h-3.5 w-3.5 text-bronze"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-graphite font-serif text-xs font-normal">
                                        Architectural Sample Box
                                    </div>
                                    <div className="text-taupe text-[9px] tracking-wider uppercase">
                                        Tactile finish specimens
                                    </div>
                                </div>
                            </div>
                            <span className="text-graphite group-hover:text-bronze text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                            </span>
                        </Link>
                    </div>

                    {/* Operational Notice */}
                    <div className="border-border-stone mt-4 border-t pt-3 text-center">
                        <p className="text-taupe text-[9px] tracking-widest uppercase">
                            Mon – Sat, 9:30 AM – 7:00 PM IST
                        </p>
                    </div>
                </div>
            )}

            {/* Concierge Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-label={
                    isOpen
                        ? 'Close Consultation Concierge'
                        : 'Open Consultation Concierge'
                }
                className="group border-graphite/20 bg-graphite text-ivory hover:border-bronze hover:bg-graphite-dark flex cursor-pointer items-center gap-2.5 border px-4 py-2.5 shadow-lg backdrop-blur-md transition-all duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-bronze"
            >
                {/* Live Concierge Indicator Ring */}
                <span className="relative flex h-2 w-2">
                    <span className="bg-bronze absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" />
                    <span className="bg-bronze relative inline-flex h-2 w-2 rounded-full" />
                </span>

                <span className="font-serif text-xs tracking-[0.2em] uppercase">
                    {isOpen ? 'Close Concierge' : 'Concierge'}
                </span>

                <span
                    className="text-bronze text-[11px] transition-transform duration-300"
                    aria-hidden="true"
                >
                    {isOpen ? '✕' : '✦'}
                </span>
            </button>
        </aside>
    );
}
