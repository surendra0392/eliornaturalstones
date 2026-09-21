import { useState, useEffect } from 'react';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size_formatted: string;
    url: string;
    thumb_url: string;
    alt_text: string | null;
}

interface AdminMediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: { url: string; alt: string }) => void;
    currentUrl?: string;
}

export function AdminMediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    currentUrl = '',
}: AdminMediaPickerModalProps) {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState(currentUrl);
    const [selectedAlt, setSelectedAlt] = useState('');
    const [customUrl, setCustomUrl] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        setSelectedUrl(currentUrl);
        setCustomUrl(currentUrl);

        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({ per_page: '36' });
                if (search.trim()) {
                    params.set('search', search.trim());
                }
                const res = await apiClient<MediaItem[]>(
                    `${API_ENDPOINTS.v1.admin.media}?${params.toString()}`,
                );
                if (res?.data) {
                    setMediaList(res.data);
                }
            } catch (err) {
                console.error('Failed to load media library items', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeout = setTimeout(
            () => {
                void fetchMedia();
            },
            search ? 300 : 0,
        );
        return () => clearTimeout(timeout);
    }, [isOpen, search, currentUrl]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const urlToUse = selectedUrl || customUrl;
        if (urlToUse) {
            onSelect({
                url: urlToUse,
                alt: selectedAlt,
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="border-border-stone bg-charcoal flex max-h-[90vh] w-full max-w-4xl flex-col border shadow-2xl">
                {/* Modal Header */}
                <div className="border-border-stone flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h3 className="font-serif text-lg font-light text-white">
                            Select Architectural Imagery
                        </h3>
                        <p className="text-taupe mt-0.5 text-xs">
                            Choose from the Media Library or specify a custom
                            asset path.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-stone-warm p-1 transition-colors hover:text-white"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Search & Custom URL Bar */}
                <div className="border-border-stone/60 bg-stone-dark/50 flex flex-col gap-3 border-b p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search media library by name or alt text..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-border-stone bg-charcoal placeholder:text-stone-warm focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="text-stone-warm absolute top-2.5 right-3 text-xs hover:text-white"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="flex flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Or enter direct URL / static path (e.g. /images/...)"
                            value={customUrl}
                            onChange={(e) => {
                                setCustomUrl(e.target.value);
                                setSelectedUrl(e.target.value);
                            }}
                            className="border-border-stone bg-charcoal placeholder:text-stone-warm focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                        />
                    </div>
                </div>

                {/* Media Grid */}
                <div className="max-h-[450px] min-h-[300px] flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-stone-warm flex h-48 items-center justify-center text-xs">
                            Loading media library assets...
                        </div>
                    ) : mediaList.length === 0 ? (
                        <div className="flex h-48 flex-col items-center justify-center text-center">
                            <p className="text-stone-warm text-sm">
                                {search
                                    ? 'No matching media found for your search.'
                                    : 'Media library is currently empty.'}
                            </p>
                            <p className="text-taupe mt-1 text-xs">
                                You can enter a direct asset path in the field
                                above or upload media in the Media module.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {mediaList.map((item) => {
                                const isSelected = selectedUrl === item.url;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedUrl(item.url);
                                            setCustomUrl(item.url);
                                            if (item.alt_text) {
                                                setSelectedAlt(item.alt_text);
                                            }
                                        }}
                                        className={`group relative flex flex-col border p-1 text-left transition-all ${
                                            isSelected
                                                ? 'border-champagne ring-champagne bg-stone-dark/80 ring-1'
                                                : 'border-border-stone/40 hover:border-border-stone bg-stone-dark/30'
                                        }`}
                                    >
                                        <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                                            <img
                                                src={item.thumb_url || item.url}
                                                alt={item.alt_text || item.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {isSelected && (
                                                <div className="bg-champagne/20 absolute inset-0 flex items-center justify-center">
                                                    <span className="bg-champagne text-charcoal rounded-full px-2 py-0.5 text-[10px] font-bold">
                                                        ✓ Selected
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-1.5 truncate text-[11px] font-light text-white/90">
                                            {item.name || item.file_name}
                                        </p>
                                        <span className="text-stone-warm text-[10px]">
                                            {item.size_formatted}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Selected Preview & Actions */}
                <div className="border-border-stone bg-stone-dark/70 flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                    <div className="flex w-full items-center gap-3 overflow-hidden sm:w-auto">
                        {selectedUrl ? (
                            <>
                                <img
                                    src={selectedUrl}
                                    alt="Preview"
                                    className="border-border-stone h-10 w-10 flex-shrink-0 border object-cover"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLElement
                                        ).style.display = 'none';
                                    }}
                                />
                                <div className="truncate text-xs">
                                    <p className="max-w-xs truncate text-white">
                                        {selectedUrl}
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Optional image alt text"
                                        value={selectedAlt}
                                        onChange={(e) =>
                                            setSelectedAlt(e.target.value)
                                        }
                                        className="border-border-stone/60 bg-charcoal placeholder:text-stone-warm focus:border-champagne mt-0.5 w-64 border px-2 py-0.5 text-[11px] text-white focus:outline-none"
                                    />
                                </div>
                            </>
                        ) : (
                            <span className="text-stone-warm text-xs">
                                No image selected
                            </span>
                        )}
                    </div>
                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border-border-stone text-stone-warm border px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={!selectedUrl && !customUrl}
                            onClick={handleConfirm}
                            className="bg-champagne hover:bg-champagne/90 text-charcoal px-5 py-2 text-xs font-medium tracking-wider uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Apply Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
