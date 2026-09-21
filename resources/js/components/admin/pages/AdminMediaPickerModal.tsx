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
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/60 px-6 py-4 dark:border-stone-800 dark:bg-stone-950/60">
                    <div>
                        <h3 className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100">
                            Select Architectural Imagery
                        </h3>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                            Choose from the Media Library or specify a custom asset path.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-stone-400 transition-colors hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Search & Custom URL Bar */}
                <div className="flex flex-col gap-3 border-b border-stone-200 bg-stone-50/40 p-4 sm:flex-row dark:border-stone-800 dark:bg-stone-950/40">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search media library by name or alt text..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-2.5 right-3 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
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
                            className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                        />
                    </div>
                </div>

                {/* Media Grid */}
                <div className="max-h-[450px] min-h-[300px] flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex h-48 items-center justify-center text-xs text-stone-500 dark:text-stone-400">
                            Loading media library assets...
                        </div>
                    ) : mediaList.length === 0 ? (
                        <div className="flex h-48 flex-col items-center justify-center text-center">
                            <p className="text-sm text-stone-600 dark:text-stone-300">
                                {search
                                    ? 'No matching media found for your search.'
                                    : 'Media library is currently empty.'}
                            </p>
                            <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
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
                                                ? 'border-stone-900 bg-stone-100 ring-1 ring-stone-900 dark:border-stone-100 dark:bg-stone-800 dark:ring-stone-100'
                                                : 'border-stone-200 bg-stone-50 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-700'
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
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                                                        ✓ Selected
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-1.5 truncate text-[11px] font-normal text-stone-800 dark:text-stone-200">
                                            {item.name || item.file_name}
                                        </p>
                                        <span className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
                                            {item.size_formatted}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Selected Preview & Actions */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-200 bg-stone-50/80 px-6 py-4 sm:flex-row dark:border-stone-800 dark:bg-stone-950/80">
                    <div className="flex w-full items-center gap-3 overflow-hidden sm:w-auto">
                        {selectedUrl ? (
                            <>
                                <img
                                    src={selectedUrl}
                                    alt="Preview"
                                    className="h-10 w-10 flex-shrink-0 border border-stone-200 object-cover dark:border-stone-700"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLElement
                                        ).style.display = 'none';
                                    }}
                                />
                                <div className="truncate text-xs">
                                    <p className="max-w-xs truncate text-stone-900 dark:text-stone-100 font-mono text-[11px]">
                                        {selectedUrl}
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Optional image alt text"
                                        value={selectedAlt}
                                        onChange={(e) =>
                                            setSelectedAlt(e.target.value)
                                        }
                                        className="mt-0.5 w-64 border border-stone-300 bg-white px-2 py-0.5 text-[11px] text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                            </>
                        ) : (
                            <span className="text-xs text-stone-400 dark:text-stone-500">
                                No image selected
                            </span>
                        )}
                    </div>
                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-stone-300 px-4 py-2 text-xs font-medium tracking-wider text-stone-700 uppercase transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={!selectedUrl && !customUrl}
                            onClick={handleConfirm}
                            className="bg-stone-900 px-5 py-2 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                        >
                            Apply Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
