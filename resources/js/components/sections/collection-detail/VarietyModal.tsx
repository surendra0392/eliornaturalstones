import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { EliorImage } from '../../media/EliorImage';
import type { Variety } from '../../../types/stone';

export interface VarietyModalProps {
    variety: Variety | null;
    collectionName: string;
    isOpen: boolean;
    onClose: () => void;
    fallbackImage?: { src: string; alt: string };
}

export function VarietyModal({
    variety,
    collectionName,
    isOpen,
    onClose,
    fallbackImage,
}: VarietyModalProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    // Keyboard dismissal and body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !variety) return null;

    const imageSrc =
        variety.slab_image || fallbackImage?.src || '/images/elior/brand/shared-fallback.webp';
    const imageAlt =
        fallbackImage?.alt || `${variety.name} architectural specimen`;

    const whatsappUrl = `https://wa.me/918125958071?text=${encodeURIComponent(
        `Hello ELIOR, I am inquiring about the availability, slab dimensions, and finish specifications for ${variety.name} (${collectionName}).`,
    )}`;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="variety-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-graphite/85 backdrop-blur-md transition-opacity duration-300"
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-5xl overflow-hidden border border-border-stone bg-ivory shadow-[0_30px_70px_-15px_rgba(15,15,15,0.45)] transition-all duration-300">
                {/* Header Close Bar */}
                <div className="flex items-center justify-between border-b border-border-subtle bg-ivory-warm/60 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <span className="font-mono text-[10px] tracking-[0.28em] text-bronze uppercase">
                            Archival Specimen
                        </span>
                        <span className="text-stone-300" aria-hidden="true">
                            /
                        </span>
                        <span className="font-serif text-xs tracking-wider text-graphite-muted">
                            {collectionName}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-stone bg-ivory text-graphite transition-all hover:border-bronze hover:bg-bronze hover:text-white"
                    >
                        <span className="text-sm font-light transition-transform duration-200 group-hover:rotate-90">
                            ✕
                        </span>
                    </button>
                </div>

                {/* Body: 2-Column Split Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
                    {/* Left: High-Resolution Texture Plate */}
                    <div className="relative bg-stone-light md:col-span-7 flex flex-col justify-center overflow-hidden border-b border-border-stone md:border-b-0 md:border-r">
                        <div
                            onClick={() => setIsZoomed((prev) => !prev)}
                            className={`relative aspect-[4/3] w-full overflow-hidden cursor-zoom-${
                                isZoomed ? 'out' : 'in'
                            }`}
                        >
                            <EliorImage
                                src={imageSrc}
                                alt={imageAlt}
                                aspectRatio="4/3"
                                className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                                    isZoomed ? 'scale-150' : 'hover:scale-105'
                                }`}
                            />
                            {/* Watermark Tag */}
                            <span className="absolute bottom-4 left-4 bg-graphite/85 px-3 py-1 font-mono text-[9px] font-medium tracking-widest text-ivory uppercase backdrop-blur-xs">
                                {isZoomed ? 'Click to standard scale' : 'Click to inspect texture'}
                            </span>
                        </div>
                    </div>

                    {/* Right: Mineral Curation Details */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5 bg-ivory">
                        <div>
                            {variety.color_family && (
                                <span className="font-mono text-[10px] tracking-[0.24em] text-taupe uppercase">
                                    {variety.color_family}
                                </span>
                            )}

                            <h2
                                id="variety-modal-title"
                                className="mt-1.5 font-serif text-2xl sm:text-3xl font-normal tracking-wide text-graphite"
                            >
                                {variety.name}
                            </h2>

                            <div className="my-4 h-px w-12 bg-bronze/60" />

                            <p className="font-sans text-xs sm:text-sm leading-relaxed font-light text-graphite-muted">
                                {variety.description ||
                                    `Selected specimen from the ${collectionName} reserve, cut to preserve natural geological veining and architectural durability.`}
                            </p>

                            {/* Tactile Finishes */}
                            {variety.finishes && variety.finishes.length > 0 && (
                                <div className="mt-6">
                                    <span className="block font-mono text-[10px] tracking-widest text-taupe uppercase">
                                        Calibrated Surface Finishes
                                    </span>
                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                        {variety.finishes.map((finish) => (
                                            <span
                                                key={finish}
                                                className="border border-border-stone bg-ivory-warm/40 px-2.5 py-1 text-[10px] font-medium tracking-wider text-graphite uppercase"
                                            >
                                                {finish}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Architectural Guarantee Notes */}
                            <div className="mt-6 border-t border-border-subtle pt-5 text-xs text-graphite-muted space-y-2">
                                <div className="flex items-center text-[11px] text-graphite">
                                    <span className="mr-2 text-bronze">✦</span>
                                    <span>Quarry direct block curation</span>
                                </div>
                                <div className="flex items-center text-[11px] text-graphite">
                                    <span className="mr-2 text-bronze">✦</span>
                                    <span>Continuous sequence dry-lay available</span>
                                </div>
                                <div className="flex items-center text-[11px] text-graphite">
                                    <span className="mr-2 text-bronze">✦</span>
                                    <span>Calibrated custom slab thickness (20–50mm)</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="mt-8 space-y-3 pt-4 border-t border-border-stone">
                            <Link
                                href={`/contact?interest=${encodeURIComponent(
                                    variety.name,
                                )}&collection=${encodeURIComponent(
                                    collectionName,
                                )}&type=Sample%20Request`}
                                className="block w-full border border-graphite bg-graphite py-3 text-center font-sans text-[11px] font-medium tracking-[0.24em] text-ivory uppercase transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-white"
                            >
                                Request Physical Sample Box
                            </Link>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 w-full border border-border-stone bg-ivory-warm/40 py-2.5 text-center font-sans text-[11px] font-medium tracking-[0.2em] text-graphite uppercase transition-colors hover:border-bronze hover:text-bronze"
                            >
                                <span>Direct WhatsApp Inquiry</span>
                                <span aria-hidden="true">↗</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
