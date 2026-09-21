import { useState } from 'react';
import type { MediaItem } from '../../../types/media';

interface AdminMediaCardProps {
    media: MediaItem;
    onClick: (media: MediaItem) => void;
}

export function AdminMediaCard({ media, onClick }: AdminMediaCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onClick(media)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(media);
                }
            }}
            className="group border-border-stone bg-stone-base/60 hover:border-gold/40 hover:bg-stone-base focus:border-gold relative flex cursor-pointer flex-col border p-2.5 text-left transition-all duration-300 hover:shadow-lg focus:outline-hidden"
        >
            {/* Visual Thumbnail Container */}
            <div className="bg-graphite border-border-subtle relative flex aspect-4/3 w-full items-center justify-center overflow-hidden border">
                {!imageError ? (
                    <img
                        src={media.thumb_url || media.url}
                        alt={media.alt_text || media.name}
                        loading="lazy"
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <svg
                            className="text-taupe/40 h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-taupe mt-1 font-mono text-[9px] tracking-wider uppercase">
                            Preview Unavailable
                        </span>
                    </div>
                )}

                {/* Collection / Slot Badge */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className="border-border-stone bg-graphite/90 border px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-stone-300 uppercase backdrop-blur-xs">
                        {media.collection_name}
                    </span>
                    {media.is_associated && media.associated_entity && (
                        <span className="border-gold/30 bg-graphite/90 text-gold-light border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase backdrop-blur-xs">
                            {media.associated_entity.name}
                        </span>
                    )}
                </div>

                {/* Hover Quick Overlay */}
                <div className="bg-graphite/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
                    <span className="border-ivory/40 bg-graphite/90 text-ivory border px-3 py-1 font-mono text-[10px] tracking-widest uppercase">
                        Inspect Asset
                    </span>
                </div>
            </div>

            {/* Metadata Footer */}
            <div className="mt-2.5 flex flex-col gap-1 px-0.5">
                <div className="flex items-center justify-between gap-2">
                    <p
                        className="text-ivory/90 group-hover:text-gold-light truncate font-sans text-xs transition-colors"
                        title={media.name || media.file_name}
                    >
                        {media.name || media.file_name}
                    </p>
                </div>

                <div className="text-taupe flex items-center justify-between font-mono text-[10px]">
                    <span>
                        {media.dimensions.formatted ||
                            (media.mime_type?.split('/')[1]?.toUpperCase() ??
                                'FILE')}
                    </span>
                    <span>{media.size_formatted}</span>
                </div>
            </div>
        </div>
    );
}
