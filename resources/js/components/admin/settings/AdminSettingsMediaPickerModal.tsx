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

interface AdminSettingsMediaPickerModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    onSelect: (media: {
        id: number;
        url: string;
        alt?: string;
        name?: string;
    }) => void;
    currentId?: number | null;
}

export function AdminSettingsMediaPickerModal({
    isOpen,
    title = 'Select Media Asset',
    onClose,
    onSelect,
    currentId = null,
}: AdminSettingsMediaPickerModalProps) {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

    useEffect(() => {
        if (!isOpen) return;

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
                    if (currentId) {
                        const match = res.data.find((m) => m.id === currentId);
                        if (match) setSelectedItem(match);
                    }
                }
            } catch (err) {
                console.error('Failed to load media items', err);
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
    }, [isOpen, search, currentId]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedItem) {
            onSelect({
                id: selectedItem.id,
                url: selectedItem.url,
                alt: selectedItem.alt_text || selectedItem.name,
                name: selectedItem.name || selectedItem.file_name,
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-800">
                    <div>
                        <h3 className="font-serif text-lg font-light text-stone-900 dark:text-stone-100">
                            {title}
                        </h3>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                            Select an architectural asset from the ELIOR Media
                            Library.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Search Bar */}
                <div className="border-b border-stone-100 bg-stone-50/50 p-4 dark:border-stone-800/80 dark:bg-stone-950/40">
                    <input
                        type="text"
                        placeholder="Search media by title or filename..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-h-[40px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                    />
                </div>

                {/* Media Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <span className="font-mono text-xs tracking-wider text-stone-500 uppercase">
                                Loading Media Assets...
                            </span>
                        </div>
                    ) : mediaList.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <p className="font-serif text-base text-stone-700 dark:text-stone-300">
                                No media assets found
                            </p>
                            <p className="mt-1 font-mono text-xs text-stone-400">
                                Upload imagery in the Media Library first to
                                assign it here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {mediaList.map((item) => {
                                const isSelected = selectedItem?.id === item.id;
                                return (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`group relative flex flex-col overflow-hidden border text-left transition-all ${
                                            isSelected
                                                ? 'border-stone-900 ring-2 ring-stone-900 dark:border-stone-100 dark:ring-stone-100'
                                                : 'border-stone-200 hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600'
                                        }`}
                                    >
                                        <div className="aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                                            <img
                                                src={item.thumb_url || item.url}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-2">
                                            <p className="truncate font-mono text-[10px] font-medium text-stone-800 dark:text-stone-200">
                                                {item.name || item.file_name}
                                            </p>
                                            <p className="mt-0.5 font-mono text-[9px] text-stone-400">
                                                {item.size_formatted}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-stone-900 font-mono text-[10px] text-white dark:bg-stone-100 dark:text-stone-900">
                                                ✓
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 px-6 py-4 dark:border-stone-800 dark:bg-stone-900/50">
                    <div className="truncate font-mono text-xs text-stone-500">
                        {selectedItem ? (
                            <span>
                                Selected:{' '}
                                <strong className="text-stone-900 dark:text-stone-100">
                                    {selectedItem.name ||
                                        selectedItem.file_name}
                                </strong>
                            </span>
                        ) : (
                            <span>No asset selected</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-stone-300 px-4 py-2 font-mono text-xs text-stone-600 uppercase transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!selectedItem}
                            className="bg-stone-900 px-5 py-2 font-mono text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-stone-800 disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                        >
                            Select Asset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
